const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("=== Updating Google AdSense Publisher ID ===");
  const publisherId = "ca-pub-3275598773792351";

  // Check existing placements
  const placements = await prisma.adPlacement.findMany();
  console.log(`Found ${placements.length} active placements in DB.`);

  for (const placement of placements) {
    console.log(`Updating ${placement.slotCode}: ${placement.adClient} -> ${publisherId}`);
    await prisma.adPlacement.update({
      where: { id: placement.id },
      data: { adClient: publisherId }
    });
  }

  // Also update seed.js if it exists so future seeds keep the publisher ID
  const fs = require('fs');
  const path = require('path');
  const seedPath = path.join(__dirname, 'seed.js');
  if (fs.existsSync(seedPath)) {
    let seedContent = fs.readFileSync(seedPath, 'utf-8');
    // Replace 'ca-pub-1234567890123456' or similar placeholders
    seedContent = seedContent.replace(/ca-pub-\d{16}/g, publisherId);
    fs.writeFileSync(seedPath, seedContent, 'utf-8');
    console.log("Updated publisher ID in seed.js file.");
  }

  console.log("\n=== AdSense Publisher ID updated successfully across all slots! ===");
  await prisma.$disconnect();
}

main().catch(console.error);
