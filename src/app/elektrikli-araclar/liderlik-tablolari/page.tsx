import { db } from '@/lib/db';
import { getSEOMetadata } from '@/lib/seo';
import { Metadata } from 'next';
import EvLeaderboardsClient from '@/components/EvLeaderboardsClient';

export const metadata: Metadata = getSEOMetadata({
  title: 'Elektrikli Araç Liderlik Tabloları – Menzil, Hız ve Şarj Liderleri',
  description: 'Piyasadaki tüm elektrikli araçların menzil şampiyonlarını, 0-100 hızlanma sürelerini, maksimum hızlarını ve batarya kapasitelerini karşılaştırın.',
  slug: 'elektrikli-araclar/liderlik-tablolari',
});

export const dynamic = 'force-dynamic';

export default async function EvLeaderboardsPage() {
  let vehicles: any[] = [];

  try {
    vehicles = await db.electricVehicle.findMany({
      where: { isActive: true },
      select: {
        id: true,
        brand: true,
        model: true,
        variant: true,
        imageUrl: true,
        rangeKm: true,
        acceleration0100: true,
        topSpeedKmh: true,
        batteryCapacityKwh: true,
        maxDcChargingKw: true,
        availableInTurkey: true
      }
    });
  } catch (e) {
    console.error('Error fetching vehicles for leaderboards:', e);
  }

  return (
    <EvLeaderboardsClient vehicles={vehicles} />
  );
}
