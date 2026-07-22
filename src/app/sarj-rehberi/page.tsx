import { db } from '@/lib/db';
import { getSEOMetadata } from '@/lib/seo';
import { Metadata } from 'next';
import { MapPin, Zap, Search, Filter, Battery, Navigation } from 'lucide-react';

export const metadata: Metadata = getSEOMetadata({
  title: 'Türkiye Şarj İstasyonları Rehberi',
  description: 'Türkiye genelinde elektrikli araç şarj istasyonlarını keşfedin. ZES, Trugo, Eşarj ve daha fazlası.',
  slug: 'sarj-rehberi',
});

export const dynamic = 'force-dynamic';

interface PageProps {
  searchParams: Promise<{ city?: string; provider?: string; q?: string }>;
}

export default async function ChargingStationsPage({ searchParams }: PageProps) {
  const { city = '', provider = '', q = '' } = await searchParams;

  const whereClause: any = { isActive: true };
  if (city) whereClause.city = city;
  if (provider) whereClause.provider = provider;
  if (q && q.trim()) {
    whereClause.OR = [
      { name: { contains: q } },
      { address: { contains: q } },
      { district: { contains: q } },
    ];
  }

  let stations: any[] = [];
  let allCities: string[] = [];
  let allProviders: string[] = [];

  try {
    stations = await db.chargingStation.findMany({
      where: whereClause,
      orderBy: { city: 'asc' },
    });

    const allStations = await db.chargingStation.findMany({
      where: { isActive: true },
      select: { city: true, provider: true },
    });
    allCities = [...new Set(allStations.map((s) => s.city))].sort();
    allProviders = [...new Set(allStations.map((s) => s.provider))].sort();
  } catch (e) {
    console.error('Error fetching charging stations: ', e);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      {/* Hero */}
      <div className="text-center mb-10 space-y-3">
        <div className="inline-flex items-center bg-emerald-50 text-emerald-700 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
          <Battery className="h-3.5 w-3.5 mr-1.5" />
          Türkiye Şarj Ağı
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
          Şarj İstasyonları <span className="text-emerald-700">Rehberi</span>
        </h1>
        <p className="text-gray-500 text-base max-w-2xl mx-auto">
          Türkiye genelindeki elektrikli araç şarj istasyonlarını şehir, sağlayıcı ve güç kapasitesine göre filtreleyin.
        </p>
      </div>

      {/* Filters */}
      <form method="GET" className="bg-white border border-gray-150 rounded-2xl p-5 mb-8 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              name="q"
              type="text"
              defaultValue={q}
              placeholder="İstasyon veya adres ara..."
              className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-800"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <select
              name="city"
              defaultValue={city}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-800 appearance-none"
            >
              <option value="">Tüm Şehirler</option>
              {allCities.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className="relative">
            <Zap className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <select
              name="provider"
              defaultValue={provider}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-800 appearance-none"
            >
              <option value="">Tüm Sağlayıcılar</option>
              {allProviders.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2.5 rounded-xl text-sm transition-colors cursor-pointer"
          >
            Filtrele
          </button>
        </div>
      </form>

      {/* Results count */}
      <p className="text-sm text-gray-500 mb-4 font-medium">
        <span className="font-bold text-gray-800">{stations.length}</span> şarj istasyonu bulundu.
      </p>

      {/* Station Cards */}
      {stations.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {stations.map((station) => (
            <div
              key={station.id}
              className="bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-md hover:border-emerald-100 transition-all duration-200 space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-extrabold text-gray-900 text-sm">{station.name}</h3>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full mt-1 inline-block">
                    {station.provider}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                    {station.chargerType}
                  </span>
                  <p className="text-xs font-extrabold text-gray-800 mt-1">{station.powerKw} kW</p>
                </div>
              </div>
              <div className="flex items-start space-x-2 text-xs text-gray-500 mb-3">
                <MapPin className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>{station.address}, {station.district}, {station.city}</span>
              </div>

              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${station.name} ${station.address} ${station.district} ${station.city}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center space-x-1.5 w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2.5 px-3 rounded-xl transition-all duration-200 shadow-sm"
              >
                <Navigation className="h-3.5 w-3.5 text-white" />
                <span>Haritada Yol Tarifi Al</span>
              </a>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 border border-dashed border-gray-200 rounded-2xl p-12 text-center">
          <p className="text-gray-400 text-sm">Arama kriterlerinize uygun şarj istasyonu bulunamadı.</p>
        </div>
      )}
    </div>
  );
}
