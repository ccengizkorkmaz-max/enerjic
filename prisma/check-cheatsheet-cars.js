const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const db = new PrismaClient();

const cheatsheetPath = "C:\\Users\\cengiz.korkmaz\\.gemini\\antigravity-ide\\brain\\7862a521-7ead-42af-9c9f-75693504075b\\.system_generated\\steps\\840\\content.md";
const html = fs.readFileSync(cheatsheetPath, 'utf-8');

async function main() {
  const vehicles = await db.electricVehicle.findMany();
  console.log(`Loaded ${vehicles.length} database vehicles.`);

  let matched = 0;
  for (const v of vehicles) {
    // Check if brand & model exists in cheatsheet HTML
    const cleanBrand = v.brand.replace(/[^a-zA-Z0-9]/g, '');
    const cleanModel = v.model.replace(/[^a-zA-Z0-9]/g, '');
    
    // We search for a link like `/car/XXXX/Brand-Model` or similar
    // Let's search if the slug name or brand name exists in the HTML
    const searchString = `${v.brand}-${v.model}`.replace(/[\s_]+/g, '-').toLowerCase();
    
    if (html.toLowerCase().includes(searchString)) {
      matched++;
    }
  }

  console.log(`Strictly matched vehicles: ${matched}/${vehicles.length}`);
  await db.$disconnect();
}

main().catch(console.error);
