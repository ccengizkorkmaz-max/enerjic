const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'homepage.html');
const html = fs.readFileSync(filePath, 'utf-8');
const items = html.split('class="list-item');

console.log(`Found ${items.length} items in homepage.html`);

// Print first 5 items raw details
for (let i = 1; i < Math.min(items.length, 10); i++) {
  const section = items[i];
  const idMatch = /data-vehicle-id="(\d+)"/.exec(section);
  const slugMatch = /href="\/car\/\d+\/([^\s>"]+)"/.exec(section) || /href=\/car\/\d+\/([^\s>]+)/.exec(section);
  const altMatch = /alt="([^"]+)"/.exec(section);
  
  console.log(`Item ${i}:`);
  console.log(`  ID: ${idMatch ? idMatch[1] : 'null'}`);
  console.log(`  Slug: ${slugMatch ? slugMatch[1] : 'null'}`);
  console.log(`  Alt (Name): ${altMatch ? altMatch[1] : 'null'}`);
}
