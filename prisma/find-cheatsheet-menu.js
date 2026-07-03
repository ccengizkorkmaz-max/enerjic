const fs = require('fs');
const path = require('path');

async function main() {
  const rangeHtmlPath = path.join(__dirname, '..', 'prisma', 'cheatsheets', 'range.html');
  if (!fs.existsSync(rangeHtmlPath)) {
    console.error("range.html not found!");
    return;
  }

  const html = fs.readFileSync(rangeHtmlPath, 'utf-8');
  
  // Find all links matching /cheatsheet/
  const regex = /href="\/cheatsheet\/([^"]+)"/g;
  const links = [];
  let match;
  while ((match = regex.exec(html)) !== null) {
    links.push(match[1]);
  }

  console.log("Found cheatsheet slugs in range.html:");
  const uniqueLinks = [...new Set(links)];
  uniqueLinks.forEach(l => {
    console.log(`- ${l}`);
  });
}

main().catch(console.error);
