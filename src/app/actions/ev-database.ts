"use server";

import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';

const EV_BRANDS = [
  "Tesla", "Togg", "BYD", "BMW", "Mercedes-Benz", "Volkswagen", "Audi",
  "Hyundai", "Kia", "Porsche", "Volvo", "Peugeot", "Citroën", "Renault",
  "Fiat", "MG", "Cupra", "Smart", "Nio", "Xpeng", "Lucid", "Rivian",
  "Ford", "Opel", "Toyota", "Lexus", "Honda", "Dacia", "Škoda", "MINI",
  "Jaguar", "Polestar"
];

interface ScanResult {
  success: boolean;
  added: number;
  updated: number;
  error?: string;
}

export async function scanEvDatabaseAction(): Promise<ScanResult> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return { success: false, added: 0, updated: 0, error: "GEMINI_API_KEY tanımlı değil." };
  }

  let totalAdded = 0;
  let totalUpdated = 0;

  // Process brands in batches of 8 to stay within token limits
  const batchSize = 8;
  for (let i = 0; i < EV_BRANDS.length; i += batchSize) {
    const batch = EV_BRANDS.slice(i, i + batchSize);

    const prompt = `Sen bir otomotiv veritabanı uzmanısın. Aşağıdaki markaların 2023-2025 yılları arasında piyasada olan TÜM tamamen elektrikli (BEV) araç modellerini listele.

MARKALAR: ${batch.join(", ")}

Her araç için aşağıdaki JSON formatını kullan. Bilmediğin alanlara null yaz.
Yanıtını SADECE bir JSON array olarak döndür, başka hiçbir metin ekleme.

[
  {
    "brand": "Marka",
    "model": "Model adı",
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
    "specialFeatures": ["Autopilot", "V2L", "Isı Pompası", "Cam Tavan"]
  }
]

ÖNEMLİ:
- Sadece tamamen elektrikli (BEV) araçlar. Hibrit HAYIR.
- Aynı modelin farklı varyantlarını ayrı satır yaz (ör. Tesla Model 3 Standard Range, Long Range, Performance).
- Fiyatları güncel Türkiye piyasası için TL olarak, yoksa EUR olarak ver.
- specialFeatures dizisinde en önemli 3-6 özelliği listele.`;

    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.3, maxOutputTokens: 8192 },
          }),
          signal: AbortSignal.timeout(120000),
        }
      );

      if (!res.ok) continue;

      const data = await res.json();
      const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

      // Extract JSON array from response
      const jsonMatch = rawText.match(/\[[\s\S]*\]/);
      if (!jsonMatch) continue;

      let vehicles: any[];
      try {
        vehicles = JSON.parse(jsonMatch[0]);
      } catch {
        continue;
      }

      for (const v of vehicles) {
        if (!v.brand || !v.model || !v.year) continue;

        const specialFeaturesStr = v.specialFeatures
          ? JSON.stringify(v.specialFeatures)
          : null;

        try {
          // Try upsert: update if exists, create if not
          const existing = await db.electricVehicle.findFirst({
            where: {
              brand: v.brand,
              model: v.model,
              variant: v.variant || null,
              year: v.year,
            },
          });

          const vehicleData = {
            brand: v.brand,
            model: v.model,
            variant: v.variant || null,
            year: v.year,
            segment: v.segment || "Bilinmiyor",
            batteryCapacityKwh: v.batteryCapacityKwh || null,
            rangeKm: v.rangeKm || null,
            powerHp: v.powerHp || null,
            powerKw: v.powerKw || null,
            torqueNm: v.torqueNm || null,
            acceleration0100: v.acceleration0100 || null,
            topSpeedKmh: v.topSpeedKmh || null,
            driveType: v.driveType || null,
            maxDcChargingKw: v.maxDcChargingKw || null,
            dcCharge10To80Min: v.dcCharge10To80Min || null,
            acChargingKw: v.acChargingKw || null,
            lengthMm: v.lengthMm || null,
            widthMm: v.widthMm || null,
            heightMm: v.heightMm || null,
            wheelbaseMm: v.wheelbaseMm || null,
            curbWeightKg: v.curbWeightKg || null,
            trunkLiters: v.trunkLiters || null,
            priceStartTl: v.priceStartTl || null,
            priceStartEur: v.priceStartEur || null,
            availableInTurkey: v.availableInTurkey ?? true,
            specialFeatures: specialFeaturesStr,
          };

          if (existing) {
            await db.electricVehicle.update({
              where: { id: existing.id },
              data: vehicleData,
            });
            totalUpdated++;
          } else {
            await db.electricVehicle.create({ data: vehicleData });
            totalAdded++;
          }
        } catch (e) {
          // Skip individual vehicle errors and continue
          console.error(`EV upsert error for ${v.brand} ${v.model}:`, e);
        }
      }
    } catch (e) {
      console.error(`Gemini batch error for brands ${batch.join(",")}:`, e);
    }
  }

  revalidatePath("/admin/ev-katalogu");
  revalidatePath("/elektrikli-araclar");

  return { success: true, added: totalAdded, updated: totalUpdated };
}

export async function deleteEvAction(id: string) {
  try {
    await db.electricVehicle.delete({ where: { id } });
    revalidatePath("/admin/ev-katalogu");
    revalidatePath("/elektrikli-araclar");
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}
