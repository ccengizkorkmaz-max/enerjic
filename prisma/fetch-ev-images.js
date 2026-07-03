/**
 * Fetch EV Images - Parsers cheatsheet page, fetches each vehicle's detail page
 * from ev-database.org, extracts og:image, and updates our database with the image URL.
 */
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const db = new PrismaClient();

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function main() {
  console.log("=== EV Image Scraper & Matcher ===");

  // Read the saved cheatsheet HTML
  const cheatsheetPath = "C:\\Users\\cengiz.korkmaz\\.gemini\\antigravity-ide\\brain\\7862a521-7ead-42af-9c9f-75693504075b\\.system_generated\\steps\\840\\content.md";
  if (!fs.existsSync(cheatsheetPath)) {
    console.error("Cheatsheet file not found!");
    return;
  }

  const html = fs.readFileSync(cheatsheetPath, 'utf-8');
  
  // Extract all car links like /car/3273/Lucid-Air-Grand-Touring
  const carLinkRegex = /\/car\/(\d+)\/([a-zA-Z0-9-_]+)/g;
  const links = [];
  let match;
  while ((match = carLinkRegex.exec(html)) !== null) {
    const url = `https://ev-database.org/car/${match[1]}/${match[2]}`;
    if (!links.some(l => l.url === url)) {
      links.push({
        id: match[1],
        slug: match[2],
        url: url
      });
    }
  }

  console.log(`Found ${links.length} vehicle links in cheatsheet.`);

  // Load all vehicles from our DB
  const ourVehicles = await db.electricVehicle.findMany();
  console.log(`Loaded ${ourVehicles.length} vehicles from our database.`);

  let matchedCount = 0;
  let updatedCount = 0;

  // We will process links in concurrent batches
  const batchSize = 10;
  for (let i = 0; i < links.length; i += batchSize) {
    const batch = links.slice(i, i + batchSize);
    console.log(`Processing batch ${Math.floor(i/batchSize)+1}/${Math.ceil(links.length/batchSize)}...`);

    const promises = batch.map(async (link) => {
      try {
        const res = await fetch(link.url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          }
        });
        if (!res.ok) {
          console.error(`  Failed to fetch ${link.url}: HTTP ${res.status}`);
          return;
        }

        const pageHtml = await res.text();
        const ogImageMatch = pageHtml.match(/<meta property="og:image" content="(https:\/\/ev-database\.org\/img\/auto\/[^"]+)"/i);
        
        if (ogImageMatch && ogImageMatch[1]) {
          const imageUrl = ogImageMatch[1];
          
          // Try to match this link name/slug to our DB vehicles
          // We can do fuzzy match on brand + model
          // Slug is like Lucid-Air-Grand-Touring or Tesla-Model-Y-Long-Range
          const normalizedSlug = link.slug.toLowerCase().replace(/-/g, ' ');
          
          let bestMatch = null;
          let bestScore = 0;

          for (const v of ourVehicles) {
            const vName = `${v.brand} ${v.model} ${v.variant || ''}`.toLowerCase();
            // Count overlapping words
            const slugWords = normalizedSlug.split(' ');
            const vehicleWords = vName.split(' ');
            const intersection = slugWords.filter(w => vehicleWords.includes(w));
            const score = intersection.length;

            if (score > bestScore) {
              bestScore = score;
              bestMatch = v;
            }
          }

          // If we have a decent match (at least brand + model matches, score >= 2)
          if (bestMatch && bestScore >= 2) {
            await db.electricVehicle.update({
              where: { id: bestMatch.id },
              data: { imageUrl: imageUrl }
            });
            matchedCount++;
            updatedCount++;
          }
        }
      } catch (e) {
        console.error(`  Error processing ${link.url}: ${e.message}`);
      }
    });

    await Promise.all(promises);
    // Pause briefly between batches
    await sleep(2000);
  }

  // Fallback for remaining vehicles - use a generic search/guess image or public placeholder if needed
  // But we have taranmış real images from ev-database.org for most of them.
  console.log(`\n=== Done ===`);
  console.log(`Total matched & updated: ${updatedCount}`);
  
  await db.$disconnect();
}

main().catch(console.error);
