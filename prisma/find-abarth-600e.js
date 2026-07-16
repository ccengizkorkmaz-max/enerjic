const { PrismaClient } = require('@prisma/client');
const db = new PrismaClient();

async function main() {
  const vehicle = await db.electricVehicle.findFirst({
    where: {
      brand: "Abarth",
      model: { contains: "600e" }
    }
  });
  
  if (vehicle) {
    console.log("Abarth 600e Competizione in DB:", vehicle);
  } else {
    console.log("Not found in local DB.");
  }
  
  await db.$disconnect();
}

main().catch(console.error);
