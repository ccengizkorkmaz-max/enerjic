import { db } from '@/lib/db';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getSEOMetadata } from '@/lib/seo';
import { Metadata } from 'next';
import { slugify, getOriginalCityName } from '@/lib/slugify';
import { MapPin, ArrowLeft, Zap, Info, Shield, Layers, LayoutGrid } from 'lucide-react';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ city: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city: citySlug } = await params;

  // Fetch unique cities to resolve original casing
  const stations = await db.chargingStation.findMany({ select: { city: true } });
  const uniqueCities = [...new Set(stations.map(s => s.city))];
  const cityName = getOriginalCityName(citySlug, uniqueCities);

  if (!cityName) return {};

  return getSEOMetadata({
    title: `${cityName} Elektrikli Araç Şarj İstasyonları Haritası ve Noktaları`,
    description: `${cityName} ilindeki tüm elektrikli araç şarj istasyonu konumları, ZES, Eşarj, Trugo sağlayıcıları, AC/DC hızlı şarj güçleri ve kW soket detayları.`,
    slug: `sarj-istasyonlari/${citySlug}`,
  });
}

export default async function CityChargingStationsPage({ params }: Props) {
  const { city: citySlug } = await params;

  // Resolve original casing of city name
  const allStations = await db.chargingStation.findMany({
    where: { isActive: true },
    select: { city: true, district: true, provider: true }
  });

  const uniqueCities = [...new Set(allStations.map(s => s.city))];
  const cityName = getOriginalCityName(citySlug, uniqueCities);

  if (!cityName) {
    notFound();
  }

  // Filter stations in this city
  const cityStations = await db.chargingStation.findMany({
    where: { city: cityName, isActive: true },
    orderBy: { district: 'asc' }
  });

  // Distribute districts counts
  const districtCountsMap: { [key: string]: number } = {};
  // Distribute provider counts
  const providerCountsMap: { [key: string]: number } = {};

  cityStations.forEach(s => {
    if (s.district) {
      districtCountsMap[s.district] = (districtCountsMap[s.district] || 0) + 1;
    }
    if (s.provider) {
      providerCountsMap[s.provider] = (providerCountsMap[s.provider] || 0) + 1;
    }
  });

  const districtsData = Object.entries(districtCountsMap)
    .map(([district, count]) => ({ district, count }))
    .sort((a, b) => b.count - a.count);

  const providerDistribution = Object.entries(providerCountsMap)
    .map(([provider, count]) => ({
      provider,
      count,
      percent: Math.round((count / cityStations.length) * 100)
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5); // top 5 providers in city

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Breadcrumbs & Navigation Back */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center space-x-2 text-xs text-gray-500 font-bold">
          <Link href="/" className="hover:text-emerald-700 transition-colors">Anasayfa</Link>
          <span>/</span>
          <Link href="/sarj-istasyonlari" className="hover:text-emerald-700 transition-colors">Şarj İstasyonları</Link>
          <span>/</span>
          <span className="text-emerald-700">{cityName}</span>
        </div>

        <Link
          href="/sarj-istasyonlari"
          className="inline-flex items-center text-sm font-bold text-gray-500 hover:text-emerald-700 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Tüm Şehirlere Dön
        </Link>
      </div>

      {/* Hero Header */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-950 rounded-2xl p-6 sm:p-8 border border-gray-800 text-white flex flex-col sm:flex-row justify-between sm:items-center gap-6">
        <div className="space-y-2">
          <span className="bg-emerald-500/10 text-emerald-400 text-xs font-black px-2.5 py-1 rounded-md border border-emerald-500/20 uppercase tracking-wider">
            Şehir Rehberi
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-100 tracking-tight">
            {cityName} Şarj İstasyonu Noktaları
          </h1>
          <p className="text-sm text-gray-400 max-w-xl">
            {cityName} genelinde toplam <strong>{cityStations.length}</strong> şarj istasyonu tespit edilmiştir. Soket güç çıkışı (AC/DC kW) detayları ve soket türleri için ilçenizi seçin.
          </p>
        </div>
        <div className="bg-emerald-700/10 border border-emerald-500/20 rounded-xl p-4 text-center shrink-0 min-w-[120px]">
          <p className="text-3xl font-black text-emerald-400">{cityStations.length}</p>
          <p className="text-[10px] uppercase font-bold text-emerald-500 tracking-wider mt-1">Aktif Nokta</p>
        </div>
      </div>

      {/* Top Providers Chart (CSS-based) */}
      {providerDistribution.length > 0 && (
        <div className="bg-gray-50/50 border border-gray-100 rounded-2xl p-6 space-y-6">
          <div className="flex items-center space-x-2">
            <Layers className="h-5 w-5 text-emerald-700" />
            <h2 className="text-lg font-black text-gray-900 tracking-tight">
              {cityName} Genelinde En Büyük Şarj Sağlayıcıları
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              {providerDistribution.map((item) => (
                <div key={item.provider} className="space-y-1">
                  <div className="flex justify-between text-xs font-bold text-gray-700">
                    <span>{item.provider}</span>
                    <span>{item.count} İstasyon ({item.percent}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-emerald-600 h-full rounded-full transition-all"
                      style={{ width: `${item.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="flex flex-col justify-center bg-white p-4 rounded-xl border border-gray-100 space-y-2">
              <div className="flex items-start space-x-2 text-xs text-gray-500 leading-relaxed">
                <Info className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <p>
                  {cityName} şehrindeki elektrikli şarj istasyonlarının büyük kısmı <strong>{providerDistribution[0]?.provider}</strong> markasına ait altyapıdan oluşmaktadır. Genellikle seyahat rotaları üzerinde DC hızlı şarj, otopark ve otel alanlarında ise AC şarj soketleri yoğunluktadır.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Districts List Grid */}
      <div className="space-y-6">
        <div className="flex items-center space-x-2 border-b border-gray-100 pb-4">
          <LayoutGrid className="h-5 w-5 text-emerald-700" />
          <h2 className="text-xl font-black text-gray-900 tracking-tight">
            İlçelere Göre {cityName} Şarj Noktaları
          </h2>
        </div>
        
        {districtsData.length === 0 ? (
          <div className="text-center py-8 text-sm text-gray-400 font-medium bg-gray-50 rounded-xl">
            Bu şehirde henüz ilçe bazlı veri sınıflandırılmamış.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {districtsData.map(item => (
              <Link
                key={item.district}
                href={`/sarj-istasyonlari/${citySlug}/${slugify(item.district)}`}
                className="group block p-4 bg-white border border-gray-100 hover:border-emerald-300 rounded-xl hover:shadow-sm transition-all"
              >
                <p className="font-extrabold text-sm text-gray-800 group-hover:text-emerald-700 transition-colors">
                  {item.district}
                </p>
                <p className="text-xs text-gray-400 font-bold mt-0.5">
                  {item.count} Şarj İstasyonu
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* City Top Sample Stations Table */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <MapPin className="h-5 w-5 text-emerald-700" />
          <h2 className="text-lg font-black text-gray-900 tracking-tight">
            {cityName} Öne Çıkan Bazı Şarj İstasyonları
          </h2>
        </div>
        <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-500">
              <thead className="bg-gray-50 text-xs font-bold text-gray-700 uppercase border-b border-gray-100">
                <tr>
                  <th scope="col" className="px-6 py-3.5">İstasyon Adı</th>
                  <th scope="col" className="px-6 py-3.5">İlçe</th>
                  <th scope="col" className="px-6 py-3.5">Sağlayıcı</th>
                  <th scope="col" className="px-6 py-3.5">Soket Gücü</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {cityStations.slice(0, 15).map((station) => (
                  <tr key={station.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-bold text-gray-900">{station.name}</td>
                    <td className="px-6 py-4 font-semibold text-gray-600">{station.district}</td>
                    <td className="px-6 py-4">
                      <span className="bg-emerald-50 text-emerald-700 text-[10px] font-extrabold px-2.5 py-1 rounded-full border border-emerald-100">
                        {station.provider}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-700">{station.powerKw} kW ({station.chargerType})</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
