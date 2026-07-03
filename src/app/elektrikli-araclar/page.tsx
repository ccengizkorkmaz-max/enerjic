import { db } from '@/lib/db';
import { getSEOMetadata } from '@/lib/seo';
import { Metadata } from 'next';
import EvCatalogClient from '@/components/EvCatalogClient';

export const metadata: Metadata = getSEOMetadata({
  title: 'Elektrikli Araç Kataloğu – Tüm Modeller ve Özellikler',
  description: 'Piyasadaki tüm elektrikli araçları keşfedin. Tesla, Togg, BYD, BMW ve daha fazlası. Menzil, güç, fiyat karşılaştırması.',
  slug: 'elektrikli-araclar',
});

export const dynamic = 'force-dynamic';

export default async function EvCatalogPage() {
  let vehicles: any[] = [];
  let brands: string[] = [];
  let segments: string[] = [];

  try {
    vehicles = await db.electricVehicle.findMany({
      where: { isActive: true },
      orderBy: [{ brand: 'asc' }, { model: 'asc' }],
    });

    brands = [...new Set(vehicles.map((v) => v.brand))].sort();
    segments = [...new Set(vehicles.map((v) => v.segment))].sort();
  } catch (e) {
    console.error('Error fetching EVs:', e);
  }

  // Stats
  const totalVehicles = vehicles.length;
  const totalBrands = brands.length;
  const maxRange = vehicles.reduce((max, v) => Math.max(max, v.rangeKm || 0), 0);

  return (
    <EvCatalogClient
      vehicles={vehicles}
      brands={brands}
      segments={segments}
      totalVehicles={totalVehicles}
      totalBrands={totalBrands}
      maxRange={maxRange}
    />
  );
}
