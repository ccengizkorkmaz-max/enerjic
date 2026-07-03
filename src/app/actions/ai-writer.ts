"use server";

/**
 * AI Writer Assistant
 * Fetches content from a source URL, extracts article text,
 * and uses Google Gemini API to rewrite it as a unique Turkish article.
 */

interface AIDraftResult {
  success: boolean;
  title?: string;
  summary?: string;
  content?: string;
  error?: string;
}

/**
 * Extract readable text from raw HTML by stripping tags and pulling main content.
 */
function extractTextFromHtml(html: string): string {
  // Remove script, style, nav, header, footer tags and their contents
  let cleaned = html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<nav[\s\S]*?<\/nav>/gi, '')
    .replace(/<header[\s\S]*?<\/header>/gi, '')
    .replace(/<footer[\s\S]*?<\/footer>/gi, '')
    .replace(/<aside[\s\S]*?<\/aside>/gi, '');

  // Extract text from paragraph tags
  const paragraphs: string[] = [];
  const pRegex = /<p[^>]*>([\s\S]*?)<\/p>/gi;
  let match;
  while ((match = pRegex.exec(cleaned)) !== null) {
    const text = match[1]
      .replace(/<[^>]+>/g, '') // strip inner tags
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .trim();
    if (text.length > 30) {
      paragraphs.push(text);
    }
  }

  // Also extract headings for context
  const headings: string[] = [];
  const hRegex = /<h[1-6][^>]*>([\s\S]*?)<\/h[1-6]>/gi;
  while ((match = hRegex.exec(cleaned)) !== null) {
    const text = match[1].replace(/<[^>]+>/g, '').trim();
    if (text.length > 5) {
      headings.push(text);
    }
  }

  const fullText = [
    ...headings.map((h) => `## ${h}`),
    '',
    ...paragraphs,
  ].join('\n\n');

  // Limit to ~4000 chars to stay within token limits
  return fullText.slice(0, 4000);
}

export async function generateArticleDraftFromUrl(
  sourceUrl: string
): Promise<AIDraftResult> {
  if (!sourceUrl || !sourceUrl.trim()) {
    return { success: false, error: 'Kaynak URL boş bırakılamaz.' };
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return {
      success: false,
      error:
        'GEMINI_API_KEY ortam değişkeni tanımlı değil. .env dosyanıza GEMINI_API_KEY=your_key_here satırını ekleyin.',
    };
  }

  // Step 1: Fetch source page
  let sourceHtml: string;
  try {
    const res = await fetch(sourceUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Accept: 'text/html',
      },
      signal: AbortSignal.timeout(15000),
    });

    if (!res.ok) {
      return {
        success: false,
        error: `Kaynak sayfa getirilemedi: HTTP ${res.status}`,
      };
    }
    sourceHtml = await res.text();
  } catch (e: any) {
    return {
      success: false,
      error: `Kaynak sayfaya ulaşılamadı: ${e.message}`,
    };
  }

  // Step 2: Extract readable text
  const extractedText = extractTextFromHtml(sourceHtml);
  if (extractedText.length < 100) {
    return {
      success: false,
      error:
        'Kaynak sayfadan yeterli metin çıkarılamadı. Lütfen farklı bir URL deneyin.',
    };
  }

  // Step 3: Call Gemini API
  const prompt = `Sen profesyonel bir Türkçe enerji ve teknoloji gazetecisiniz. Aşağıdaki İngilizce veya yabancı dildeki kaynak metinden esinlenerek, tamamen özgün ve yeni bir Türkçe haber makalesi yaz.

KURALLAR:
- Kaynak metni birebir çevirme, kendi cümlelerinle sıfırdan yaz.
- Türkiye bağlamına uygun yorumlar ve karşılaştırmalar ekle.
- SEO dostu, akıcı ve bilgilendirici bir dil kullan.
- Paragrafları <p> etiketleriyle sar.
- Alt başlıkları <h2> etiketleriyle sar.

ÇIKTINI SADECE aşağıdaki JSON formatında döndür (başka hiçbir şey ekleme):
{
  "title": "Türkçe haber başlığı",
  "summary": "2-3 cümlelik kısa özet",
  "content": "<p>Paragraf 1</p><h2>Alt Başlık</h2><p>Paragraf 2</p>..."
}

KAYNAK METİN:
${extractedText}`;

  try {
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 4096,
          },
        }),
        signal: AbortSignal.timeout(60000),
      }
    );

    if (!geminiRes.ok) {
      const errBody = await geminiRes.text();
      return {
        success: false,
        error: `Gemini API hatası: HTTP ${geminiRes.status} - ${errBody.slice(0, 200)}`,
      };
    }

    const geminiData = await geminiRes.json();
    const rawText =
      geminiData?.candidates?.[0]?.content?.parts?.[0]?.text || '';

    // Extract JSON from response (may be wrapped in markdown code block)
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return {
        success: false,
        error: 'Gemini yanıtından JSON çıkarılamadı. Lütfen tekrar deneyin.',
      };
    }

    const parsed = JSON.parse(jsonMatch[0]);

    return {
      success: true,
      title: parsed.title || '',
      summary: parsed.summary || '',
      content: parsed.content || '',
    };
  } catch (e: any) {
    return {
      success: false,
      error: `AI içerik üretim hatası: ${e.message}`,
    };
  }
}
