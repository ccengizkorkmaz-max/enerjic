const { PrismaClient } = require('@prisma/client');
const db = new PrismaClient();

async function main() {
  console.log("=== Specific Image Fixes for DS Automobiles ===");

  const ds3ImageUrl = "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/DS_3_Crossback_Mondial_de_l%27Auto_2018_1Y7A5221.jpg/800px-DS_3_Crossback_Mondial_de_l%27Auto_2018_1Y7A5221.jpg";

  // Find all DS 3 models
  const ds3Vehicles = await db.electricVehicle.findMany({
    where: {
      OR: [
        { brand: "DS Automobiles" },
        { brand: "DS" }
      ],
      model: { contains: "DS 3" }
    }
  });

  console.log(`Found ${ds3Vehicles.length} DS 3 models in database.`);

  for (const v of ds3Vehicles) {
    await db.electricVehicle.update({
      where: { id: v.id },
      data: { imageUrl: ds3ImageUrl }
    });
    console.log(`  Updated ${v.brand} ${v.model} (${v.year}) with real DS 3 image.`);
  }

  // Double check other DS models (like DS 7 / E-Tense etc.)
  const ds7ImageUrl = "https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/DS_7_Crossback_E-Tense_IAA_2019_1Y7A5599.jpg/800px-DS_7_Crossback_E-Tense_IAA_2019_1Y7A5599.jpg";
  const ds7Vehicles = await db.electricVehicle.findMany({
    where: {
      OR: [
        { brand: "DS Automobiles" },
        { brand: "DS" }
      ],
      model: { contains: "DS 7" }
    }
  });

  console.log(`Found ${ds7Vehicles.length} DS 7 models in database.`);
  for (const v of ds7Vehicles) {
    await db.electricVehicle.update({
      where: { id: v.id },
      data: { imageUrl: ds7ImageUrl }
    });
    console.log(`  Updated ${v.brand} ${v.model} (${v.year}) with real DS 7 image.`);
  }

  await db.$disconnect();
}

main().catch(console.error);
