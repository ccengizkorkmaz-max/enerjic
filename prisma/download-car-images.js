const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const db = new PrismaClient();

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

// Parse homepage.html to get mapping between Brand + Model and Slug / ID for all 1375 vehicles
function getHomepageMap() {
  const filePath = path.join(__dirname, '..', 'prisma', 'homepage.html');
  if (!fs.existsSync(filePath)) {
    console.error("homepage.html missing. Save it first.");
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

    const slugMatch = /href=\/car\/\d+\/([^\s>]+)/.exec(section);
    const slug = slugMatch ? slugMatch[1] : null;

    const altMatch = /alt="([^"]+)"/.exec(section);
    const fullName = altMatch ? altMatch[1].trim() : 'Unknown';

    if (slug) {
      // Key by lowercase trimmed brand + model name
      map.set(fullName.toLowerCase(), { id: evdbId, slug, fullName });
    }
  }
  return map;
}

function cleanName(str) {
  return str
    .replace(/[^a-zA-Z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '_');
}

async function checkUrl(url) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      },
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    return res.status === 200;
  } catch (e) {
    return false;
  }
}

async function downloadImages(folderName, destDir, vehicleId) {
  const localPaths = [];
  let successCount = 0;

  for (let i = 1; i <= 4; i++) {
    const padIdx = String(i).padStart(2, '0');
    const remoteUrl = `https://ev-database.org/img/auto/${folderName}/${folderName}-${padIdx}@2x.jpg`;
    const destFilename = `${folderName}-${padIdx}.jpg`;
    const destPath = path.join(destDir, destFilename);
    const localUrlPath = `/img/cars/${vehicleId}/${destFilename}`;

    if (fs.existsSync(destPath)) {
      localPaths.push(localUrlPath);
      successCount++;
      continue;
    }

    try {
      const res = await fetch(remoteUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });

      if (res.status === 200) {
        const buffer = Buffer.from(await res.arrayBuffer());
        fs.writeFileSync(destPath, buffer);
        localPaths.push(localUrlPath);
        successCount++;
      }
    } catch (e) {
      // Quiet fail for missing images (like 3rd or 4th photo slots)
    }
    await sleep(50);
  }

  return successCount > 0 ? localPaths : null;
}

