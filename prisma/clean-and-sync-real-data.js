const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const db = new PrismaClient();

const sitemapPath = path.join(__dirname, '..', 'prisma', 'evdb_sitemap_cars.json');
if (!fs.existsSync(sitemapPath)) {
  console.error("Sitemap JSON not found. Please run download-sitemap.js first.");
  process.exit(1);
}
const sitemapCars = JSON.parse(fs.readFileSync(sitemapPath, 'utf-8'));

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

function getWordSet(str) {
  return new Set(
    str
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .split(/[\s-]+/)
      .filter(w => w.length > 0)
  );
}

// Strict matching to prevent matching "Model Y" to "Model 3"
function findBestSitemapCar(v) {
  const brandLower = v.brand.toLowerCase().replace(/[^a-z0-9]/g, '');
  const modelLower = v.model.toLowerCase();
  
  // Find words of model
  const modelWords = modelLower.split(/\s+/).filter(w => w.length > 0);
  if (modelWords.length === 0) return null;
  const firstModelWord = modelWords[0];

  let bestMatch = null;
  let maxOverlap = 0;

  for (const sc of sitemapCars) {
    const scSlugLower = sc.slug.toLowerCase();
    
    // 1. Brand must match strictly
    const hasBrand = scSlugLower.includes(brandLower);
    if (!hasBrand) continue;

    // 2. Core model name must match strictly
    // e.g. if database model is "Model Y", slug must contain "model-y"
    // E.g. if database model starts with "iX1", slug must contain "ix1"
    const hasCoreModel = scSlugLower.includes(firstModelWord);
    if (!hasCoreModel) continue;

    // Additional check for unique identifiers like 3 vs Y, iX1 vs iX2, i5 vs i7
    if (firstModelWord === '3' && scSlugLower.includes('model-y')) continue;
    if (firstModelWord === 'y' && scSlugLower.includes('model-3')) continue;
    if (firstModelWord === 'ix1' && scSlugLower.includes('ix2')) continue;
    if (firstModelWord === 'ix2' && scSlugLower.includes('ix1')) continue;
    if (firstModelWord === 'i5' && scSlugLower.includes('i7')) continue;
    if (firstModelWord === 'i7' && scSlugLower.includes('i5')) continue;

    // Calculate overlap score
    const dbWords = getWordSet(`${v.brand} ${v.model} ${v.variant || ''}`);
    const scWords = getWordSet(sc.slug);
    
    let overlap = 0;
    for (const w of dbWords) {
      if (scWords.has(w)) overlap++;
    }

    if (overlap > maxOverlap) {
      maxOverlap = overlap;
      bestMatch = sc;
    }
  }

  // Overlap score should be at least 2
  return maxOverlap >= 2 ? bestMatch : null;
}

async function scrapeImageFolderName(carId, slug) {
  const url = `https://ev-database.org/car/${carId}/${slug}`;
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });

    if (!res.ok) return null;
    const html = await res.text();

    // Regex to find /img/auto/Brand_Model/Brand_Model-01@2x.jpg
    const imgRegex = /\/img\/auto\/([a-zA-Z0-9_-]+)\//;
    const match = imgRegex.exec(html);
    if (match && match[1]) {
      return match[1];
    }
  } catch (e) {
    console.error(`  Error scraping detail page for ${slug}: ${e.message}`);
  }
  return null;
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
      // Quiet fail for individual image slots if they don't exist (some cars only have 1 or 2 images)
    }
    await sleep(50);
  }

  return successCount > 0 ? localPaths : null;
}

async function main() {
  console.log("=== EV Database Cleaner and Smart Image Syncer ===");
  
  const vehicles = await db.electricVehicle.findMany();
  console.log(`Currently have ${vehicles.length} vehicles in local database.`);

  const publicDir = path.join(__dirname, '..', 'public', 'img', 'cars');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  let matchedCount = 0;
  let deletedCount = 0;
  let imageSyncedCount = 0;

  for (const v of vehicles) {
    const matchedSc = findBestSitemapCar(v);

    if (!matchedSc) {
      // Speculative/Hallucinated/Non-existent car on ev-database.org
      console.log(`[-] Deleting speculative car: ${v.brand} ${v.model} (${v.year})`);
      await db.electricVehicle.delete({ where: { id: v.id } });
      deletedCount++;
      continue;
    }

    matchedCount++;
    console.log(`[+] Match found: ${v.brand} ${v.model} ===> ${matchedSc.slug}`);

    const destDir = path.join(publicDir, v.id);
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }

    // Check if we already have files downloaded locally
    const existingFiles = fs.readdirSync(destDir);
    if (existingFiles.length > 0) {
      // Already has images, keep it but we might clean model name
      continue;
    }

    // Fetch the correct image folder name from the live page HTML
    console.log(`    Fetching image folder from detail page: ID ${matchedSc.id}`);
    const folderName = await scrapeImageFolderName(matchedSc.id, matchedSc.slug);

    if (folderName) {
      console.log(`    Found image folder name: "${folderName}". Downloading...`);
      const paths = await downloadImages(folderName, destDir, v.id);

      if (paths && paths.length > 0) {
        // Update database with the exact correct image URLs
        await db.electricVehicle.update({
          where: { id: v.id },
          data: {
            imageUrl: paths[0],
            imageUrls: JSON.stringify(paths)
          }
        });
        console.log(`    Successfully synced ${paths.length} images.`);
        imageSyncedCount++;
      } else {
        console.log(`    Failed to download images for folder: ${folderName}`);
      }
    } else {
      console.log(`    Could not find image folder name in detail page HTML.`);
    }

    await sleep(100);
  }

  console.log("\n=== Operation Completed ===");
  console.log(`Matched & Kept: ${matchedCount} vehicles.`);
  console.log(`Deleted Speculative: ${deletedCount} vehicles.`);
  console.log(`Synced new images for: ${imageSyncedCount} vehicles.`);

  await db.$disconnect();
}

main().catch(console.error);
