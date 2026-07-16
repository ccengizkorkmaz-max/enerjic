import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import sitemap from '@/app/sitemap'
import crypto from 'crypto'
import path from 'path'
import fs from 'fs'

export const maxDuration = 300
export const dynamic = 'force-dynamic'

const DAILY_QUOTA = 200
const RATE_LIMIT_MS = 500

function getGoogleAccessToken(serviceAccount: any): Promise<string> {
    return new Promise((resolve, reject) => {
        try {
            const header = Buffer.from(JSON.stringify({
                alg: 'RS256',
                typ: 'JWT'
            })).toString('base64url');
            
            const now = Math.floor(Date.now() / 1000);
            const payload = Buffer.from(JSON.stringify({
                iss: serviceAccount.client_email,
                scope: 'https://www.googleapis.com/auth/indexing',
                aud: 'https://oauth2.googleapis.com/token',
                exp: now + 3600,
                iat: now
            })).toString('base64url');

            const signInput = `${header}.${payload}`;
            const sign = crypto.createSign('RSA-SHA256');
            sign.update(signInput);
            const signature = sign.sign(serviceAccount.private_key, 'base64url');

            const jwt = `${signInput}.${signature}`;

            const reqBody = new URLSearchParams();
            reqBody.append('grant_type', 'urn:ietf:params:oauth:grant-type:jwt-bearer');
            reqBody.append('assertion', jwt);

            fetch('https://oauth2.googleapis.com/token', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: reqBody
            })
            .then(res => {
                if (!res.ok) {
                    res.text().then(t => reject(new Error(`OAuth Token Error: ${res.status} - ${t}`)));
                } else {
                    res.json().then(j => resolve(j.access_token));
                }
            })
            .catch(reject);
        } catch (e) {
            reject(e);
        }
    });
}

export async function GET(req: NextRequest) {
    // 1. Authorization Check
    const authHeader = req.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET
    const isDev = process.env.NODE_ENV === 'development'

    if (!isDev && cronSecret && authHeader !== `Bearer ${cronSecret}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 2. Load Google Service Account key
    const keyFilePath = path.join(process.cwd(), 'prisma', 'service-account.json')
    if (!fs.existsSync(keyFilePath)) {
        return NextResponse.json({ error: 'Google Service Account key file not found.' }, { status: 500 })
    }

    try {
        const serviceAccount = JSON.parse(fs.readFileSync(keyFilePath, 'utf-8'));
        
        // 3. Resolve current offset from database settings
        const offsetSetting = await db.setting.findUnique({
            where: { key: 'google_indexing_offset' }
        })
        const prevOffset = offsetSetting ? parseInt(offsetSetting.value, 10) : 0

        // 4. Load all URLs from sitemap
        const sitemapEntries = await sitemap()
        const allUrls = sitemapEntries.map(e => e.url)
        const totalUrls = allUrls.length

        // Loop back to 0 if we reached the end
        const currentOffset = prevOffset >= totalUrls ? 0 : prevOffset
        const batchUrls = allUrls.slice(currentOffset, currentOffset + DAILY_QUOTA)

        if (batchUrls.length === 0) {
            return NextResponse.json({
                success: true,
                message: 'No URLs to submit.',
                offset: currentOffset,
                total: totalUrls
            })
        }

        // 5. Authenticate Google API
        const accessToken = await getGoogleAccessToken(serviceAccount)

        // 6. Publish to Indexing API
        let successCount = 0;
        let failCount = 0;
        const successes: string[] = []
        const failures: { url: string; error: string }[] = []

        for (const url of batchUrls) {
            try {
                const res = await fetch('https://indexing.googleapis.com/v3/urlNotifications:publish', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`
                    },
                    body: JSON.stringify({
                        url: url,
                        type: 'URL_UPDATED'
                    })
                });

                if (res.status === 200) {
                    successCount++
                    successes.push(url)
                } else {
                    const text = await res.text()
                    failCount++
                    failures.push({ url, error: `Status ${res.status}: ${text}` })
                }
            } catch (error: any) {
                failCount++
                failures.push({ url, error: error.message })
            }
            // Small delay to protect rate limit
            await new Promise(resolve => setTimeout(resolve, RATE_LIMIT_MS))
        }

        const nextOffset = currentOffset + successCount + failCount

        // 7. Update offset in database
        await db.setting.upsert({
            where: { key: 'google_indexing_offset' },
            update: { value: String(nextOffset) },
            create: { key: 'google_indexing_offset', value: String(nextOffset) }
        })

        return NextResponse.json({
            success: true,
            message: `Batch complete: ${successCount} succeeded, ${failCount} failed.`,
            meta: {
                previous_offset: currentOffset,
                next_offset: nextOffset,
                total_urls: totalUrls,
                success_count: successCount,
                fail_count: failCount,
                successes,
                failures
            }
        })

    } catch (error: any) {
        console.error('[Indexing Cron] Server Error:', error.message)
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 })
    }
}

export async function POST(req: NextRequest) {
    return GET(req)
}
