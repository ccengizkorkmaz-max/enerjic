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
        'User-Agent': 'EnerjicBot/1.0 (cengiz@enerjic.com; open database image syncer)'
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

// Fetch JSON data helper
function getJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, {
      headers: {
        'User-Agent': 'EnerjicBot/1.0 (cengiz@enerjic.com; open database image syncer)'
      }
    }, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

// Wikipedia Image Search
async function searchWikipediaImage(query) {
  try {
    const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&format=json`;
    const searchRes = await getJson(searchUrl);
    
    if (!searchRes.query || !searchRes.query.search || searchRes.query.search.length === 0) {
      return null;
    }
    
    const title = searchRes.query.search[0].title;
    
    const imgUrl = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=pageimages&format=json&pithumbsize=800`;
    const imgRes = await getJson(imgUrl);
    
    const pages = imgRes.query.pages;
    for (const pageId in pages) {
      if (pages[pageId].thumbnail && pages[pageId].thumbnail.source) {
        return pages[pageId].thumbnail.source;
      }
    }
    return null;
  } catch (e) {
    console.error(`  Wiki search error for "${query}": ${e.message}`);
    return null;
  }
}

// Clean model string to generic format
// E.g. "Born 150 kW - 58 kWh" -> "Born"
// "e-Transporter Kombi L2 210 kW 64 kWh" -> "e-Transporter"
function cleanModelName(model) {
  // Take words up to numbers/specifications like "kW", "kWh", "hp" or purely digits
  const parts = model.split(' ');
  const cleanedParts = [];
  
  for (const part of parts) {
    const lower = part.toLowerCase();
    // Stop at common battery/specification keywords
    if (
      lower.includes('kw') || 
      lower.includes('kwh') || 
      lower.includes('hp') || 
      lower.includes('ps') ||
      /^\d+$/.test(part) || // stop at bare numbers indicating specs
      part.includes('-') && /^\d+$/.test(part.replace('-', ''))
    ) {
      break;
    }
    cleanedParts.push(part);
  }
  
  return cleanedParts.join(' ').trim() || model;
}

async function main() {
  console.log("=== Wikipedia Car Image Syncer ===");

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
    const shortModel = cleanModelName(v.model);
    const query = `${v.brand} ${shortModel}`.trim();
    
    console.log(`[${index}/${missing.length}] Searching Wikipedia for: "${query}" (Original: ${v.brand} ${v.model})...`);
    
    let imgUrl = await searchWikipediaImage(query);
    
    // Fallback 1: Just brand + first word of model
    if (!imgUrl) {
      const firstWordModel = v.model.split(' ')[0];
      const fallbackQuery1 = `${v.brand} ${firstWordModel}`.trim();
      console.log(`  Fallback 1: Searching for "${fallbackQuery1}"...`);
      imgUrl = await searchWikipediaImage(fallbackQuery1);
    }

    // Fallback 2: Just brand name
    if (!imgUrl) {
      console.log(`  Fallback 2: Searching for brand only "${v.brand}"...`);
      imgUrl = await searchWikipediaImage(v.brand);
    }

    if (imgUrl) {
      const destDir = path.join(publicDir, v.id);
      if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
      }

      const destPath = path.join(destDir, 'image.jpg');
      
      try {
        console.log(`  Downloading image: ${imgUrl}`);
        await downloadFile(imgUrl, destPath);
        
        const relativeUrl = `/img/cars/${v.id}/image.jpg`;
        await db.electricVehicle.update({
          where: { id: v.id },
          data: { imageUrl: relativeUrl }
        });
        
        successCount++;
        console.log(`  Success! Local image saved & DB updated for ${v.brand} ${v.model}`);
      } catch (err) {
        console.error(`  Download error: ${err.message}`);
      }
    } else {
      console.log(`  No images found on Wikipedia for: ${v.brand} ${v.model}`);
    }

    // Moderate sleep to respect Wikimedia servers
    await sleep(800);
  }

  console.log(`=== Done! Successfully downloaded ${successCount}/${missing.length} car images ===`);
  await db.$disconnect();
}

main().catch(console.error);
