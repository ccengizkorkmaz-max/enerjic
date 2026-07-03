const { PrismaClient } = require('@prisma/client');
const db = new PrismaClient();

const EV_BRANDS = [
  "Tesla", "Togg", "BYD", "BMW", "Mercedes-Benz", "Volkswagen", "Audi",
  "Hyundai", "Kia", "Porsche", "Volvo", "Peugeot", "Citroën", "Renault",
  "Fiat", "MG", "Cupra", "Smart", "Nio", "Xpeng", "Lucid", "Rivian",
  "Ford", "Opel", "Toyota", "Lexus", "Honda", "Dacia", "Škoda", "MINI",
  "Jaguar", "Polestar"
];

const API_KEY = process.env.GEMINI_API_KEY;

async function scanBatch(brands, retryCount = 0) {
  const prompt = `Sen bir otomotiv veritabani uzmanisiin. Asagidaki markalarin 2023-2025 yillari arasinda piyasada olan TUM tamamen elektrikli (BEV) arac modellerini listele.

MARKALAR: ${brands.join(", ")}

Her arac icin asagidaki JSON formatini kullan. Bilmedigin alanlara null yaz.
Yanitini SADECE bir JSON array olarak dondur, baska hicbir metin ekleme.

[
  {
    "brand": "Marka",
    "model": "Model adi",
    "variant": "Varyant (Long Range, Performance vb.) veya null",
    "year": 2025,
    "segment": "SUV/Sedan/Hatchback/Crossover/MPV/Pickup/Coupe",
    "batteryCapacityKwh": 75.0,
    "rangeKm": 507,
    "powerHp": 346,
    "powerKw": 258,
    "torqueNm": 450,
    "acceleration0100": 5.0,
    "topSpeedKmh": 217,
    "driveType": "AWD/RWD/FWD",
    "maxDcChargingKw": 250,
    "dcCharge10To80Min": 27.0,
    "acChargingKw": 11.0,
    "lengthMm": 4751,
    "widthMm": 1921,
    "heightMm": 1624,
    "wheelbaseMm": 2890,
    "curbWeightKg": 1979,
    "trunkLiters": 854,
    "priceStartTl": 1750000,
    "priceStartEur": 45000,
    "availableInTurkey": true,
    "specialFeatures": ["Autopilot", "V2L", "Isi Pompasi", "Cam Tavan"]
  }
]

ONEMLI:
- Sadece tamamen elektrikli (BEV) araclar. Hibrit HAYIR.
- Ayni modelin farkli varyantlarini ayri satir yaz (orn. Tesla Model 3 Standard Range, Long Range, Performance).
- Fiyatlari guncel Turkiye piyasasi icin TL olarak, yoksa EUR olarak ver.
- specialFeatures dizisinde en onemli 3-6 ozelligi listele.`;

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.3, maxOutputTokens: 65536 },
      }),
    }
  );

  if (res.status === 429) {
    if (retryCount >= 3) {
      console.error("  Max retries reached. Skipping batch.");
      return [];
    }
    const waitTime = 60000 * (retryCount + 1);
    console.error(`  Rate limited. Retry ${retryCount+1}/3 - waiting ${waitTime/1000}s...`);
    await sleep(waitTime);
    return scanBatch(brands, retryCount + 1);
  }

  if (!res.ok) {
    console.error(`  API error: HTTP ${res.status}`);
    return [];
  }

  const data = await res.json();
  // Gemini 2.5 Flash returns multiple parts (thinking + text), concatenate all
  const parts = data?.candidates?.[0]?.content?.parts || [];
  let rawText = parts.map(p => p.text || "").join("\n");
  // Strip markdown code fences
  rawText = rawText.replace(/```json\s*/gi, '').replace(/```\s*/g, '');
  const jsonMatch = rawText.match(/\[[\s\S]*\]/);
  if (!jsonMatch) {
    console.error("  No JSON found in response. First 200 chars:", rawText.substring(0, 200));
    return [];
  }

  try {
    return JSON.parse(jsonMatch[0]);
  } catch (e) {
    console.error("  JSON parse error:", e.message);
    return [];
  }
}

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function main() {
  console.log("=== EV Database Scanner ===");
  console.log(`API Key: ${API_KEY ? "OK (" + API_KEY.substring(0,8) + "...)" : "MISSING!"}`);
  
  let totalAdded = 0;
  let totalUpdated = 0;
  let totalErrors = 0;
  const batchSize = 2;

  for (let i = 0; i < EV_BRANDS.length; i += batchSize) {
    const batch = EV_BRANDS.slice(i, i + batchSize);
    console.log(`\nBatch ${Math.floor(i/batchSize)+1}/${Math.ceil(EV_BRANDS.length/batchSize)}: ${batch.join(", ")}`);

    const vehicles = await scanBatch(batch);
    console.log(`  Gemini returned ${vehicles.length} vehicles`);

    for (const v of vehicles) {
      if (!v.brand || !v.model || !v.year) continue;

      const specialFeaturesStr = v.specialFeatures ? JSON.stringify(v.specialFeatures) : null;

      try {
        const existing = await db.electricVehicle.findFirst({
          where: { brand: v.brand, model: v.model, variant: v.variant || null, year: v.year },
        });

        const vehicleData = {
          brand: v.brand, model: v.model, variant: v.variant || null,
          year: v.year, segment: v.segment || "Bilinmiyor",
          batteryCapacityKwh: v.batteryCapacityKwh || null,
          rangeKm: v.rangeKm || null, powerHp: v.powerHp || null,
          powerKw: v.powerKw || null, torqueNm: v.torqueNm || null,
          acceleration0100: v.acceleration0100 || null,
          topSpeedKmh: v.topSpeedKmh || null, driveType: v.driveType || null,
          maxDcChargingKw: v.maxDcChargingKw || null,
          dcCharge10To80Min: v.dcCharge10To80Min || null,
          acChargingKw: v.acChargingKw || null,
          lengthMm: v.lengthMm || null, widthMm: v.widthMm || null,
          heightMm: v.heightMm || null, wheelbaseMm: v.wheelbaseMm || null,
          curbWeightKg: v.curbWeightKg || null, trunkLiters: v.trunkLiters || null,
          priceStartTl: v.priceStartTl || null, priceStartEur: v.priceStartEur || null,
          availableInTurkey: v.availableInTurkey ?? true,
          specialFeatures: specialFeaturesStr,
        };

        if (existing) {
          await db.electricVehicle.update({ where: { id: existing.id }, data: vehicleData });
          totalUpdated++;
        } else {
          await db.electricVehicle.create({ data: vehicleData });
          totalAdded++;
        }
      } catch (e) {
        totalErrors++;
      }
    }

    console.log(`  Running total: +${totalAdded} added, ~${totalUpdated} updated, !${totalErrors} errors`);
    
    // Wait 8s between batches
    if (i + batchSize < EV_BRANDS.length) {
      console.log("  Waiting 8s before next batch...");
      await sleep(8000);
    }
  }

  const finalCount = await db.electricVehicle.count();
  console.log(`\n=== DONE ===`);
  console.log(`Added: ${totalAdded} | Updated: ${totalUpdated} | Errors: ${totalErrors}`);
  console.log(`Total vehicles in DB: ${finalCount}`);
  
  await db.$disconnect();
}

main().catch(console.error);
