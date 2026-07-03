const { PrismaClient } = require('@prisma/client');
const db = new PrismaClient();

async function seed() {
  const stations = [
    { name: 'İstinye Park AVM', provider: 'ZES', city: 'İstanbul', district: 'Sarıyer', address: 'İstinye Mah. Bayır Cad. No:73', chargerType: 'DC', powerKw: 180 },
    { name: 'Ankara Kızılay Meydanı', provider: 'Trugo', city: 'Ankara', district: 'Çankaya', address: 'Atatürk Bulvarı No:15', chargerType: 'AC/DC', powerKw: 120 },
    { name: 'Forum İstanbul AVM', provider: 'Eşarj', city: 'İstanbul', district: 'Bayrampaşa', address: 'Kocatepe Mah. Paşa Cad. No:2', chargerType: 'DC', powerKw: 150 },
    { name: 'Optimum İzmir AVM', provider: 'ZES', city: 'İzmir', district: 'Gaziemir', address: 'Atatürk Organize Sanayi Bölgesi', chargerType: 'AC/DC', powerKw: 100 },
    { name: 'Bursa Nilüfer Park', provider: 'Voltrun', city: 'Bursa', district: 'Nilüfer', address: 'Beşevler Mah. Çetin Cad. No:8', chargerType: 'DC', powerKw: 60 },
    { name: 'Antalya Lara Sahil', provider: 'Sharz.net', city: 'Antalya', district: 'Muratpaşa', address: 'Lara Cad. No:120', chargerType: 'AC', powerKw: 22 },
    { name: 'Togg Deneyim Merkezi', provider: 'Trugo', city: 'İstanbul', district: 'Beşiktaş', address: 'Levent Mah. Büyükdere Cad. No:193', chargerType: 'DC', powerKw: 300 },
    { name: 'Ankara Esenboğa Havalimanı', provider: 'ZES', city: 'Ankara', district: 'Çubuk', address: 'Esenboğa Havalimanı Terminal 2', chargerType: 'DC', powerKw: 150 },
  ];

  for (const s of stations) {
    await db.chargingStation.create({ data: s });
  }
  console.log('Seeded', stations.length, 'stations');
  await db.$disconnect();
}

seed();
