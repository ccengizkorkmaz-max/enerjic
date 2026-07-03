const fs = require('fs');
const path = require('path');

async function main() {
  const filePath = path.join(__dirname, '..', 'prisma', 'homepage.html');
  if (!fs.existsSync(filePath)) {
    console.error("homepage.html missing.");
    return;
  }
  const html = fs.readFileSync(filePath, 'utf-8');

  // Regex to split by each vehicle container
  // Every vehicle card is wrapped in a container that starts with class="list-item"
  // Let's check how many list-items there are
  const items = html.split('class="list-item');
  console.log(`Total sections split by class="list-item: ${items.length}`);

  // The first section is header markup, so we skip it.
  const cars = [];
  
  for (let i = 1; i < items.length; i++) {
    const section = items[i];

    // 1. evdbId
    const idMatch = /data-vehicle-id="(\d+)"/.exec(section);
    if (!idMatch) continue;
    const evdbId = idMatch[1];

    // 2. Slug
    const slugMatch = /href=\/car\/\d+\/([^\s>]+)/.exec(section);
    const slug = slugMatch ? slugMatch[1] : null;

    // 3. Full Name from alt
    const altMatch = /alt="([^"]+)"/.exec(section);
    const fullName = altMatch ? altMatch[1].trim() : 'Unknown';

    // 4. Specs
    const rangeMatch = /class="erange_real">(\d+)\s*km/.exec(section);
    const range = rangeMatch ? parseInt(rangeMatch[1]) : null;

    const effMatch = /class="efficiency">(\d+)\s*Wh\/km/.exec(section);
    const efficiency = effMatch ? parseInt(effMatch[1]) : null;

    const weightMatch = /class="weight hidden">(\d+)/.exec(section);
    const weight = weightMatch ? parseInt(weightMatch[1]) : null;

    const accMatch = /class="acceleration hidden">([\d.]+)/.exec(section);
    const acceleration = accMatch ? parseFloat(accMatch[1]) : null;

    const batteryMatch = /class="battery hidden">([\d.]+)/.exec(section);
    const battery = batteryMatch ? parseFloat(batteryMatch[1]) : null;

    const dcMatch = /class="fastcharge_speed hidden">(\d+)/.exec(section);
    const maxDc = dcMatch ? parseInt(dcMatch[1]) : null;

    const towMatch = /class="towweight hidden">(\d+)/.exec(section);
    const towing = towMatch ? parseInt(towMatch[1]) : null;

    const cargoMatch = /class="cargo">(\d+)\s*L/.exec(section);
    const cargo = cargoMatch ? parseInt(cargoMatch[1]) : null;

    const priceMatch = /class="pricesort hidden">(\d+)/.exec(section);
    const priceEur = priceMatch ? parseInt(priceMatch[1]) : null;

    const yearFromMatch = /class="year_from hidden">(\d+)/.exec(section);
    const yearFrom = yearFromMatch ? parseInt(yearFromMatch[1]) : 2024;

    const yearToMatch = /class="year_to hidden">(\d+)/.exec(section);
    const yearTo = yearToMatch ? parseInt(yearToMatch[1]) : 2000;

    const segmentMatch = /class="size-[^"]+">([^<]+)<\/span>/.exec(section);
    const segmentCode = segmentMatch ? segmentMatch[1].trim() : 'SUV';

    cars.push({
      evdbId,
      slug,
      fullName,
      range,
      efficiency,
      weight,
      acceleration,
      battery,
      maxDc,
      towing,
      cargo,
      priceEur,
      year: yearFrom,
      yearTo,
      isDiscontinued: yearTo !== 2000,
      segmentCode
    });
  }

  console.log(`Successfully parsed ${cars.length} vehicles!`);
  console.log("\nFirst 3 parsed vehicles:");
  console.log(cars.slice(0, 3));
  console.log("\nLast 3 parsed vehicles:");
  console.log(cars.slice(-3));
}

main().catch(console.error);
