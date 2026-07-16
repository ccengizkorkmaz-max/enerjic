const { PrismaClient } = require('@prisma/client');
const db = new PrismaClient();

async function main() {
  // Find by prefix or any matching characters in ID
  const searchPrefix = "83c994d";
  const allVehicles = await db.electricVehicle.findMany();
  
  const matches = allVehicles.filter(v => {
    return v.id.toLowerCase().includes("83c99") || 
           v.id.toLowerCase().includes("8250") ||
           v.id.toLowerCase().includes("5a825b");
  });

  console.log(`Found ${matches.length} matching vehicles:`);
  for (const m of matches) {
    console.log(`- [${m.id}] ${m.brand} ${m.model} (${m.year}) -> ImageUrl: ${m.imageUrl}`);
  }
  
  await db.$disconnect();
}

main().catch(console.error);
