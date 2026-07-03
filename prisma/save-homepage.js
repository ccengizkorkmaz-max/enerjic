const fs = require('fs');
const path = require('path');

async function main() {
  const localHtmlPath = path.join(__dirname, '..', 'prisma', 'homepage.html');
  
  let html;
  if (fs.existsSync(localHtmlPath)) {
    console.log("Loading homepage HTML from local file...");
    html = fs.readFileSync(localHtmlPath, 'utf-8');
  } else {
    console.log("Fetching homepage HTML from ev-database.org...");
    const res = await fetch('https://ev-database.org/', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    if (!res.ok) {
      console.error(`Failed to fetch homepage: status ${res.status}`);
      return;
    }
    html = await res.text();
    fs.writeFileSync(localHtmlPath, html);
    console.log(`Saved homepage HTML to ${localHtmlPath}`);
  }

  console.log(`HTML size: ${html.length} bytes`);

  // Let's find some vehicle cards.
  // Look for card containers, typically they have links to /car/ID/slug
  const cardRegex = /<div\s+class="data-placeholder"([\s\S]*?)<\/div>/g; // wait, let's try a generic search
  
  // Let's search for some links to /car/
  const carLinkRegex = /href="\/car\/(\d+)\/([^"]+)"[^>]*>([^<]+)<\/a>/g;
  let match;
  let count = 0;
  console.log("\n=== FIRST 5 VEHICLE LINKS IN HOMEPAGE HTML ===");
  while ((match = carLinkRegex.exec(html)) !== null && count < 5) {
    console.log(`Match ${count + 1}: ID: ${match[1]}, Slug: ${match[2]}, Name: ${match[3].trim()}`);
    count++;
  }
}

main().catch(console.error);
