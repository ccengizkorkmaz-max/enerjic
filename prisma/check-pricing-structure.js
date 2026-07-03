const fs = require('fs');
const path = require('path');

async function main() {
  const filePath = path.join(__dirname, '..', 'prisma', 'homepage.html');
  if (!fs.existsSync(filePath)) {
    console.error("homepage.html missing.");
    return;
  }
  const html = fs.readFileSync(filePath, 'utf-8');

  // Find price_buy text around data-vehicle-id="3403"
  const idx = html.indexOf('data-vehicle-id="3403"');
  if (idx === -1) return;

  const slice = html.slice(idx, idx + 6000);
  const pricingIdx = slice.indexOf('class="pricing');
  if (pricingIdx !== -1) {
    console.log("Pricing context:");
    console.log(slice.slice(pricingIdx, pricingIdx + 1500));
  }
}

main().catch(console.error);
