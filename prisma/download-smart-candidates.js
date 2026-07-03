const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const db = new PrismaClient();

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

function cleanName(str) {
  return str
    .replace(/[^a-zA-Z0-9\s-]/g, '') // Keep spaces and dashes
    .trim()
    .replace(/\s+/g, '_'); // ONLY replace spaces with underscores
}

async function tryDownloadCandidate(brand, modelName, id, index, destDir) {
  const cleanBrand = cleanName(brand);
  const cleanModel = cleanName(modelName);
  
  // Generate casing variations for folders
  // e.g. BYD_ATTO_3 vs BYD_Atto_3 vs byd_atto_3
  const folderVariations = [
    `${cleanBrand}_${cleanModel}`, // Mixed case
    `${cleanBrand.toUpperCase()}_${cleanModel.toUpperCase()}`, // UPPERCASE
    `${cleanBrand.toLowerCase()}_${cleanModel.toLowerCase()}` // lowercase
  ];

  const uniqueFolders = [...new Set(folderVariations)];

  for (const folderName of uniqueFolders) {
    const localPaths = [];
    let fetchedCount = 0;
    
    // We try to download the first image (01) to verify if this folder is valid on the server
    const testUrl = `https://ev-database.org/img/auto/${folderName}/${folderName}-01@2x.jpg`;
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const res = await fetch(testUrl, {
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        },
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (res.status === 200) {
        // Valid folder! Now download all 4 images using this folder name
        for (let i = 1; i <= 4; i++) {
          const padIdx = String(i).padStart(2, '0');
          const remoteUrl = `https://ev-database.org/img/auto/${folderName}/${folderName}-${padIdx}@2x.jpg`;
          const destPath = path.join(destDir, `${folderName}-${padIdx}.jpg`);
          const localUrlPath = `/img/cars/${id}/${folderName}-${padIdx}.jpg`;

          if (fs.existsSync(destPath)) {
            localPaths.push(localUrlPath);
            fetchedCount++;
            continue;
          }

          const dlController = new AbortController();
          const dlTimeoutId = setTimeout(() => dlController.abort(), 10000);
          
          try {
            const dlRes = await fetch(remoteUrl, {
              headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
              },
              signal: dlController.signal
            });
            clearTimeout(dlTimeoutId);

            if (dlRes.status === 200) {
              const buffer = Buffer.from(await dlRes.arrayBuffer());
              fs.writeFileSync(destPath, buffer);
              localPaths.push(localUrlPath);
              fetchedCount++;
            }
          } catch (err) {
            clearTimeout(dlTimeoutId);
          }
          await sleep(50);
        }

        if (fetchedCount > 0) {
          return localPaths;
        }
      }
    } catch (e) {
      // Try next casing variation
    }
  }

  return null;
}

async function main() {
  console.log("=== Smart Case-Insensitive EV Image Downloader ===");
  const vehicles = await db.electricVehicle.findMany();
  console.log(`Loaded ${vehicles.length} vehicles from database.`);

  const publicDir = path.join(__dirname, '..', 'public', 'img', 'cars');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  let index = 0;
  let successCount = 0;

  for (const v of vehicles) {
    index++;
    const destDir = path.join(publicDir, v.id);
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }

    // Check if we already have local files downloaded in this folder
    const files = fs.readdirSync(destDir);
    if (files.length > 0) {
      // If folder already contains synced files, skip downloading
      continue;
    }

    // Generate candidates for model cleaning
    const words = v.model.trim().split(/\s+/);
    const candidates = [];
    
    // Candidate 1: First 2 words of model (standard, e.g. "Model 3" or "Q4 e-tron")
    if (words.length >= 2) {
      candidates.push(words.slice(0, 2).join(' '));
    }
    // Candidate 2: First 1 word of model
    if (words.length >= 1) {
      candidates.push(words[0]);
    }
    // Candidate 3: Full model name
    candidates.push(v.model);
    // Candidate 4: First 3 words of model
    if (words.length >= 3) {
      candidates.push(words.slice(0, 3).join(' '));
    }

    const uniqueCandidates = [...new Set(candidates)];
    
    console.log(`[${index}/${vehicles.length}] Checking ${v.brand} ${v.model}...`);
    
    let matchedPaths = null;
    for (const cand of uniqueCandidates) {
      const paths = await tryDownloadCandidate(v.brand, cand, v.id, index, destDir);
      if (paths && paths.length > 0) {
        matchedPaths = paths;
        console.log(`  -> SUCCESS using model candidate: "${cand}"`);
        break; // Match found, stop checking candidates
      }
    }

    if (matchedPaths) {
      // Update database
      await db.electricVehicle.update({
        where: { id: v.id },
        data: {
          imageUrl: matchedPaths[0],
          imageUrls: JSON.stringify(matchedPaths)
        }
      });
      successCount++;
    } else {
      console.log(`  -> FAILED to find any image for: ${v.brand} ${v.model}`);
    }
  }

  console.log(`\n=== Done! Synced ${successCount} new vehicle image sets. ===`);
  await db.$disconnect();
}

main().catch(console.error);
