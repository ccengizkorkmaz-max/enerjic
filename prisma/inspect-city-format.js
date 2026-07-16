const { PrismaClient } = require('@prisma/client');
const db = new PrismaClient();

async function main() {
  const stations = await db.chargingStation.findMany({
    take: 20
  });
  console.log("Sample charging stations data:");
  stations.forEach(s => {
    console.log(`- Name: ${s.name} | City: "${s.city}" | District: "${s.district}" | Provider: ${s.provider}`);
  });

  const uniqueCities = [...new Set((await db.chargingStation.findMany()).map(s => s.city))];
  console.log(`\nUnique cities in DB (${uniqueCities.length}):`, uniqueCities.slice(0, 20));

  await db.$disconnect();
}

main().catch(console.error);
