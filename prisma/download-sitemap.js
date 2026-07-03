const fs = require('fs');
const path = require('path');

async function main() {
  const url = 'https://ev-database.org/sitemap.xml';
  console.log(`Fetching sitemap from ${url}...`);

  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });

    if (!res.ok) {
      console.error(`Failed to fetch sitemap: Status ${res.status}`);
      return;
    }

    const xml = await res.text();
    console.log(`Fetched sitemap. Length: ${xml.length} bytes.`);

    // Extract all URLs matching /car/XXXX/Slug
    const carUrlRegex = /https:\/\/ev-database\.org\/car\/(\d+)\/([^\s<]+)/g;
    const cars = [];
    let match;
    while ((match = carUrlRegex.exec(xml)) !== null) {
      const id = match[1];
      const slug = match[2];
      if (!cars.some(c => c.id === id)) {
        cars.push({ id, slug });
      }
    }

    console.log(`Found ${cars.length} unique car links in sitemap.`);
    
    // Save to file
    const destPath = path.join(__dirname, '..', 'prisma', 'evdb_sitemap_cars.json');
    fs.writeFileSync(destPath, JSON.stringify(cars, null, 2));
    console.log(`Saved car list to ${destPath}`);

    // Print first 20
    console.log("First 20 car slugs from sitemap:");
    cars.slice(0, 20).forEach(c => {
      console.log(`- ${c.id}: ${c.slug}`);
    });

  } catch (err) {
    console.error("Error fetching/parsing sitemap:", err);
  }
}

main().catch(console.error);
