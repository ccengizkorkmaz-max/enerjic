"use server";

import { db } from '@/lib/db';

interface SocialCaptionsResult {
  success: boolean;
  instagram?: string;
  linkedin?: string;
  error?: string;
}

export async function generateSocialCaptionsAction(
  articleId: string
): Promise<SocialCaptionsResult> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return {
      success: false,
      error: 'GEMINI_API_KEY ortam değişkeni tanımlı değil.',
    };
  }

  try {
    const article = await db.article.findUnique({
      where: { id: articleId },
      include: { category: true }
    });

    if (!article) {
      return { success: false, error: 'Makale bulunamadı.' };
    }

    const prompt = `Sen profesyonel bir sosyal medya yöneticisisin. Aşağıdaki makale başlığı, özeti ve içeriği kullanarak:
1. Instagram için emojili, ilgi çekici, etkileşim uyandıracak ve hashtag'ler içeren bir açıklama metni yaz.
2. LinkedIn için daha profesyonel, sektörel analiz içeren, emojili ve hashtag'ler içeren bir açıklama metni yaz.

Makale Bilgileri:
Kategori: ${article.category.name}
Başlık: ${article.title}
Özet: ${article.summary}

ÇIKTINI SADECE aşağıdaki JSON formatında döndür (başka hiçbir şey ekleme, kod bloğu şeklinde sarma):
{
  "instagram": "Instagram için hazırlanan açıklama metni buraya",
  "linkedin": "LinkedIn için hazırlanan açıklama metni buraya"
}`;

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 2048,
          },
        }),
        signal: AbortSignal.timeout(30000),
      }
    );

    if (!geminiRes.ok) {
      const errBody = await geminiRes.text();
      return {
        success: false,
        error: `Gemini API hatası: HTTP ${geminiRes.status} - ${errBody.slice(0, 100)}`,
      };
    }

    const geminiData = await geminiRes.json();
    const rawText = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text || '';

    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return {
        success: false,
        error: 'Gemini yanıtından JSON çıkarılamadı.',
      };
    }

    const parsed = JSON.parse(jsonMatch[0]);

    return {
      success: true,
      instagram: parsed.instagram || '',
      linkedin: parsed.linkedin || '',
    };
  } catch (e: any) {
    console.error('AI Social Generator error: ', e);
    return {
      success: false,
      error: `AI metin üretilirken bir hata oluştu: ${e.message}`,
    };
  }
}

// 1. Check if Instagram is connected
export async function checkInstagramConnectionAction() {
  try {
    const session = await db.instagramSession.findFirst();
    if (session) {
      return { connected: true, accountName: session.accountName };
    }
    return { connected: false };
  } catch (e) {
    return { connected: false };
  }
}

// 2. Disconnect Instagram
export async function disconnectInstagramAction() {
  try {
    await db.instagramSession.deleteMany();
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

// Helper: upload base64 canvas image to freeimage.host so Instagram API can fetch it
async function uploadCanvasToFreeImage(base64Image: string) {
  // Strip mime prefix if present
  const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, "");
  
  const formData = new URLSearchParams();
  formData.append('key', '6d207e02198a847aa98d0a2a901485a5');
  formData.append('action', 'upload');
  formData.append('source', base64Data);
  formData.append('format', 'json');

  const res = await fetch('https://freeimage.host/api/1/upload', {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    throw new Error('Image hosting API returned status ' + res.status);
  }

  const json = await res.json();
  if (json.status_code !== 200 || !json.image || !json.image.url) {
    throw new Error('Image upload failed: ' + JSON.stringify(json));
  }

  return json.image.url;
}

// 3. Publish to Instagram
export async function publishToInstagramAction(
  base64Image: string,
  caption: string
) {
  try {
    // A. Check connection
    const session = await db.instagramSession.findFirst();
    if (!session) {
      return { success: false, error: 'Instagram bağlantısı bulunamadı.' };
    }

    const { accessToken, instagramAccountId } = session;

    // B. Upload image to public cloud
    console.log('Publishing: Uploading canvas to cloud hosting...');
    const publicImageUrl = await uploadCanvasToFreeImage(base64Image);
    console.log('Canvas uploaded to public URL:', publicImageUrl);

    // C. Create Media Container on Instagram
    const containerUrl = `https://graph.facebook.com/v19.0/${instagramAccountId}/media`;
    const containerRes = await fetch(containerUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        image_url: publicImageUrl,
        caption: caption,
        access_token: accessToken
      })
    });

    if (!containerRes.ok) {
      const errText = await containerRes.text();
      throw new Error(`Media container creation failed: HTTP ${containerRes.status} - ${errText}`);
    }

    const containerData = await containerRes.json();
    const creationId = containerData.id;

    // D. Poll Container Status (wait for container processing)
    let isReady = false;
    let retries = 5;
    
    console.log('Polling container status for ID:', creationId);
    while (!isReady && retries > 0) {
      await new Promise(r => setTimeout(r, 3000)); // wait 3s
      
      const statusUrl = `https://graph.facebook.com/v19.0/${creationId}?fields=status_code,status&access_token=${accessToken}`;
      const statusRes = await fetch(statusUrl);
      if (statusRes.ok) {
        const statusData = await statusRes.json();
        console.log(`Container status: ${statusData.status_code}`);
        if (statusData.status_code === 'FINISHED') {
          isReady = true;
          break;
        } else if (statusData.status_code === 'ERROR') {
          throw new Error(`Container processing failed: ${statusData.status}`);
        }
      }
      retries--;
    }

    if (!isReady) {
      throw new Error('Container processing timed out on Meta servers.');
    }

    // E. Publish Media Container
    const publishUrl = `https://graph.facebook.com/v19.0/${instagramAccountId}/media_publish`;
    const publishRes = await fetch(publishUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        creation_id: creationId,
        access_token: accessToken
      })
    });

    if (!publishRes.ok) {
      const errText = await publishRes.text();
      throw new Error(`Publish execution failed: HTTP ${publishRes.status} - ${errText}`);
    }

    const publishData = await publishRes.json();
    console.log('Successfully published to Instagram! Post ID:', publishData.id);

    return { success: true, postId: publishData.id };
  } catch (e: any) {
    console.error('publishToInstagramAction error:', e);
    return { success: false, error: e.message };
  }
}
