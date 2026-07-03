const fs = require('fs');
const path = require('path');

const sitemapCars = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'prisma', 'evdb_sitemap_cars.json'), 'utf-8'));

async function checkUrl(url) {
  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    return res.status === 200;
  } catch (e) {
    return false;
  }
}

async function main() {
  // Let's pick a few interesting slugs to test:
  // 1. Renault-Megane-E-Tech-EV60-220hp (ID 1521)
  // 2. BMW-i3-60-Ah (ID 1004)
  // 3. Nissan-LEAF-24-kWh (ID 1011)
  // 4. Kia-Soul-EV (ID 1012)
  // 5. Tesla-Model-S-70D (ID 1033)
  
  const testCars = [
    { id: '1521', slug: 'Renault-Megane-E-Tech-EV60-220hp' },
    { id: '1004', slug: 'BMW-i3-60-Ah' },
    { id: '1011', slug: 'Nissan-LEAF-24-kWh' },
    { id: '1012', slug: 'Kia-Soul-EV' },
    { id: '1033', slug: 'Tesla-Model-S-70D' }
  ];

  for (const c of testCars) {
    console.log(`\nTesting patterns for: ${c.slug}`);
    
    // Pattern 1: Exact slug with underscores
    // e.g. Renault_Megane_E-Tech_EV60_220hp
    const underscoreSlug = c.slug.replace(/-/g, '_');
    
    // Pattern 2: Exact slug with dashes
    const dashSlug = c.slug;

    // Pattern 3: Brand + first 2 words of slug
    const words = c.slug.split('-');
    const brand = words[0];
    const model = words.slice(1, 3).join('_');
    const brandModelUnderscore = `${brand}_${model}`;
    const brandModelDash = `${brand}-${words.slice(1, 3).join('-')}`;

    const candidates = [
      underscoreSlug,
      dashSlug,
      brandModelUnderscore,
      brandModelDash,
      // ev-database format: cleanBrand_cleanModel (sometimes without variant)
      // e.g. Tesla_Model_3
    ];

    const uniqueCandidates = [...new Set(candidates)];

    for (const cand of uniqueCandidates) {
      const url = `https://ev-database.org/img/auto/${cand}/${cand}-01@2x.jpg`;
      const ok = await checkUrl(url);
      if (ok) {
        console.log(`  -> SUCCESS: ${url}`);
      } else {
        // Try without @2x
        const urlNo2x = `https://ev-database.org/img/auto/${cand}/${cand}-01.jpg`;
        const okNo2x = await checkUrl(urlNo2x);
        if (okNo2x) {
          console.log(`  -> SUCCESS (No @2x): ${urlNo2x}`);
        } else {
          console.log(`  -> 404: ${cand}`);
        }
      }
    }
  }
}

main().catch(console.error);
