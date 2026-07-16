import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  const appId = process.env.FACEBOOK_APP_ID;
  const appSecret = process.env.FACEBOOK_APP_SECRET;

  const host = request.headers.get('host') || 'localhost:3000';
  const protocol = host.startsWith('localhost') || host.startsWith('127.0.0.1') ? 'http' : 'https';
  const redirectUri = `${protocol}://${host}/api/social/instagram/callback`;

  const adminRedirect = `${protocol}://${host}/admin`;

  if (error || !code) {
    return NextResponse.redirect(`${adminRedirect}?instagram=error&reason=${encodeURIComponent(error || 'code_missing')}`);
  }

  if (!appId || !appSecret) {
    return NextResponse.redirect(`${adminRedirect}?instagram=error&reason=credentials_missing`);
  }

  try {
    // 1. Exchange code for Short-Lived Access Token
    const tokenUrl = `https://graph.facebook.com/v19.0/oauth/access_token?client_id=${appId}&redirect_uri=${encodeURIComponent(redirectUri)}&client_secret=${appSecret}&code=${code}`;
    const tokenRes = await fetch(tokenUrl);
    if (!tokenRes.ok) {
      throw new Error(`Token exchange failed: HTTP ${tokenRes.status}`);
    }
    const tokenData = await tokenRes.json();
    const shortToken = tokenData.access_token;

    // 2. Exchange shortToken for Long-Lived Access Token (60 days validity)
    const longLivedUrl = `https://graph.facebook.com/v19.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${appId}&client_secret=${appSecret}&fb_exchange_token=${shortToken}`;
    const llRes = await fetch(longLivedUrl);
    if (!llRes.ok) {
      throw new Error(`Long-lived token exchange failed: HTTP ${llRes.status}`);
    }
    const llData = await llRes.json();
    const longToken = llData.access_token;

    // 3. Get connected Facebook Pages
    const pagesUrl = `https://graph.facebook.com/v19.0/me/accounts?access_token=${longToken}`;
    const pagesRes = await fetch(pagesUrl);
    if (!pagesRes.ok) {
      throw new Error(`Failed to fetch accounts: HTTP ${pagesRes.status}`);
    }
    const pagesData = await pagesRes.json();

    if (!pagesData.data || pagesData.data.length === 0) {
      return NextResponse.redirect(`${adminRedirect}?instagram=error&reason=no_facebook_pages`);
    }

    // 4. Find linked Instagram Business Account ID
    let instagramAccountId = null;
    let accountName = null;

    for (const page of pagesData.data) {
      const igUrl = `https://graph.facebook.com/v19.0/${page.id}?fields=instagram_business_account,name&access_token=${longToken}`;
      const igRes = await fetch(igUrl);
      if (igRes.ok) {
        const igData = await igRes.json();
        if (igData.instagram_business_account) {
          instagramAccountId = igData.instagram_business_account.id;
          accountName = igData.name;
          break; // Found it!
        }
      }
    }

    if (!instagramAccountId) {
      return NextResponse.redirect(`${adminRedirect}?instagram=error&reason=no_linked_instagram_account`);
    }

    // 5. Store / Update in DB (Only keep one active session)
    await db.instagramSession.deleteMany(); // Clear existing
    await db.instagramSession.create({
      data: {
        accessToken: longToken,
        instagramAccountId: instagramAccountId,
        accountName: accountName || 'Instagram Business Account'
      }
    });

    return NextResponse.redirect(`${adminRedirect}?instagram=success`);
  } catch (err: any) {
    console.error('Instagram OAuth Callback error:', err);
    return NextResponse.redirect(`${adminRedirect}?instagram=error&reason=${encodeURIComponent(err.message)}`);
  }
}
