const fs = require('fs');
const path = require('path');

const cheatsheetPath = "C:\\Users\\cengiz.korkmaz\\.gemini\\antigravity-ide\\brain\\7862a521-7ead-42af-9c9f-75693504075b\\.system_generated\\steps\\840\\content.md";
const html = fs.readFileSync(cheatsheetPath, 'utf-8');

const carLinkRegex = /\/car\/(\d+)\/([a-zA-Z0-9-_]+)/g;
const links = [];
let match;
while ((match = carLinkRegex.exec(html)) !== null) {
  const url = `https://ev-database.org/car/${match[1]}/${match[2]}`;
  if (!links.some(l => l.url === url)) {
    links.push({
      id: match[1],
      slug: match[2],
      url: url
    });
  }
}

console.log(`Found ${links.length} unique vehicle links in cheatsheet.`);
console.log("First 20 links:");
links.slice(0, 20).forEach(l => console.log(`- ${l.slug} (${l.url})`));
