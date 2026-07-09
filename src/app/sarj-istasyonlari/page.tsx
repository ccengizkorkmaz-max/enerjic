import { db } from '@/lib/db';
import ChargingStationsClient from '@/components/ChargingStationsClient';
import { getSEOMetadata } from '@/lib/seo';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = getSEOMetadata({
  title: 'Elektrikli Araç Şarj İstasyonları Haritası ve Noktaları',
  description: 'Türkiye genelindeki tüm elektrikli araç şarj istasyonlarının konumları, ZES, Eşarj, Trugo gibi sağlayıcılar, AC/DC şarj soketleri ve kW güç çıkışları.',
  slug: 'sarj-istasyonlari',
});

export default async function ChargingStationsLandingPage() {
  // Fetch charging stations and group them by city to get counts
  const stations = await db.chargingStation.findMany({
    where: { isActive: true },
    select: { city: true, provider: true }
  });

  const cityCountsMap: { [key: string]: number } = {};
  const providersSet = new Set<string>();

  stations.forEach(s => {
    if (s.city) {
      cityCountsMap[s.city] = (cityCountsMap[s.city] || 0) + 1;
    }
    if (s.provider) {
      providersSet.add(s.provider);
    }
  });

  const citiesData = Object.entries(cityCountsMap)
    .map(([city, count]) => ({ city, count }))
    .sort((a, b) => b.count - a.count); // sort by count descending initially

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <ChargingStationsClient 
        cities={citiesData} 
        totalStations={stations.length}
        providerCount={providersSet.size}
      />
    </div>
  );
}
