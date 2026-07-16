const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();
const MAPPING_FILE = path.join(__dirname, '..', 'prisma', 'imgbb-mapping.json');

async function main() {
  console.log("=== Applying Cloud Hosted Images to Database ===");

  if (!fs.existsSync(MAPPING_FILE)) {
    console.error("mapping file not found!");
    process.exit(1);
  }

  const mapping = JSON.parse(fs.readFileSync(MAPPING_FILE, 'utf-8'));
  const vehicles = await prisma.electricVehicle.findMany({
    select: { id: true, brand: true, model: true, imageUrl: true }
  });

  let updatedCount = 0;
  let skippedCount = 0;
  let noMappingCount = 0;

  // Process in batches to avoid locking the DB
  const batchSize = 100;
  for (let i = 0; i < vehicles.length; i += batchSize) {
    const batch = vehicles.slice(i, i + batchSize);
    
    const promises = batch.map(async (v) => {
      const mapped = mapping[v.id];
      if (!mapped) {
        noMappingCount++;
        return;
      }

      const cloudUrl = mapped.imageUrl;

      // Overwrite if it is not already set to this exact URL, or if it is currently Wikipedia/Wikimedia
      const isWiki = v.imageUrl && (v.imageUrl.includes('wikipedia') || v.imageUrl.includes('wikimedia'));
      const isDifferent = v.imageUrl !== cloudUrl;

      if (isWiki || isDifferent) {
        // Build a proper gallery list if possible
        const urls = [cloudUrl];
        
        await prisma.electricVehicle.update({
          where: { id: v.id },
          data: {
            imageUrl: cloudUrl,
            imageUrls: JSON.stringify(urls)
          }
        });
        updatedCount++;
      } else {
        skippedCount++;
      }
    });

    await Promise.all(promises);
    process.stdout.write(`\r  Progress: ${Math.min(i + batchSize, vehicles.length)}/${vehicles.length}...`);
  }

  console.log(`\n\n=== Apply Summary ===`);
  console.log(`  ✅ Successfully updated to Cloud: ${updatedCount}`);
  console.log(`  ⏭️  Already correct: ${skippedCount}`);
  console.log(`  ⚠️  Vehicles without cloud mapping: ${noMappingCount}`);

  await prisma.$disconnect();
}

main().catch(console.error);
