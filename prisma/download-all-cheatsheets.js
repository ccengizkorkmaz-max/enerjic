const fs = require('fs');
const path = require('path');

const cheatsheets = {
  range: 'https://ev-database.org/cheatsheet/range-electric-car',
  acceleration: 'https://ev-database.org/cheatsheet/acceleration-electric-car',
  topspeed: 'https://ev-database.org/cheatsheet/top-speed-electric-car',
  consumption: 'https://ev-database.org/cheatsheet/energy-consumption-electric-car',
  towing: 'https://ev-database.org/cheatsheet/towingweight-electric-car',
  battery: 'https://ev-database.org/cheatsheet/useable-battery-capacity-electric-car'
};

async function downloadCheatsheet(name, url, destDir) {
  console.log(`Downloading cheatsheet [${name}] from ${url}...`);
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });

    if (!res.ok) {
      console.error(`  Failed: status ${res.status}`);
      return false;
    }

    const html = await res.text();
    const destPath = path.join(destDir, `${name}.html`);
    fs.writeFileSync(destPath, html);
    console.log(`  Saved to ${destPath} (Size: ${html.length} bytes)`);
    return true;
  } catch (err) {
    console.error(`  Error downloading [${name}]:`, err);
    return false;
  }
}

async function main() {
  const destDir = path.join(__dirname, '..', 'prisma', 'cheatsheets');
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  for (const [name, url] of Object.entries(cheatsheets)) {
    await downloadCheatsheet(name, url, destDir);
    // Add small delay to be safe
    await new Promise(r => setTimeout(r, 1000));
  }
  console.log("=== All cheatsheets download process finished! ===");
}

main().catch(console.error);
