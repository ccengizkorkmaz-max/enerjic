const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const db = new PrismaClient();

async function main() {
  const vehicles = await db.electricVehicle.findMany();
  const publicDir = path.join(__dirname, '..', 'public', 'img', 'cars');
  
  for (const v of vehicles) {
    const dir = path.join(publicDir, v.id);
    if (fs.existsSync(dir)) {
      const files = fs.readdirSync(dir);
      if (files.length > 0) {
        console.log(`Vehicle: ${v.brand} ${v.model} (${v.id})`);
        console.log(`Files:`, files);
        break; // Just print the first successful one
      }
    }
  }

  await db.$disconnect();
}

main().catch(console.error);
