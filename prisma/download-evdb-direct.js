const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const https = require('https');
const db = new PrismaClient();

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

// Parse homepage.html to get mapping between Brand + Model and Slug / ID
function getHomepageMap() {
  const filePath = path.join(__dirname, 'homepage.html');
  if (!fs.existsSync(filePath)) {
    console.error("homepage.html missing.");
    return new Map();
  }
  const html = fs.readFileSync(filePath, 'utf-8');
  const items = html.split('class="list-item');
  const map = new Map();

  for (let i = 1; i < items.length; i++) {
    const section = items[i];
    const idMatch = /data-vehicle-id="(\d+)"/.exec(section);
    if (!idMatch) continue;
    const evdbId = idMatch[1];

    const slugMatch = /href="\/car\/\d+\/([^\s>"]+)"/.exec(section) || /href=\/car\/\d+\/([^\s>]+)/.exec(section);
    const slug = slugMatch ? slugMatch[1] : null;

    const altMatch = /alt="([^"]+)"/.exec(section);
    const fullName = altMatch ? altMatch[1].trim() : 'Unknown';

    if (slug) {
      map.set(fullName.toLowerCase(), { id: evdbId, slug, fullName });
    }
  }
  return map;
}

// Download helper
function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destPath);
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': 'https://ev-database.org/'
      }
    }, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Status code: ${response.statusCode}`));
        return;
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close(resolve);
      });
    }).on('error', (err) => {
      fs.unlink(destPath, () => reject(err));
    });
  });
}

// Check URL helper
function checkUrl(url) {
  return new Promise((resolve) => {
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': 'https://ev-database.org/'
      }
    }, (res) => {
      resolve(res.statusCode === 200);
    }).on('error', () => {
      resolve(false);
    });
  });
}

function cleanName(str) {
  return str
    .replace(/[^a-zA-Z0-9\s-]/g, '')
    .trim()
    .replace(/[\s-]+/g, '_');
}

async function main() {
  console.log("=== Direct ev-database.org Image Downloader ===");
  const homepageMap = getHomepageMap();
  console.log(`Loaded ${homepageMap.size} mappings from homepage.html`);

  const vehicles = await db.electricVehicle.findMany();
  const publicDir = path.join(__dirname, '..', 'public', 'img', 'cars');

  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  let successCount = 0;
  let index = 0;

  for (const v of vehicles) {
    index++;
    const key = `${v.brand} ${v.model}`.toLowerCase().trim();
    const mapping = homepageMap.get(key);

    if (!mapping) {
      continue;
    }

    const destDir = path.join(publicDir, v.id);
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }

    // Force overwrite or check if empty
    const files = fs.readdirSync(destDir);
    // If files are already local and look correct, let's skip unless it's empty
    if (files.length > 0 && v.imageUrl && !v.imageUrl.includes('wikipedia') && !v.imageUrl.includes('ibb.co')) {
      continue;
    }

    // Standard evdb URL variations based on the homepage slug
    const cleanSlug = mapping.slug.replace(/-/g, '_');
    const cleanBrand = cleanName(v.brand);
    
    const candidates = [];
    
    // 1. Try full variations
    candidates.push(cleanSlug);
    candidates.push(`${cleanBrand}_${cleanName(v.model)}`);
    candidates.push(cleanSlug.replace(/Mercedes_Benz/g, 'Mercedes'));

    // 2. Try progressive reductions of the cleanSlug (e.g. Tesla_Model_3_RWD -> Tesla_Model_3 -> Tesla_Model)
    const slugParts = cleanSlug.split('_');
    for (let len = slugParts.length - 1; len >= 2; len--) {
      candidates.push(slugParts.slice(0, len).join('_'));
    }

    // 3. Generate variations with years appended (ev-database uses release years like _2022, _2023, _2024, _2025, _2026)
    const yearsToTry = [v.year, 2021, 2022, 2023, 2024, 2025, 2026, 2018, 2019, 2020];
    const baseCands = [...candidates];
    
    for (const cand of baseCands) {
      for (const y of yearsToTry) {
        candidates.push(`${cand}_${y}`);
      }
    }

    // 4. Lower/Upper case checks
    const finalCandidates = [];
    for (const cand of candidates) {
      finalCandidates.push(cand);
      finalCandidates.push(cand.toLowerCase());
      finalCandidates.push(cand.toUpperCase());
      
      // Title Case variant
      const titleCase = cand
        .split('_')
        .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join('_');
      finalCandidates.push(titleCase);
    }

    const uniqueCands = [...new Set(finalCandidates)];
    let matchedFolder = null;

    // Check all candidates in parallel for speed
    await Promise.all(uniqueCands.map(async (cand) => {
      if (matchedFolder) return;
      const testUrl = `https://ev-database.org/img/auto/${cand}/${cand}-01@2x.jpg`;
      const ok = await checkUrl(testUrl);
      if (ok) {
        matchedFolder = cand;
      }
    }));

    if (matchedFolder) {
      const targetUrl = `https://ev-database.org/img/auto/${matchedFolder}/${matchedFolder}-01@2x.jpg`;
      const destPath = path.join(destDir, 'image.jpg');
      
      try {
        console.log(`[${index}/${vehicles.length}] Downloading: ${v.brand} ${v.model} -> ${targetUrl}`);
        await downloadFile(targetUrl, destPath);
        
        // Also download up to 4 sub images if they exist
        const paths = [`/img/cars/${v.id}/image.jpg`];
        for (let imgIndex = 2; imgIndex <= 4; imgIndex++) {
          const subUrl = `https://ev-database.org/img/auto/${matchedFolder}/${matchedFolder}-0${imgIndex}@2x.jpg`;
          const subDestPath = path.join(destDir, `image-0${imgIndex}.jpg`);
          const hasSub = await checkUrl(subUrl);
          if (hasSub) {
            await downloadFile(subUrl, subDestPath);
            paths.push(`/img/cars/${v.id}/image-0${imgIndex}.jpg`);
          }
        }

        // Save local paths in database
        await db.electricVehicle.update({
          where: { id: v.id },
          data: {
            imageUrl: paths[0],
            imageUrls: JSON.stringify(paths)
          }
        });

        successCount++;
        console.log(`  Success! Synced ${paths.length} images.`);
      } catch (e) {
        console.error(`  Error downloading: ${e.message}`);
      }
    } else {
      console.log(`[${index}/${vehicles.length}] FAILED to find ev-db folder for: ${v.brand} ${v.model}`);
    }

    await sleep(200); // polite delay
  }

  console.log(`=== Task Finished! Successfully downloaded ${successCount} vehicles from ev-database.org ===`);
  await db.$disconnect();
}

main().catch(console.error);
