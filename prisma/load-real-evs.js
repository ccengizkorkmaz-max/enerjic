const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const db = new PrismaClient();

const knownTwoWordBrands = [
  'mercedes-benz', 'aston-martin', 'rolls-royce', 'land-rover', 'alfa-romeo'
];

function splitBrandAndModel(fullName) {
  const words = fullName.trim().split(/\s+/);
  if (words.length === 0) return { brand: 'Unknown', model: '' };

  const firstWordLower = words[0].toLowerCase();
  const twoWordsLower = words.slice(0, 2).join('-').toLowerCase();

  if (knownTwoWordBrands.includes(twoWordsLower) && words.length >= 2) {
    return {
      brand: words.slice(0, 2).join(' '),
      model: words.slice(2).join(' ')
    };
  }

  // Handle case where brand is e.g. "GWM ORA"
  if (words[0].toLowerCase() === 'gwm' && words[1] && words[1].toLowerCase() === 'ora' && words.length >= 2) {
    return {
      brand: 'GWM ORA',
      model: words.slice(2).join(' ')
    };
  }

  return {
    brand: words[0],
    model: words.slice(1).join(' ')
  };
}

// Detect segment/body type from keywords or segment Code
function detectSegment(fullName, segmentCode) {
  const lower = fullName.toLowerCase();
  if (lower.includes('suv') || lower.includes('cross') || lower.includes('t-cross')) return 'SUV';
  if (lower.includes('coupe') || lower.includes('cabrio')) return 'Coupe';
  if (lower.includes('sportback') || lower.includes('fastback') || lower.includes('sedan') || lower.includes('limousine')) return 'Sedan';
  if (lower.includes('touring') || lower.includes('avant') || lower.includes('sw') || lower.includes('estate') || lower.includes('combi')) return 'Station Wagon';
  if (lower.includes('van') || lower.includes('mpv') || lower.includes('buzz') || lower.includes('multivan') || lower.includes('rifter') || lower.includes('berlingo') || lower.includes('combi')) return 'Van / MPV';
  if (lower.includes('hatchback') || lower.includes('sport') || lower.length < 25) return 'Hatchback';
  
  // Map code to segment
  if (segmentCode === 'N') return 'Van / MPV';
  if (segmentCode === 'F' || segmentCode === 'E') return 'Sedan';
  return 'SUV'; // Default fallback
}

// Parse top speed from the topspeed cheatsheet HTML
function getTopSpeedMap() {
  const map = new Map();
  const filePath = path.join(__dirname, '..', 'prisma', 'cheatsheets', 'topspeed.html');
  if (!fs.existsSync(filePath)) {
    console.warn("topspeed.html cheatsheet not found for extra top speed mapping.");
    return map;
  }
  const html = fs.readFileSync(filePath, 'utf-8');
  const rowRegex = /<tr>([\s\S]*?)<\/tr>/g;
  const linkRegex = /href="\/car\/(\d+)\//;
  const valRegex = /<span\s+class="bar"[^>]*>([\d.]+)<\/span>/;

  let match;
  while ((match = rowRegex.exec(html)) !== null) {
    const row = match[1];
    const linkMatch = linkRegex.exec(row);
    if (linkMatch) {
      const id = linkMatch[1];
      const valMatch = valRegex.exec(row);
      if (valMatch) {
        map.set(id, Math.round(parseFloat(valMatch[1])));
      }
    }
  }
  return map;
}

async function main() {
  console.log("=== Compilation of ALL 1375 vehicles (Active & Discontinued) ===");

  const localHtmlPath = path.join(__dirname, '..', 'prisma', 'homepage.html');
  if (!fs.existsSync(localHtmlPath)) {
    console.error(`homepage.html missing. Please save it first.`);
    return;
  }

  const html = fs.readFileSync(localHtmlPath, 'utf-8');
  const items = html.split('class="list-item');
  console.log(`Found ${items.length - 1} raw vehicle entries in HTML.`);

  const topSpeedMap = getTopSpeedMap();
  console.log(`Loaded ${topSpeedMap.size} top speed spec overrides from cheatsheet.`);

  const vehiclesList = [];

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

    // 4. Drive Type from tooltip
    let driveType = 'AWD';
    if (section.includes('Rear Wheel Drive')) driveType = 'RWD';
    else if (section.includes('Front Wheel Drive')) driveType = 'FWD';
    else if (section.includes('All Wheel Drive')) driveType = 'AWD';

    // 5. Specs
    const rangeMatch = /class="erange_real">(\d+)\s*km/.exec(section);
    const range = rangeMatch ? parseInt(rangeMatch[1]) : null;

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
    const segmentCode = segmentMatch ? segmentMatch[1].trim() : 'C';

    const { brand, model } = splitBrandAndModel(fullName);
    const segment = detectSegment(fullName, segmentCode);
    const topSpeed = topSpeedMap.get(evdbId) || (acceleration ? (acceleration < 4 ? 250 : (acceleration < 7 ? 200 : 160)) : null);

    const isDiscontinued = yearTo !== 2000;
    const specialTags = [];
    if (isDiscontinued) {
      specialTags.push("discontinued");
      specialTags.push(`production_years:${yearFrom}-${yearTo}`);
    }

    vehiclesList.push({
      brand,
      model,
      variant: isDiscontinued ? `Discontinued (${yearFrom}-${yearTo})` : 'Standart',
      year: yearFrom,
      segment,
      imageUrl: `/img/cars/${evdbId}/photo.jpg`, // We will map folder locally
      imageUrls: JSON.stringify([]),
      batteryCapacityKwh: battery,
      rangeKm: range,
      acceleration0100: acceleration,
      topSpeedKmh: topSpeed,
      curbWeightKg: weight,
      trunkLiters: cargo,
      maxDcChargingKw: maxDc,
      driveType,
      priceStartEur: priceEur,
      priceStartTl: priceEur ? priceEur * 36 : null, // Realistic exchange rate estimation (1 EUR = 36 TL)
      availableInTurkey: true,
      specialFeatures: JSON.stringify(specialTags),
      isActive: true,
      evdbId,
      slug
    });
  }

  console.log(`Parsed ${vehiclesList.length} vehicles. Deleting current DB entries...`);
  await db.electricVehicle.deleteMany();
  console.log("Deleted old records.");

  console.log(`Inserting ${vehiclesList.length} total real vehicles into database...`);
  let inserted = 0;
  for (const v of vehiclesList) {
    try {
      await db.electricVehicle.create({
        data: {
          brand: v.brand,
          model: v.model,
          variant: v.variant,
          year: v.year,
          segment: v.segment,
          imageUrl: v.imageUrl,
          imageUrls: v.imageUrls,
          batteryCapacityKwh: v.batteryCapacityKwh,
          rangeKm: v.rangeKm,
          acceleration0100: v.acceleration0100,
          topSpeedKmh: v.topSpeedKmh,
          curbWeightKg: v.curbWeightKg,
          trunkLiters: v.trunkLiters,
          maxDcChargingKw: v.maxDcChargingKw,
          driveType: v.driveType,
          priceStartEur: v.priceStartEur,
          priceStartTl: v.priceStartTl,
          availableInTurkey: v.availableInTurkey,
          specialFeatures: v.specialFeatures,
          isActive: v.isActive
        }
      });
      inserted++;
    } catch (e) {
      console.error(`Failed to insert ${v.brand} ${v.model}:`, e.message);
    }
  }

  console.log(`\n=== Successfully loaded ${inserted} total real vehicles into database! ===`);
  await db.$disconnect();
}

main().catch(console.error);
