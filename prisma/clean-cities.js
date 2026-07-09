const { PrismaClient } = require('@prisma/client');
const db = new PrismaClient();

const TURKISH_CITIES = [
  "Adana", "Adıyaman", "Afyonkarahisar", "Ağrı", "Amasya", "Ankara", "Antalya", "Artvin", "Aydın", "Balıkesir",
  "Bilecik", "Bingöl", "Bitlis", "Bolu", "Burdur", "Bursa", "Çanakkale", "Çankırı", "Çorum", "Denizli",
  "Diyarbakır", "Edirne", "Elazığ", "Erzincan", "Erzurum", "Eskişehir", "Gaziantep", "Giresun", "Gümüşhane", "Hakkari",
  "Hatay", "Isparta", "Mersin", "İstanbul", "İzmir", "Kars", "Kastamonu", "Kayseri", "Kırklareli", "Kırşehir",
  "Kocaeli", "Konya", "Kütahya", "Malatya", "Manisa", "Kahramanmaraş", "Mardin", "Muğla", "Muş", "Nevşehir",
  "Niğde", "Ordu", "Rize", "Sakarya", "Samsun", "Siirt", "Sinop", "Sivas", "Tekirdağ", "Tokat",
  "Trabzon", "Tunceli", "Şanlıurfa", "Uşak", "Van", "Yozgat", "Zonguldak", "Aksaray", "Bayburt", "Karaman",
  "Kırıkkale", "Batman", "Şırnak", "Bartın", "Ardahan", "Iğdır", "Yalova", "Karabük", "Kilis", "Osmaniye",
  "Düzce"
];

// Helper to normalize Turkish strings (remove accents, combining chars, standard casing)
function normalizeString(str) {
  if (!str) return "";
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove combining diacritics
    .replace(/I/g, "ı")
    .replace(/İ/g, "i")
    .toLowerCase()
    .replace(/ı/g, "i")
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .trim();
}

async function main() {
  console.log("=== Starting City Name Standardization ===");
  
  const stations = await db.chargingStation.findMany();
  console.log(`Analyzing ${stations.length} stations...`);

  let updatedCount = 0;

  for (const station of stations) {
    let detectedCity = null;
    const normCity = normalizeString(station.city);
    const normAddr = normalizeString(station.address);
    const normName = normalizeString(station.name);

    // 1. Try to find matched city in the city field itself
    for (const city of TURKISH_CITIES) {
      const normTarget = normalizeString(city);
      if (normCity === normTarget) {
        detectedCity = city;
        break;
      }
    }

    // 2. If not matched, search address field for "/ [City]" or just "[City]"
    if (!detectedCity) {
      for (const city of TURKISH_CITIES) {
        const normTarget = normalizeString(city);
        // Look for city in address (usually at the end after a slash or space)
        if (normAddr.endsWith(normTarget) || normAddr.includes(" " + normTarget) || normAddr.includes("/ " + normTarget) || normAddr.includes("/" + normTarget)) {
          detectedCity = city;
          break;
        }
      }
    }

    // 3. Fallback: Search the name of the station
    if (!detectedCity) {
      for (const city of TURKISH_CITIES) {
        const normTarget = normalizeString(city);
        if (normName.includes(normTarget)) {
          detectedCity = city;
          break;
        }
      }
    }

    // 4. Custom cleanups for address leftovers
    if (!detectedCity) {
      const lowerAddr = station.address.toLowerCase();
      if (lowerAddr.includes("sahrayıcedit") || lowerAddr.includes("kadıköy") || lowerAddr.includes("istanbul")) {
        detectedCity = "İstanbul";
      } else if (lowerAddr.includes("akçay") || lowerAddr.includes("edremit") || lowerAddr.includes("balıkesir")) {
        detectedCity = "Balıkesir";
      } else if (lowerAddr.includes("karacaahmet") || lowerAddr.includes("gaziantep")) {
        detectedCity = "Gaziantep";
      } else if (lowerAddr.includes("varsaklar") || lowerAddr.includes("adana")) {
        detectedCity = "Adana";
      } else if (lowerAddr.includes("yeşilöz") || lowerAddr.includes("ankara")) {
        detectedCity = "Ankara";
      }
    }

    // Default fallback if still not found, clean the string casing
    if (!detectedCity) {
      // Find closest or keep standard capitalized
      const cleaned = station.city.trim();
      detectedCity = cleaned.charAt(0).toUpperCase() + cleaned.slice(1).toLowerCase();
    }

    // Update if the city name changed
    if (detectedCity && detectedCity !== station.city) {
      await db.chargingStation.update({
        where: { id: station.id },
        data: { city: detectedCity }
      });
      updatedCount++;
    }
  }

  console.log(`Standardization complete. Updated ${updatedCount} stations.`);
  await db.$disconnect();
}

main().catch(console.error);
