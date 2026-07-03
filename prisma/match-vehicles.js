const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const db = new PrismaClient();

const sitemapPath = path.join(__dirname, '..', 'prisma', 'evdb_sitemap_cars.json');
const sitemapCars = JSON.parse(fs.readFileSync(sitemapPath, 'utf-8'));

function getWordSet(str) {
  return new Set(
    str
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .split(/[\s-]+/)
      .filter(w => w.length > 1)
  );
}

async function main() {
  const vehicles = await db.electricVehicle.findMany();
  console.log(`Loaded ${vehicles.length} database vehicles.`);
  console.log(`Loaded ${sitemapCars.length} sitemap cars.`);

  let matchedCount = 0;
  const matches = [];

  for (const v of vehicles) {
    const dbWords = getWordSet(`${v.brand} ${v.model} ${v.variant || ''}`);
    
    let bestMatch = null;
    let maxOverlap = 0;

    for (const sc of sitemapCars) {
      const scWords = getWordSet(sc.slug);
      
      // Calculate overlap
      let overlap = 0;
      for (const w of dbWords) {
        if (scWords.has(w)) overlap++;
      }

      // Overlap must contain the brand name
      const cleanBrand = v.brand.toLowerCase().replace(/[^a-z0-9]/g, '');
      const hasBrand = scWords.has(cleanBrand) || sc.slug.toLowerCase().includes(cleanBrand);

      if (hasBrand && overlap > maxOverlap) {
        maxOverlap = overlap;
        bestMatch = sc;
      }
    }

    // A good match should have at least 2 overlapping words (usually Brand + Model)
    if (bestMatch && maxOverlap >= 2) {
      matchedCount++;
      matches.push({
        vehicle: `${v.brand} ${v.model} (${v.id})`,
        sitemapCar: `${bestMatch.id}: ${bestMatch.slug}`,
        overlap: maxOverlap
      });
    } else {
      // console.log(`No match for: ${v.brand} ${v.model}`);
    }
  }

  console.log(`\nMatched: ${matchedCount}/${vehicles.length} vehicles.`);
  console.log("\nSample Matches:");
  matches.slice(0, 30).forEach(m => {
    console.log(`- ${m.vehicle}  ===>  ${m.sitemapCar} (Overlap: ${m.overlap})`);
  });

  await db.$disconnect();
}

main().catch(console.error);
