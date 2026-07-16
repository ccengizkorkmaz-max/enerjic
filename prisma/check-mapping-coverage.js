const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();
const MAPPING_FILE = path.join(__dirname, '..', 'prisma', 'imgbb-mapping.json');

async function main() {
  const vehicles = await prisma.electricVehicle.findMany();
  const mapping = JSON.parse(fs.readFileSync(MAPPING_FILE, 'utf-8'));

  let mappedCount = 0;
  let unmappedCount = 0;
  const unmappedList = [];

  for (const v of vehicles) {
    if (mapping[v.id]) {
      mappedCount++;
    } else {
      unmappedCount++;
      unmappedList.push(v);
    }
  }

  console.log(`Total Vehicles: ${vehicles.length}`);
  console.log(`Mapped in imgbb-mapping.json: ${mappedCount}`);
  console.log(`Unmapped: ${unmappedCount}`);
  if (unmappedList.length > 0) {
    console.log("Unmapped sample:", unmappedList.slice(0, 10));
  }

  await prisma.$disconnect();
}

main().catch(console.error);
