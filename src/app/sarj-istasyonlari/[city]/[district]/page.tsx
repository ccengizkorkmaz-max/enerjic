import { db } from '@/lib/db';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getSEOMetadata } from '@/lib/seo';
import { Metadata } from 'next';
import { slugify, getOriginalCityName, getOriginalDistrictName } from '@/lib/slugify';
import DistrictStationsClient from '@/components/DistrictStationsClient';
import { ArrowLeft, MapPin, Zap } from 'lucide-react';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ city: string; district: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city: citySlug, district: districtSlug } = await params;

  // Resolve casing from db unique lists
  const allStations = await db.chargingStation.findMany({ select: { city: true } });
  const uniqueCities = [...new Set(allStations.map(s => s.city))];
  const cityName = getOriginalCityName(citySlug, uniqueCities);

  if (!cityName) return {};

  const cityStations = await db.chargingStation.findMany({
    where: { city: cityName, isActive: true },
    select: { district: true }
  });
  const uniqueDistricts = [...new Set(cityStations.map(s => s.district))];
  const districtName = getOriginalDistrictName(districtSlug, uniqueDistricts);

  if (!districtName) return {};

  return getSEOMetadata({
    title: `${districtName} (${cityName}) Elektrikli Araç Şarj İstasyonları | Güncel Liste`,
    description: `${cityName} ili ${districtName} ilçesindeki tüm elektrikli araç şarj noktası adresleri, soket tipleri, hızlı DC şarj istasyonu konumları ve kW soket detayları.`,
    slug: `sarj-istasyonlari/${citySlug}/${districtSlug}`,
  });
}

export default async function DistrictChargingStationsPage({ params }: Props) {
  const { city: citySlug, district: districtSlug } = await params;

  // 1. Resolve City Name
  const allActiveStations = await db.chargingStation.findMany({
    where: { isActive: true },
    select: { city: true }
  });
  const uniqueCities = [...new Set(allActiveStations.map(s => s.city))];
  const cityName = getOriginalCityName(citySlug, uniqueCities);

  if (!cityName) {
    notFound();
  }

  // 2. Resolve District Name
  const cityStations = await db.chargingStation.findMany({
    where: { city: cityName, isActive: true },
    select: { district: true }
  });
  const uniqueDistricts = [...new Set(cityStations.map(s => s.district))];
  const districtName = getOriginalDistrictName(districtSlug, uniqueDistricts);

  if (!districtName) {
    notFound();
  }

  // 3. Query stations matching both Resolved City and Resolved District
  const stations = await db.chargingStation.findMany({
    where: {
      city: cityName,
      district: districtName,
      isActive: true
    },
    orderBy: { name: 'asc' }
  });

  const dcCount = stations.filter(s => s.chargerType.toLowerCase().includes('dc') || s.powerKw >= 50).length;
  const acCount = stations.length - dcCount;

  // JSON-LD Structured Data Schema for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": stations.map(s => ({
      "@type": "LocalBusiness",
      "@id": `https://enerjic.com/sarj-istasyonlari/${citySlug}/${districtSlug}#station-${s.id}`,
      "name": s.name,
      "description": `${s.provider} tarafından isletilen ${s.powerKw} kW gucunde ${s.chargerType} elektrikli arac sarj istasyonu.`,
      "address": {
        "@type": "PostalAddress",
        "streetAddress": s.address,
        "addressLocality": s.district,
        "addressRegion": s.city,
        "addressCountry": "TR"
      },
      "geo": {
        "@type": "GeoCoordinates"
      }
    }))
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Dynamic JSON-LD injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumbs */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center space-x-2 text-xs text-gray-500 font-bold">
          <Link href="/" className="hover:text-emerald-700 transition-colors">Anasayfa</Link>
          <span>/</span>
          <Link href="/sarj-istasyonlari" className="hover:text-emerald-700 transition-colors">Şarj İstasyonları</Link>
          <span>/</span>
          <Link href={`/sarj-istasyonlari/${citySlug}`} className="hover:text-emerald-700 transition-colors">{cityName}</Link>
          <span>/</span>
          <span className="text-emerald-700">{districtName}</span>
        </div>

        <Link
          href={`/sarj-istasyonlari/${citySlug}`}
          className="inline-flex items-center text-sm font-bold text-gray-500 hover:text-emerald-700 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {cityName} Şehir Rehberine Dön
        </Link>
      </div>

      {/* Header Info */}
      <div className="bg-gradient-to-br from-emerald-950 via-slate-900 to-slate-900 rounded-2xl p-6 sm:p-8 text-white relative border border-emerald-900/30">
        <div className="space-y-2 max-w-2xl">
          <span className="bg-emerald-500/10 text-emerald-400 text-xs font-black px-2.5 py-1 rounded-md border border-emerald-500/20 uppercase tracking-wider">
            İlçe Haritası
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-100 tracking-tight leading-tight">
            {districtName} Şarj İstasyonları
          </h1>
          <p className="text-sm text-gray-300">
            {cityName} ili, <strong>{districtName}</strong> ilçesinde yer alan aktif <strong>{stations.length}</strong> şarj istasyonunu aşağıdan inceleyebilirsiniz. 
          </p>
          
          {/* Small count pill layout */}
          <div className="flex flex-wrap gap-2 pt-4">
            <span className="bg-slate-800/80 text-gray-300 text-xs font-bold px-3 py-1 rounded-full border border-slate-700/50 flex items-center">
              <Zap className="h-3.5 w-3.5 mr-1 text-amber-500" />
              {dcCount} Hızlı DC Soket
            </span>
            <span className="bg-slate-800/80 text-gray-300 text-xs font-bold px-3 py-1 rounded-full border border-slate-700/50 flex items-center">
              <Zap className="h-3.5 w-3.5 mr-1 text-emerald-500" />
              {acCount} Standart AC Soket
            </span>
          </div>
        </div>
      </div>

      {/* Interactive Client Searchable Station Grid */}
      <DistrictStationsClient 
        stations={stations} 
        cityName={cityName} 
        districtName={districtName} 
      />
    </div>
  );
}
