const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const https = require('https');
const db = new PrismaClient();

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

// Download helper
function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destPath);
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
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

// Fetch image URL from Unsplash public search API (no API key needed)
async function fetchUnsplashImageUrl(query) {
  return new Promise((resolve) => {
    const url = `https://unsplash.com/napi/search/photos?query=${encodeURIComponent(query)}&xp=search-trending%3Acontrol`;
    
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    }, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.results && parsed.results.length > 0) {
            // Get regular size image
            const imgUrl = parsed.results[0].urls.regular;
            resolve(imgUrl);
          } else {
            resolve(null);
          }
        } catch {
          resolve(null);
        }
      });
    }).on('error', () => {
      resolve(null);
    });
  });
}

async function main() {
  console.log("=== Downloader for Missing EV Images (Unsplash Search) ===");

  const vehicles = await db.electricVehicle.findMany();
  const publicDir = path.join(__dirname, '..', 'public', 'img', 'cars');
  
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  const missing = [];
  for (const v of vehicles) {
    const dir = path.join(publicDir, v.id);
    if (!fs.existsSync(dir) || fs.readdirSync(dir).length === 0) {
      missing.push(v);
    }
  }

  console.log(`Detected ${missing.length} vehicles without local images.`);
  if (missing.length === 0) {
    console.log("All vehicles have images. Exiting.");
    return;
  }

  let successCount = 0;
  let index = 0;

  for (const v of missing) {
    index++;
    const query = `${v.brand} ${v.model} electric car`.trim();
    console.log(`[${index}/${missing.length}] Searching Unsplash for: "${query}"...`);
    
    // First try brand + model + electric car
    let imgUrl = await fetchUnsplashImageUrl(query);
    
    // Fallback 1: Try brand + model
    if (!imgUrl) {
      const fallbackQuery1 = `${v.brand} ${v.model}`.trim();
      console.log(`  Fallback 1: Searching for "${fallbackQuery1}"...`);
      imgUrl = await fetchUnsplashImageUrl(fallbackQuery1);
    }

    // Fallback 2: Try brand + electric car
    if (!imgUrl) {
      const fallbackQuery2 = `${v.brand} electric car`.trim();
      console.log(`  Fallback 2: Searching for "${fallbackQuery2}"...`);
      imgUrl = await fetchUnsplashImageUrl(fallbackQuery2);
    }

    if (imgUrl) {
      const destDir = path.join(publicDir, v.id);
      if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
      }

      const destPath = path.join(destDir, 'image.jpg');
      
      try {
        console.log(`  Downloading image to: public/img/cars/${v.id}/image.jpg`);
        await downloadFile(imgUrl, destPath);
        
        // Update database imageUrl with relative path
        const relativeUrl = `/img/cars/${v.id}/image.jpg`;
        await db.electricVehicle.update({
          where: { id: v.id },
          data: { imageUrl: relativeUrl }
        });
        
        successCount++;
        console.log(`  Success! Image updated for ${v.brand} ${v.model}`);
      } catch (err) {
        console.error(`  Failed to download image: ${err.message}`);
      }
    } else {
      console.log(`  No images found on Unsplash for: ${v.brand} ${v.model}`);
    }

    // Rate limiting delay
    await sleep(1500);
  }

  console.log(`=== Task Finished! Successfully downloaded ${successCount}/${missing.length} vehicle images ===`);
  await db.$disconnect();
}

main().catch(console.error);
