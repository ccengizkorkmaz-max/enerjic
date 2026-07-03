import { db } from '@/lib/db';
import { getSEOMetadata } from '@/lib/seo';
import { Metadata } from 'next';
import EvFinderWizard from '@/components/EvFinderWizard';

export const metadata: Metadata = getSEOMetadata({
  title: 'Sana Uygun Elektrikli Araç Bul – Akıllı Öneri Sihirbazı',
  description: 'Bütçeni, kullanım alışkanlığını ve tercihlerini belirle, sana en uygun elektrikli aracı bulalım.',
  slug: 'elektrikli-araclar/oneri',
});

export const dynamic = 'force-dynamic';

export default async function EvFinderPage() {
  let vehicles: any[] = [];

  try {
    vehicles = await db.electricVehicle.findMany({
      where: { isActive: true },
      orderBy: [{ brand: 'asc' }, { model: 'asc' }],
    });
  } catch (e) {
    console.error('Error fetching EVs for finder:', e);
  }

  return <EvFinderWizard vehicles={vehicles} />;
}
