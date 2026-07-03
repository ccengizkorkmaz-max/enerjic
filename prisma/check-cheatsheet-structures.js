const fs = require('fs');
const path = require('path');

const cheatsheets = ['range', 'acceleration', 'topspeed', 'consumption', 'towing', 'battery'];

function printSampleRows(name) {
  const filePath = path.join(__dirname, '..', 'prisma', 'cheatsheets', `${name}.html`);
  if (!fs.existsSync(filePath)) {
    console.log(`${name}.html does not exist.`);
    return;
  }
  const html = fs.readFileSync(filePath, 'utf-8');
  console.log(`\n=== SAMPLE ROWS FOR: ${name} ===`);
  
  // Find table rows
  const rowRegex = /<tr>([\s\S]*?)<\/tr>/g;
  let match;
  let count = 0;
  while ((match = rowRegex.exec(html)) !== null && count < 3) {
    const rowContent = match[1];
    if (rowContent.includes('/car/')) {
      console.log(`Row ${count + 1}:`);
      console.log(rowContent.trim());
      count++;
    }
  }
}

async function main() {
  cheatsheets.forEach(printSampleRows);
}

main().catch(console.error);
