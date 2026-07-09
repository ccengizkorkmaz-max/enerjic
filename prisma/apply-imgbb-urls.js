const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function main() {
  console.log('=== Applying ImgBB URLs to Database ===\n');

  // Load mapping
  const mappingPath = path.join(__dirname, 'imgbb-mapping.json');
  if (!fs.existsSync(mappingPath)) {
    console.error('imgbb-mapping.json not found!');
    process.exit(1);
  }

  const mapping = JSON.parse(fs.readFileSync(mappingPath, 'utf-8'));
  const folderIds = Object.keys(mapping);
  console.log(`Found ${folderIds.length} ImgBB mappings.\n`);

  let updated = 0;
  let notFound = 0;
  let alreadySet = 0;
  let errors = 0;

  // Process in batches
  const batchSize = 50;
  for (let i = 0; i < folderIds.length; i += batchSize) {
    const batch = folderIds.slice(i, i + batchSize);
    
    const promises = batch.map(async (folderId) => {
      const imgbbData = mapping[folderId];
      const newUrl = imgbbData.imageUrl;

      try {
        // Find vehicle by folder name pattern: ev-XXXXXXXX
        // The folder ID is the vehicle's unique identifier in our data
        const vehicle = await prisma.electricVehicle.findFirst({
          where: { id: folderId },
          select: { id: true, imageUrl: true, brand: true, model: true },
        });

        if (!vehicle) {
          notFound++;
          return;
        }

        // Skip if already has an ImgBB URL
        if (vehicle.imageUrl && vehicle.imageUrl.includes('ibb.co')) {
          alreadySet++;
          return;
        }

        // Update with ImgBB URL
        await prisma.electricVehicle.update({
          where: { id: folderId },
          data: { imageUrl: newUrl },
        });

        updated++;
      } catch (err) {
        errors++;
      }
    });

    await Promise.all(promises);
    
    const progress = Math.min(i + batchSize, folderIds.length);
    process.stdout.write(`\r  Progress: ${progress}/${folderIds.length} (${updated} updated, ${alreadySet} already set, ${notFound} not found)`);
  }

  console.log(`\n\n=== Summary ===`);
  console.log(`  ✅ Updated: ${updated}`);
  console.log(`  ⏭️  Already ImgBB: ${alreadySet}`);
  console.log(`  ❌ Not found in DB: ${notFound}`);
  console.log(`  ⚠️  Errors: ${errors}`);
  console.log(`  📊 Total processed: ${folderIds.length}`);

  await prisma.$disconnect();
}

main().catch(console.error);
