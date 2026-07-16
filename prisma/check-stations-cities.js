const { PrismaClient } = require('@prisma/client');
const db = new PrismaClient();

async function main() {
  const stations = await db.chargingStation.findMany();
  console.log(`Total Stations in Database: ${stations.length}`);

  // Group by city and count
  const cityCounts = {};
  for (const s of stations) {
    cityCounts[s.city] = (cityCounts[s.city] || 0) + 1;
  }

  console.log("Top 15 Cities in Database:");
  Object.entries(cityCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15)
    .forEach(([city, count]) => {
      console.log(`  - ${city}: ${count} stations`);
    });

  // Example districts for a top city like Istanbul
  const istanbulDistricts = [...new Set(
    stations.filter(s => s.city.toLowerCase() === 'istanbul').map(s => s.district)
  )];
  console.log(`\nSome Istanbul districts:`, istanbulDistricts.slice(0, 10));

  await db.$disconnect();
}

main().catch(console.error);
