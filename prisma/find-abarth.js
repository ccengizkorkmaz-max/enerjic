const { PrismaClient } = require('@prisma/client');
const db = new PrismaClient();

async function main() {
  const abarths = await db.electricVehicle.findMany({
    where: {
      brand: { contains: "Abarth", mode: 'insensitive' }
    }
  });

  console.log("Found Abarths:", abarths.map(v => ({ id: v.id, brand: v.brand, model: v.model, imageUrl: v.imageUrl })));
  
  await db.$disconnect();
}

main().catch(console.error);
