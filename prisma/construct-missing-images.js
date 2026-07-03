/**
 * Construct Missing Images - For vehicles that don't have an imageUrl yet,
 * constructs a standard ev-database.org image URL format.
 */
const { PrismaClient } = require('@prisma/client');
const db = new PrismaClient();

function cleanName(str) {
  // Replace spaces/special chars with underscores, uppercase/titlecase matching
  return str
    .replace(/[^a-zA-Z0-9\s-]/g, '')
    .trim()
    .replace(/[\s-]+/g, '_');
}

async function main() {
  console.log("=== Constructing Missing Image URLs ===");

  const vehicles = await db.electricVehicle.findMany({
    where: { imageUrl: null }
  });

  console.log(`Found ${vehicles.length} vehicles without image URLs.`);

  let updatedCount = 0;

  for (const v of vehicles) {
    const cleanBrand = cleanName(v.brand);
    // Keep only the first word of the model for simplicity if it has multiple words (e.g. Model Y Long Range -> Model Y)
    const modelParts = v.model.split(' ');
    const shortModel = modelParts.slice(0, 2).join(' '); // Model 3, Model Y, Megane E-Tech, etc.
    const cleanModel = cleanName(shortModel);

    // ev-database.org naming format is usually Brand_Model/Brand_Model-01.jpg
    const guessedUrl = `https://ev-database.org/img/auto/${cleanBrand}_${cleanModel}/${cleanBrand}_${cleanModel}-01@2x.jpg`;

    await db.electricVehicle.update({
      where: { id: v.id },
      data: { imageUrl: guessedUrl }
    });
    updatedCount++;
  }

  console.log(`Successfully constructed & updated ${updatedCount} image URLs.`);
  
  await db.$disconnect();
}

main().catch(console.error);
