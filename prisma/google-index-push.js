const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const db = new PrismaClient();
const KEY_FILE = path.join(__dirname, 'service-account.json');

// Turkish slugify helper
function slugify(text) {
  const map = {
    'ç': 'c', 'Ç': 'c', 'ğ': 'g', 'Ğ': 'g', 'ı': 'i', 'I': 'i', 'İ': 'i',
    'ö': 'o', 'Ö': 'o', 'ş': 's', 'Ş': 's', 'ü': 'u', 'Ü': 'u', ' ': '-', '_': '-'
  };
  let str = text.toLowerCase();
  for (const key in map) {
    str = str.replaceAll(key, map[key]);
  }
  return str.replace(/[^a-z0-9-]/g, '').replace(/-+/g, '-').replace(/^-+|-+$/g, '');
}

// Zero-dependency Google OAuth2 token generator using native crypto
function getGoogleAccessToken(serviceAccount) {
  return new Promise((resolve, reject) => {
    try {
      const header = Buffer.from(JSON.stringify({ alg: 'RS256', typ: 'JWT' })).toString('base64url');
      
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

      // Request access token
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

// Push URL notification to Google Indexing API
async function pushUrl(url, accessToken) {
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

  const text = await res.text();
  return {
    status: res.status,
    body: text
  };
}

async function main() {
  console.log("=== Google Indexing API URL Pusher ===");

  if (!fs.existsSync(KEY_FILE)) {
    console.error(`\n❌ Error: service-account.json is missing in: ${KEY_FILE}`);
    console.error("\nHow to set up:");
    console.error("1. Go to Google Cloud Console (https://console.cloud.google.com)");
    console.error("2. Enable the 'Web Search Indexing API' for your project.");
    console.error("3. Go to IAM & Admin -> Service Accounts and create a new service account.");
    console.error("4. Create and download a private key in JSON format.");
    console.error(`5. Rename the downloaded file to 'service-account.json' and place it under: ${KEY_FILE}`);
    console.error("6. Crucial step: Open Google Search Console, select 'https://enerjic.com', and go to Settings -> Users and permissions.");
    console.error("7. Add the service account email (found in client_email field of JSON) as an OWNER of the property.");
    process.exit(1);
  }

  const serviceAccount = JSON.parse(fs.readFileSync(KEY_FILE, 'utf-8'));
  console.log(`Authenticating service account: ${serviceAccount.client_email}...`);
  const accessToken = await getGoogleAccessToken(serviceAccount);
  console.log("✓ Authenticated successfully! Received Google OAuth2 Access Token.");

  const baseUrl = 'https://enerjic.com';
  const urlsToPush = [];

  // Main landing
  urlsToPush.push(`${baseUrl}/sarj-istasyonlari`);

  // Turkey cities and popular districts list
  const pSEOData = [
    { city: 'İstanbul', districts: ['Kadıköy', 'Beşiktaş', 'Şişli', 'Ümraniye', 'Ataşehir', 'Sarıyer', 'Maltepe', 'Pendik', 'Üsküdar', 'Fatih', 'Beyoğlu', 'Beylikdüzü', 'Başakşehir', 'Esenyurt', 'Tuzla', 'Kartal'] },
    { city: 'Ankara', districts: ['Çankaya', 'Keçiören', 'Yenimahalle', 'Mamak', 'Etimesgut', 'Sincan', 'Gölbaşı', 'Altındağ', 'Kahramankazan'] },
    { city: 'İzmir', districts: ['Bornova', 'Karşıyaka', 'Konak', 'Bayraklı', 'Buca', 'Çeşme', 'Urla', 'Balçova', 'Gaziemir', 'Menderes', 'Aliağa'] },
    { city: 'Antalya', districts: ['Muratpaşa', 'Kepez', 'Alanya', 'Manavgat', 'Konyaaltı', 'Serik', 'Kemer', 'Kaş', 'Döşemealtı'] },
    { city: 'Bursa', districts: ['Nilüfer', 'Osmangazi', 'Yıldırım', 'Mudanya', 'Gemlik', 'İnegöl'] },
    { city: 'Muğla', districts: ['Bodrum', 'Fethiye', 'Marmaris', 'Milas', 'Menteşe', 'Ortaca', 'Dalaman'] },
    { city: 'Kocaeli', districts: ['İzmit', 'Gebze', 'Darıca', 'Kartepe', 'Başiskele', 'Gölcük', 'Çayırova'] },
    { city: 'Adana', districts: ['Seyhan', 'Çukurova', 'Yüreğir', 'Sarıçam'] },
    { city: 'Mersin', districts: ['Yenişehir', 'Mezitli', 'Tarsus', 'Akdeniz'] },
    { city: 'Gaziantep', districts: ['Şehitkamil', 'Şahinbey'] },
    { city: 'Konya', districts: ['Selçuklu', 'Meram', 'Karatay'] },
    { city: 'Kayseri', districts: ['Melikgazi', 'Kocasinan', 'Talas'] },
    { city: 'Eskişehir', districts: ['Odunpazarı', 'Tepebaşı'] },
    { city: 'Denizli', districts: ['Pamukkale', 'Merkezefendi'] },
    { city: 'Samsun', districts: ['Atakum', 'İlkadım', 'Canik'] },
    { city: 'Sakarya', districts: ['Adapazarı', 'Serdivan', 'Erenler'] },
    { city: 'Trabzon', districts: ['Ortahisar', 'Akçaabat'] },
    { city: 'Aydın', districts: ['Efeler', 'Kuşadası', 'Didim', 'Söke'] },
    { city: 'Balıkesir', districts: ['Altıeylül', 'Karesi', 'Edremit', 'Bandırma', 'Ayvalık'] },
    { city: 'Tekirdağ', districts: ['Süleymanpaşa', 'Çorlu', 'Çerkezköy'] },
    { city: 'Çanakkale', districts: ['Merkez', 'Gelibolu', 'Biga', 'Ayvacık'] }
  ];

  // 81 Cities without districts (as fallbacks)
  const remainingCities = [
    'Afyonkarahisar', 'Ağrı', 'Aksaray', 'Amasya', 'Artvin', 'Ardahan', 'Batman', 'Bayburt',
    'Bartın', 'Bingöl', 'Bilecik', 'Bitlis', 'Bolu', 'Burdur', 'Çankırı', 'Çorum', 'Düzce',
    'Diyarbakır', 'Edirne', 'Elazığ', 'Erzincan', 'Erzurum', 'Giresun', 'Gümüşhane', 'Hakkari',
    'Hatay', 'Iğdır', 'Isparta', 'Kahramanmaraş', 'Karabük', 'Karaman', 'Kars', 'Kastamonu',
    'Kırıkkale', 'Kırklareli', 'Kırşehir', 'Kilis', 'Kütahya', 'Malatya', 'Manisa', 'Mardin',
    'Muş', 'Nevşehir', 'Niğde', 'Ordu', 'Osmaniye', 'Rize', 'Siirt', 'Sinop', 'Sivas', 'Şanlıurfa',
    'Şırnak', 'Tokat', 'Tunceli', 'Uşak', 'Van', 'Yalova', 'Yozgat', 'Zonguldak'
  ];

  // Generate URL notifications
  // 1. Add all defined cities
  pSEOData.forEach(item => {
    urlsToPush.push(`${baseUrl}/sarj-istasyonlari/${slugify(item.city)}`);
  });
  remainingCities.forEach(city => {
    urlsToPush.push(`${baseUrl}/sarj-istasyonlari/${slugify(city)}`);
  });

  // 2. Add all defined districts
  pSEOData.forEach(item => {
    item.districts.forEach(dist => {
      urlsToPush.push(`${baseUrl}/sarj-istasyonlari/${slugify(item.city)}/${slugify(dist)}`);
    });
  });

  console.log(`\nGenerated ${urlsToPush.length} dynamic pSEO URLs from static registry.`);

  // Note: Google Indexing API limit is 200 URLs per day for default free tier
  const submitLimit = 200;
  const targetUrls = urlsToPush.slice(0, submitLimit);
  console.log(`Submitting first ${targetUrls.length} URLs (daily free API limit is 200 requests)...`);

  let successCount = 0;
  for (let i = 0; i < targetUrls.length; i++) {
    const url = targetUrls[i];
    console.log(`[${i + 1}/${targetUrls.length}] Publishing: ${url}`);
    
    try {
      const response = await pushUrl(url, accessToken);
      if (response.status === 200) {
        successCount++;
        console.log("  ✓ Success");
      } else {
        console.error(`  ✗ Failed with status ${response.status}: ${response.body}`);
      }
    } catch (e) {
      console.error(`  ✗ Request error: ${e.message}`);
    }

    // Polite delay to avoid rate limits
    await new Promise(r => setTimeout(r, 500));
  }

  console.log(`\n=== Finished! Successfully submitted ${successCount}/${targetUrls.length} URLs to Google Search Console ===`);
  await db.$disconnect();
}

main().catch(console.error);
