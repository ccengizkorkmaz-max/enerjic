const { PrismaClient } = require('@prisma/client');
const db = new PrismaClient();

async function main() {
  const vehicles = await db.electricVehicle.findMany();
  
  let wikipediaCount = 0;
  let imgbbCount = 0;
  let missingCount = 0;
  let otherCount = 0;
  
  for (const v of vehicles) {
    if (!v.imageUrl) {
      missingCount++;
    } else if (v.imageUrl.includes('wikimedia') || v.imageUrl.includes('wikipedia')) {
      wikipediaCount++;
    } else if (v.imageUrl.includes('ibb.co')) {
      imgbbCount++;
    } else {
      otherCount++;
    }
  }
  
  console.log("=== Image Coverage Statistics ===");
  console.log(`Total Vehicles: ${vehicles.length}`);
  console.log(`ImgBB Cloud: ${imgbbCount}`);
  console.log(`Wikipedia (Wikimedia): ${wikipediaCount}`);
  console.log(`Other (local/static): ${otherCount}`);
  console.log(`Missing/No Image: ${missingCount}`);
  
  await db.$disconnect();
}

main().catch(console.error);
