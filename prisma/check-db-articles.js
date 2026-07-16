const { PrismaClient } = require('@prisma/client');
const db = new PrismaClient();

async function main() {
  const stats = await db.chargingStation.groupBy({
    by: ['city'],
    _count: {
      id: true
    },
    orderBy: {
      _count: {
        id: 'desc'
      }
    }
  });

  console.log("=== SEHİRLERE GÖRE İSTASYON SAYILARI ===");
  let total = 0;
  for (const s of stats) {
    console.log(`${s.city}: ${s._count.id} istasyon`);
    total += s._count.id;
  }
  console.log(`========================================`);
  console.log(`Toplam kayıtlı istasyon sayısı: ${total}`);
  
  await db.$disconnect();
}

main().catch(console.error);
