/**
 * Robust EV Image Downloader - Downloads all 4 images for all 365 vehicles.
 * Gracefully handles network failures, timeouts, and missing images (404)
 * without crashing.
 */
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const db = new PrismaClient();

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function downloadImage(url, destPath) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    clearTimeout(timeoutId);

    if (!res.ok) return false;

    const buffer = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(destPath, buffer);
    return true;
  } catch (err) {
    // Graceful error logging
    return false;
  }
}

async function main() {
  console.log("=== Robust EV Image Downloader ===");

  const vehicles = await db.electricVehicle.findMany();
  console.log(`Processing ${vehicles.length} vehicles...`);

  const publicDir = path.join(__dirname, '..', 'public', 'img', 'cars');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  let index = 0;
  for (const v of vehicles) {
    index++;
    
    // Parse imageUrls in DB (which are currently remote URLs)
    let remoteUrls = [];
    try {
      remoteUrls = JSON.parse(v.imageUrls || "[]");
    } catch {
      remoteUrls = [];
    }

    if (remoteUrls.length === 0 && v.imageUrl) {
      remoteUrls = [v.imageUrl];
    }

    if (remoteUrls.length === 0) continue;

    console.log(`[${index}/${vehicles.length}] ${v.brand} ${v.model}`);

    const vehicleDir = path.join(publicDir, v.id);
    if (!fs.existsSync(vehicleDir)) {
      fs.mkdirSync(vehicleDir, { recursive: true });
    }

    const localImages = [];

    for (let i = 0; i < remoteUrls.length; i++) {
      const remoteUrl = remoteUrls[i];
      if (!remoteUrl.startsWith('http')) {
        // Already local
        localImages.push(remoteUrl);
        continue;
      }

      // Extract filename from remote URL
      const lastSlash = remoteUrl.lastIndexOf('/');
      const filename = remoteUrl.substring(lastSlash + 1);
      const destPath = path.join(vehicleDir, filename);

      if (fs.existsSync(destPath)) {
        localImages.push(`/img/cars/${v.id}/${filename}`);
        continue;
      }

      const success = await downloadImage(remoteUrl, destPath);
      if (success) {
        localImages.push(`/img/cars/${v.id}/${filename}`);
      } else {
        // Try fallback (without @2x or alternative path if needed, or just skip)
      }
      await sleep(50);
    }

    // Update database with successfully downloaded local paths
    if (localImages.length > 0) {
      // Re-fill missing slots with remote fallback so the gallery is never empty
      const finalUrls = [...localImages];
      for (let i = finalUrls.length; i < remoteUrls.length; i++) {
        finalUrls.push(remoteUrls[i]);
      }

      await db.electricVehicle.update({
        where: { id: v.id },
        data: {
          imageUrl: finalUrls[0],
          imageUrls: JSON.stringify(finalUrls)
        }
      });
      console.log(`  Synced ${localImages.length}/${remoteUrls.length} images locally.`);
    }
  }

  console.log("\n=== Offline Image Sync Completed! ===");
  await db.$disconnect();
}

main().catch(console.error);
