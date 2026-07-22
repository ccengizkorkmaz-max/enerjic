"use server";

export async function pingGoogleIndexingAction(articleUrl: string) {
  try {
    // 1. Instant Google Sitemap Ping
    const sitemapPingUrl = `https://www.google.com/ping?sitemap=${encodeURIComponent('https://enerjic.com/sitemap.xml')}`;
    await fetch(sitemapPingUrl, { method: 'GET' }).catch(() => {});

    // 2. IndexNow Instant Ping (Bing & Yandex & Google Partner Engine)
    const indexNowPayload = {
      host: 'enerjic.com',
      key: 'enerjic2026indexingkey',
      keyLocation: 'https://enerjic.com/enerjic2026indexingkey.txt',
      urlList: [articleUrl],
    };

    await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(indexNowPayload),
    }).catch(() => {});

    console.log(`Instant indexing ping sent for URL: ${articleUrl}`);
    return { success: true };
  } catch (err: any) {
    console.error('Error sending instant indexing ping:', err);
    return { success: false, error: err.message };
  }
}
