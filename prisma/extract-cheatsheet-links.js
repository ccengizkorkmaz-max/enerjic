const fs = require('fs');
const path = require('path');

const cheatsheetPath = "C:\\Users\\cengiz.korkmaz\\.gemini\\antigravity-ide\\brain\\7862a521-7ead-42af-9c9f-75693504075b\\.system_generated\\steps\\840\\content.md";
const html = fs.readFileSync(cheatsheetPath, 'utf-8');

// Parse all links like <a href="/car/XXXX/Slug" ...>Text</a>
const carLinkRegex = /<a\s+href="\/car\/(\d+)\/([^"]+)"[^>]*>([^<]+)<\/a>/g;
const cars = [];
let match;
while ((match = carLinkRegex.exec(html)) !== null) {
  const id = match[1];
  const slug = match[2];
  const name = match[3].trim();
  if (!cars.some(c => c.id === id)) {
    cars.push({ id, slug, name });
  }
}

console.log(`Parsed ${cars.length} unique cars from cheatsheet.`);
console.log("First 30 cars:");
cars.slice(0, 30).forEach(c => {
  console.log(`- ID: ${c.id}, Slug: ${c.slug}, Name: ${c.name}`);
});
