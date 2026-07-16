const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();
const CARS_DIR = path.join(__dirname, '..', 'public', 'img', 'cars');

async function main() {
  const vehicles = await prisma.electricVehicle.findMany({
    select: { id: true, brand: true, model: true }
  });

  let hasFolder = 0;
  let missingFolder = 0;
  const missingList = [];

  for (const v of vehicles) {
    const folderPath = path.join(CARS_DIR, v.id);
    if (fs.existsSync(folderPath)) {
      const files = fs.readdirSync(folderPath).filter(f => f.endsWith('.jpg') || f.endsWith('.png'));
      if (files.length > 0) {
        hasFolder++;
      } else {
        missingFolder++;
        missingList.push(v);
      }
    } else {
      missingFolder++;
      missingList.push(v);
    }
  }

  console.log(`Vehicles in DB: ${vehicles.length}`);
  console.log(`Have local folder with images: ${hasFolder}`);
  console.log(`Missing folder or empty: ${missingFolder}`);
  if (missingList.length > 0) {
    console.log("Missing sample:", missingList.slice(0, 10));
  }

  await prisma.$disconnect();
}

main().catch(console.error);
