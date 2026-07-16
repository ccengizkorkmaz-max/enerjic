/**
 * Upload vehicle images to ImgBB and save URL mapping.
 * 
 * Usage: node prisma/upload-images-imgbb.js
 * 
 * Features:
 * - Uploads the FIRST image of each vehicle folder to ImgBB
 * - Saves progress to prisma/imgbb-mapping.json (resume-safe)
 * - Sequential uploads with smart rate-limit handling
 * - Logs progress every 10 uploads
 */

const fs = require('fs');
const path = require('path');

const IMGBB_API_KEY = '8d3f54c640c3574f58f2ce9433f27ec7';
const CARS_DIR = path.join(__dirname, '..', 'public', 'img', 'cars');
const MAPPING_FILE = path.join(__dirname, 'imgbb-mapping.json');
const DELAY_MS = 2000;          // delay between uploads (ms)
const RATE_LIMIT_WAIT = 65000;  // wait 65s on rate limit
const MAX_RETRIES = 5;

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function loadMapping() {
  if (fs.existsSync(MAPPING_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(MAPPING_FILE, 'utf-8'));
    } catch { return {}; }
  }
  return {};
}

function saveMapping(mapping) {
  fs.writeFileSync(MAPPING_FILE, JSON.stringify(mapping, null, 2));
}

async function uploadToImgBB(filePath, name, retries = 0) {
  const imageData = fs.readFileSync(filePath);
  const base64 = imageData.toString('base64');

  const formData = new URLSearchParams();
  formData.append('key', IMGBB_API_KEY);
  formData.append('image', base64);
  formData.append('name', name);

  const res = await fetch('https://api.imgbb.com/1/upload', {
    method: 'POST',
    body: formData,
  });

  if (res.status === 400) {
    const text = await res.text();
    if (text.includes('Rate limit') && retries < MAX_RETRIES) {
      console.log(`  ⏳ Rate limited. Waiting ${RATE_LIMIT_WAIT / 1000}s before retry ${retries + 1}/${MAX_RETRIES}...`);
      await sleep(RATE_LIMIT_WAIT);
      return uploadToImgBB(filePath, name, retries + 1);
    }
    throw new Error(`ImgBB API error ${res.status}: ${text}`);
  }

  if (!res.ok) {
    if (retries < MAX_RETRIES) {
      console.log(`  ⚠️ API error ${res.status}. Waiting ${RATE_LIMIT_WAIT / 1000}s before retry ${retries + 1}/${MAX_RETRIES}...`);
      await sleep(RATE_LIMIT_WAIT);
      return uploadToImgBB(filePath, name, retries + 1);
    }
    throw new Error(`ImgBB API error ${res.status}`);
  }

  const json = await res.json();
  if (!json.success) {
    throw new Error(`ImgBB upload failed: ${JSON.stringify(json)}`);
  }

  return {
    url: json.data.url,
    display_url: json.data.display_url,
    thumb_url: json.data.thumb?.url || json.data.url,
  };
}

async function main() {
  console.log('=== ImgBB Sequential Image Uploader ===');

  const folders = fs.readdirSync(CARS_DIR).filter(f => {
    return fs.statSync(path.join(CARS_DIR, f)).isDirectory();
  });

  console.log(`Found ${folders.length} vehicle folders.`);

  const mapping = loadMapping();
  const alreadyDone = Object.keys(mapping).length;
  console.log(`Already uploaded: ${alreadyDone} vehicles (will skip).`);

  const todo = folders.filter(folderId => {
    if (mapping[folderId]) return false;
    const folderPath = path.join(CARS_DIR, folderId);
    const files = fs.readdirSync(folderPath).filter(f => f.endsWith('.jpg') || f.endsWith('.png'));
    return files.length > 0;
  });

  console.log(`Remaining to upload: ${todo.length} vehicles.\n`);

  if (todo.length === 0) {
    console.log('All images already uploaded!');
    return;
  }

  let uploaded = 0;
  let errors = 0;

  for (let i = 0; i < todo.length; i++) {
    const folderId = todo[i];
    const folderPath = path.join(CARS_DIR, folderId);
    const files = fs.readdirSync(folderPath)
      .filter(f => f.endsWith('.jpg') || f.endsWith('.png'))
      .sort();

    if (files.length === 0) continue;

    const firstImage = files[0];
    const imagePath = path.join(folderPath, firstImage);
    const imageName = `ev_${folderId.substring(0, 8)}_${firstImage.replace(/\.[^.]+$/, '')}`;

    try {
      const result = await uploadToImgBB(imagePath, imageName);
      mapping[folderId] = {
        imageUrl: result.display_url,
        thumbUrl: result.thumb_url,
        originalFile: firstImage,
        uploadedAt: new Date().toISOString(),
      };
      uploaded++;

      // Save every 5 uploads
      if (uploaded % 5 === 0) {
        saveMapping(mapping);
      }

      const total = alreadyDone + uploaded;
      if (uploaded % 10 === 0) {
        console.log(`  ✓ Progress: ${total}/${folders.length} | Uploaded: ${uploaded} | Errors: ${errors}`);
      }
    } catch (err) {
      console.error(`  ✗ ${folderId}/${firstImage}: ${err.message.substring(0, 80)}`);
      errors++;
    }

    // Delay between uploads
    await sleep(DELAY_MS);
  }

  saveMapping(mapping);
  console.log(`\n=== Upload Complete ===`);
  console.log(`Uploaded: ${uploaded} | Errors: ${errors} | Total with images: ${Object.keys(mapping).length}`);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
