const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();
const CARS_DIR = path.join(__dirname, '..', 'public', 'img', 'cars');
const MAPPING_FILE = path.join(__dirname, '..', 'prisma', 'imgbb-mapping.json');
const FREEIMAGE_API_KEY = '6d207e02198a847aa98d0a2a901485a5';

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

// Function to upload base64 image to freeimage.host
async function uploadToFreeImage(base64Data, name) {
  const formData = new URLSearchParams();
  formData.append('key', FREEIMAGE_API_KEY);
  formData.append('action', 'upload');
  formData.append('source', base64Data);
  formData.append('format', 'json');

  const res = await fetch('https://freeimage.host/api/1/upload', {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    throw new Error(`freeimage.host returned status ${res.status}`);
  }

  const json = await res.json();
  if (json.status_code !== 200 || !json.image) {
    throw new Error(`freeimage.host failed: ${JSON.stringify(json)}`);
  }

  return {
    url: json.image.url,
    thumb_url: json.image.thumb?.url || json.image.url,
  };
}

async function main() {
  console.log("=== Uploading Remaining Vehicle Images to FreeImage.host ===");

  // Load existing mappings
  let mapping = {};
  if (fs.existsSync(MAPPING_FILE)) {
    mapping = JSON.parse(fs.readFileSync(MAPPING_FILE, 'utf-8'));
  }

  const vehicles = await prisma.electricVehicle.findMany({
    select: { id: true, brand: true, model: true }
  });

  const unmapped = vehicles.filter(v => !mapping[v.id]);
  console.log(`Total DB Vehicles: ${vehicles.length}`);
  console.log(`Unmapped vehicles remaining: ${unmapped.length}`);

  if (unmapped.length === 0) {
    console.log("All vehicles already mapped! Exiting.");
    return;
  }

  let successCount = 0;
  let errorCount = 0;

  for (let i = 0; i < unmapped.length; i++) {
    const v = unmapped[i];
    const folderPath = path.join(CARS_DIR, v.id);
    let imageFile = null;

    console.log(`[${i + 1}/${unmapped.length}] Processing ${v.brand} ${v.model} (${v.id})...`);

    // Check if local folder exists and has images
    if (fs.existsSync(folderPath)) {
      const files = fs.readdirSync(folderPath).filter(f => f.endsWith('.jpg') || f.endsWith('.png'));
      if (files.length > 0) {
        imageFile = path.join(folderPath, files[0]);
      }
    }

    if (!imageFile) {
      console.log(`  ⚠️ No local image for ${v.brand} ${v.model}. Skipping upload, needs download first.`);
      continue;
    }

    try {
      const imageData = fs.readFileSync(imageFile);
      const base64 = imageData.toString('base64');
      const name = `ev_${v.id.substring(0, 8)}`;

      console.log(`  Uploading ${path.basename(imageFile)} to freeimage.host...`);
      const result = await uploadToFreeImage(base64, name);

      mapping[v.id] = {
        imageUrl: result.url,
        thumbUrl: result.thumb_url,
        originalFile: path.basename(imageFile),
        uploadedAt: new Date().toISOString(),
        provider: 'freeimage'
      };

      successCount++;
      // Save progress periodically
      if (successCount % 10 === 0) {
        fs.writeFileSync(MAPPING_FILE, JSON.stringify(mapping, null, 2));
        console.log(`  💾 Saved mapping progress (${successCount} uploaded this run).`);
      }

      // Add a small delay between uploads to be polite to the API
      await sleep(1000);
    } catch (err) {
      console.error(`  ❌ Failed to upload image for ${v.brand} ${v.model}: ${err.message}`);
      errorCount++;
    }
  }

  // Final save
  fs.writeFileSync(MAPPING_FILE, JSON.stringify(mapping, null, 2));
  console.log(`\n=== Task Finished! ===`);
  console.log(`Successfully uploaded: ${successCount}`);
  console.log(`Errors encountered: ${errorCount}`);
  console.log(`Total mapped vehicles now: ${Object.keys(mapping).length}/${vehicles.length}`);

  await prisma.$disconnect();
}

main().catch(console.error);
