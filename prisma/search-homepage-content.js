const fs = require('fs');
const path = require('path');

function searchContent(query) {
  const filePath = path.join(__dirname, '..', 'prisma', 'homepage.html');
  if (!fs.existsSync(filePath)) {
    console.error("homepage.html missing.");
    return;
  }
  const html = fs.readFileSync(filePath, 'utf-8');
  
  const idx = html.indexOf(query);
  if (idx === -1) {
    console.log(`Query "${query}" NOT found in HTML.`);
    return;
  }
  
  console.log(`Query "${query}" found at index ${idx}. Context:`);
  console.log("-----------------------------------------");
  console.log(html.slice(idx, idx + 5000));
  console.log("-----------------------------------------");
}

async function main() {
  searchContent('data-vehicle-id="3403"');
}

main().catch(console.error);
