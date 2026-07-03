const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const db = new PrismaClient();

async function main() {
  const vehicleId = 'd80ba73b-acec-44fd-90b6-dfa0f79582b0';
  const generatedImagePath = 'C:\\Users\\cengiz.korkmaz\\.gemini\\antigravity-ide\\brain\\7862a521-7ead-42af-9c9f-75693504075b\\alfa_giulia_ev_concept_1782998117916.png';
  
  if (!fs.existsSync(generatedImagePath)) {
    console.error("Generated image not found!");
    return;
  }

  const destDir = path.join(__dirname, '..', 'public', 'img', 'cars', vehicleId);
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  const destFilename = 'alfa_giulia_ev_concept.png';
  const destPath = path.join(destDir, destFilename);

  fs.copyFileSync(generatedImagePath, destPath);
  console.log(`Copied image to: ${destPath}`);

  // Update DB
  const localUrl = `/img/cars/${vehicleId}/${destFilename}`;
  await db.electricVehicle.update({
    where: { id: vehicleId },
    data: {
      imageUrl: localUrl,
      imageUrls: JSON.stringify([localUrl])
    }
  });

  console.log("Database updated successfully.");
  await db.$disconnect();
}

main().catch(console.error);