async function main() {
  console.log("=== EV Image Syncer ===");
  const homepageMap = getHomepageMap();
  console.log(`Loaded ${homepageMap.size} mappings from homepage.`);

  const vehicles = await db.electricVehicle.findMany();
  console.log(`Loaded ${vehicles.length} database vehicles.`);

  const publicDir = path.join(__dirname, '..', 'public', 'img', 'cars');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  let index = 0;
  let successCount = 0;

  for (const v of vehicles) {
    index++;
    const key = `${v.brand} ${v.model}`.toLowerCase().trim();
    const mapping = homepageMap.get(key);

    if (!mapping) {
      console.log(`[${index}/${vehicles.length}] Mapping missing for: ${v.brand} ${v.model}`);
      continue;
    }

    const destDir = path.join(publicDir, v.id);
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }

    // Check if we already have files downloaded locally
    const files = fs.readdirSync(destDir);
    if (files.length > 0) {
      // Already has images, skip downloading
      continue;
    }

    // Generate candidates for folder matching on CDN
    // E.g. for "BMW-iX1-xDrive30" slug:
    const cleanBrand = cleanName(v.brand);
    const brandsToTry = [cleanBrand];
    if (v.brand.toLowerCase() === 'mercedes-benz') {
      brandsToTry.push('Mercedes');
    }

    const modelWords = v.model.trim().split(/\s+/);
    
    // Core model candidates (before year is appended!)
    const coreModelCands = [];
    const firstWord = cleanName(modelWords[0]);
    coreModelCands.push(firstWord);
    coreModelCands.push(firstWord.replace(/_(\d+)/g, '$1'));

    if (modelWords.length >= 2) {
      const firstTwo = cleanName(modelWords.slice(0, 2).join(' '));
      coreModelCands.push(firstTwo);
      coreModelCands.push(firstTwo.replace(/_(\d+)/g, '$1'));
    }

    const uniqueCoreModels = [...new Set(coreModelCands)];

    const candidates = [];
    
    // Candidate 1: Exact slug with underscores
    let baseSlug = mapping.slug.replace(/-/g, '_');
    candidates.push(baseSlug);
    // Replace only single/double digit model numbers in exact slug
    candidates.push(baseSlug.replace(/_(\d{1,2})_/g, '$1_'));
    
    // Also support Mercedes simplification in slug
    const mercSlug = baseSlug.replace(/Mercedes_Benz/gi, 'Mercedes').replace(/Mercedes-Benz/gi, 'Mercedes');
    if (mercSlug !== baseSlug) {
      candidates.push(mercSlug);
      candidates.push(mercSlug.replace(/_(\d{1,2})_/g, '$1_'));
    }

    for (const b of brandsToTry) {
      for (const m of uniqueCoreModels) {
        // Candidate 2 & 3: Brand + core model (e.g. Hyundai_IONIQ5)
        candidates.push(`${b}_${m}`);
        
        // Candidate 4 & 5: Brand + core model + years (2018 - 2026)
        for (let year = 2018; year <= 2026; year++) {
          candidates.push(`${b}_${m}_${year}`);
        }
      }
    }

    // Casing variations for all candidates
    const folderVariations = [];
    candidates.forEach(cand => {
      folderVariations.push(cand);
      folderVariations.push(cand.toUpperCase());
      folderVariations.push(cand.toLowerCase());

      // TitleCase: E.g., Hyundai_Ioniq_5, Audi_Q4_e-tron
      const titleCase = cand
        .split('_')
        .map(word => {
          return word
            .split('-')
            .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
            .join('-');
        })
        .join('_')
        .replace(/e-soul/gi, 'e-Soul')
        .replace(/e-tron/gi, 'e-tron')
        .replace(/e-traveller/gi, 'e-Traveller')
        .replace(/e-partner/gi, 'e-Partner')
        .replace(/e-rifter/gi, 'e-Rifter')
        .replace(/e-berlingo/gi, 'e-Berlingo')
        .replace(/e-c4/gi, 'e-C4')
        .replace(/e-c3/gi, 'e-C3')
        .replace(/e-208/gi, 'e-208')
        .replace(/e-2008/gi, 'e-2008')
        .replace(/e-308/gi, 'e-308')
        .replace(/e-3008/gi, 'e-3008')
        .replace(/e-5008/gi, 'e-5008');

      folderVariations.push(titleCase);
    });

    const uniqueFolders = [...new Set(folderVariations)];

    console.log(`[${index}/${vehicles.length}] Checking images for ${v.brand} ${v.model}...`);
    
    let matchedFolder = null;
    // Check all folder candidates in parallel for maximum speed
    await Promise.all(uniqueFolders.map(async folder => {
      if (matchedFolder) return; // Skip if we already found a match
      const testUrl = `https://ev-database.org/img/auto/${folder}/${folder}-01@2x.jpg`;
      const ok = await checkUrl(testUrl);
      if (ok) {
        matchedFolder = folder;
      }
    }));

    if (matchedFolder) {
      console.log(`  -> Downloading images using folder: "${matchedFolder}"`);
      const paths = await downloadImages(matchedFolder, destDir, v.id);
      if (paths && paths.length > 0) {
        // Update database with local paths
        await db.electricVehicle.update({
          where: { id: v.id },
          data: {
            imageUrl: paths[0],
            imageUrls: JSON.stringify(paths)
          }
        });
        successCount++;
        console.log(`  -> Synced ${paths.length} images.`);
      }
    } else {
      console.log(`  -> FAILED to find folder for ${v.brand} ${v.model}`);
    }

    await sleep(50);
  }

  console.log(`\n=== Synced ${successCount} new vehicle image sets. ===`);
  await db.$disconnect();
}

main().catch(console.error);
