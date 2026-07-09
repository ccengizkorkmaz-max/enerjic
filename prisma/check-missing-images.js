require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const db = new PrismaClient();

async function main() {
  const vehicles = await db.electricVehicle.findMany();
  const publicDir = path.join(__dirname, '..', 'public', 'img', 'cars');
  
  const missing = [];
  for (const v of vehicles) {
    const dir = path.join(publicDir, v.id);
    if (!fs.existsSync(dir) || fs.readdirSync(dir).length === 0) {
      missing.push(v);
    }
  }

  console.log(`Missing images count: ${missing.length}`);
  console.log("First 15 missing:");
  missing.slice(0, 15).forEach(v => {
    console.log(`- [${v.id}] ${v.brand} ${v.model} (${v.year})`);
  });

  await db.$disconnect();
}

main().catch(console.error);
