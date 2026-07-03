import { db } from '@/lib/db';
import AdminEvClient from '@/components/AdminEvClient';

export const dynamic = 'force-dynamic';

export default async function AdminEvCatalogPage() {
  let vehicles: any[] = [];
  let totalCount = 0;

  try {
    vehicles = await db.electricVehicle.findMany({
      orderBy: [{ brand: 'asc' }, { model: 'asc' }, { variant: 'asc' }],
      select: {
        id: true,
        brand: true,
        model: true,
        variant: true,
        year: true,
        segment: true,
        rangeKm: true,
        powerHp: true,
        batteryCapacityKwh: true,
        priceStartTl: true,
        availableInTurkey: true,
      },
    });
    totalCount = vehicles.length;
  } catch (e) {
    console.error('Error fetching EVs:', e);
  }

  return <AdminEvClient vehicles={vehicles} totalCount={totalCount} />;
}
