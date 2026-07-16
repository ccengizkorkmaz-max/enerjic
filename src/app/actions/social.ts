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
