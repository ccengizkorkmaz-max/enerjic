const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const db = new PrismaClient();

async function main() {
  const jsonPath = path.join(__dirname, 'scraped_stations_perfect.json');
  
  if (!fs.existsSync(jsonPath)) {
    console.error("Scraped stations JSON not found at:", jsonPath);
    return;
  }

  console.log("Reading scraped stations data...");
  const rawData = fs.readFileSync(jsonPath, 'utf8');
  const stations = JSON.parse(rawData);
  console.log(`Loaded ${stations.length} stations from JSON.`);

  // Clean data: unique by name, city, address to avoid duplicate insertion within the batch
  const uniqueMap = new Map();
  for (const s of stations) {
    const key = `${s.name.trim().toLowerCase()}_${s.city.trim().toLowerCase()}_${s.address.trim().toLowerCase()}`;
    if (!uniqueMap.has(key)) {
      uniqueMap.set(key, s);
    }
  }
  const uniqueStations = Array.from(uniqueMap.values());
  console.log(`Cleaned duplicates: ${uniqueStations.length} unique stations remaining.`);

  // Clear existing dummy / temporary stations if desired, or just upsert/skip
  // We will insert them in chunks of 500 to prevent query limits / parameter limits
  const chunkSize = 500;
  let inserted = 0;

  console.log("Starting bulk database insertion...");
  for (let i = 0; i < uniqueStations.length; i += chunkSize) {
    const chunk = uniqueStations.slice(i, i + chunkSize);
    
    // Check which ones already exist to prevent database unique/primary constraint issues or duplicating records
    // Since id is UUID, we check by name & address
    const checkedChunk = [];
    for (const item of chunk) {
      const exists = await db.chargingStation.findFirst({
        where: {
          name: item.name,
          city: item.city,
          address: item.address
        }
      });
      if (!exists) {
        checkedChunk.push({
          name: item.name,
          provider: item.provider,
          city: item.city,
          district: item.district,
          address: item.address,
          chargerType: item.chargerType,
          powerKw: item.powerKw,
          isActive: true
        });
      }
    }

    if (checkedChunk.length > 0) {
      const result = await db.chargingStation.createMany({
        data: checkedChunk
      });
      inserted += result.count;
      console.log(`Progress: Inserted chunk ${i / chunkSize + 1}/${Math.ceil(uniqueStations.length / chunkSize)} - Added ${result.count} stations. (Total so far: ${inserted})`);
    } else {
      console.log(`Progress: Chunk ${i / chunkSize + 1} already fully in database. Skipped.`);
    }
  }

  console.log(`=== Done! Successfully inserted ${inserted} new stations into the database ===`);
  await db.$disconnect();
}

main().catch(console.error);
