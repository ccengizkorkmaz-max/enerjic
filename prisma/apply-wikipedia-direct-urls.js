const { PrismaClient } = require('@prisma/client');
const https = require('https');
const db = new PrismaClient();

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

function getJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, {
      headers: {
        'User-Agent': 'EnerjicBot/1.0 (cengiz@enerjic.com; database updater)'
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
    return null;
  }
}

function cleanModelName(model) {
  const parts = model.split(' ');
  const cleanedParts = [];
  for (const part of parts) {
    const lower = part.toLowerCase();
    if (
      lower.includes('kw') || 
      lower.includes('kwh') || 
      lower.includes('hp') || 
      lower.includes('ps') ||
      /^\d+$/.test(part) ||
      part.includes('-') && /^\d+$/.test(part.replace('-', ''))
    ) {
      break;
    }
    cleanedParts.push(part);
  }
  return cleanedParts.join(' ').trim() || model;
}

async function main() {
  console.log("=== Applying Direct Wikipedia URLs to Database ===");

  // Find all vehicles where imageUrl is null or is guessed ev-database (which fails/blocks) or is local file cache path
  // Since we want instant coverage, we will check vehicles where imageUrl doesn't start with http or contains 'ev-database.org' or is missing
  const vehicles = await db.electricVehicle.findMany();
  
  console.log(`Analyzing ${vehicles.length} total vehicles...`);
  
  // Clean up any wrong Nintendo/console image mappings from previous runs first
  console.log("Cleaning up previous wrong console/non-car image assignments...");
  const wrongImages = vehicles.filter(v => 
    v.imageUrl && (
      v.imageUrl.toLowerCase().includes('nintendo') || 
      v.imageUrl.toLowerCase().includes('ds_lite') ||
      v.imageUrl.toLowerCase().includes('console') ||
      v.imageUrl.toLowerCase().includes('game')
    )
  );
  
  for (const w of wrongImages) {
    await db.electricVehicle.update({
      where: { id: w.id },
      data: { imageUrl: null }
    });
  }
  console.log(`Reset ${wrongImages.length} wrong console/non-car image mappings.`);

  // Refetch target list after resetting wrong images
  const targets = (await db.electricVehicle.findMany()).filter(v => {
    return !v.imageUrl || 
           v.imageUrl.includes('ev-database.org') || 
           v.imageUrl.startsWith('/img/');
  });

  console.log(`Found ${targets.length} target vehicles to update with direct Wikipedia URLs.`);
  
  let updatedCount = 0;
  let index = 0;

  for (const v of targets) {
    index++;
    const shortModel = cleanModelName(v.model);
    
    // Always append " car" to guarantee we get a vehicle image, and handle "DS" brands properly
    const brandTerm = v.brand.toLowerCase() === 'ds' ? 'DS Automobiles' : v.brand;
    const query = `${brandTerm} ${shortModel} car`.trim();
    
    console.log(`[${index}/${targets.length}] Finding Wiki URL for: "${query}"...`);
    
    let imgUrl = await searchWikipediaImage(query);
    
    // Fallback 1: Brand + first word of model + car
    if (!imgUrl) {
      const firstWordModel = v.model.split(' ')[0];
      const fallbackQuery1 = `${brandTerm} ${firstWordModel} car`.trim();
      imgUrl = await searchWikipediaImage(fallbackQuery1);
    }

    // Fallback 2: Brand only + car
    if (!imgUrl) {
      const fallbackQuery2 = `${brandTerm} car`.trim();
      imgUrl = await searchWikipediaImage(fallbackQuery2);
    }

    if (imgUrl) {
      await db.electricVehicle.update({
        where: { id: v.id },
        data: { imageUrl: imgUrl }
      });
      updatedCount++;
      console.log(`  Success! Assigned: ${imgUrl}`);
    } else {
      console.log(`  No image found for: ${v.brand} ${v.model}`);
    }

    await sleep(250);
  }

  console.log(`=== Done! Standardized and updated ${updatedCount}/${targets.length} vehicle images directly to Wikipedia URLs ===`);
  await db.$disconnect();
}

main().catch(console.error);
