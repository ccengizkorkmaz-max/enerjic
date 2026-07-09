"use server";

import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function createStationAction(formData: FormData) {
  const name = formData.get('name') as string;
  const provider = formData.get('provider') as string;
  const city = formData.get('city') as string;
  const district = formData.get('district') as string;
  const address = formData.get('address') as string;
  const chargerType = formData.get('chargerType') as string || 'AC/DC';
  const powerKw = parseInt(formData.get('powerKw') as string) || 50;

  if (!name || !provider || !city || !district || !address) {
    return { success: false, error: 'Tüm zorunlu alanları doldurun.' };
  }

  try {
    await db.chargingStation.create({
      data: { name, provider, city, district, address, chargerType, powerKw },
    });
    revalidatePath('/admin/sarj-istasyonlari');
    revalidatePath('/sarj-rehberi');
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

export async function deleteStationAction(id: string) {
  try {
    await db.chargingStation.delete({ where: { id } });
    revalidatePath('/admin/sarj-istasyonlari');
    revalidatePath('/sarj-rehberi');
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

export async function getNearbyStations(city: string) {
  try {
    const stations = await db.chargingStation.findMany({
      where: {
        isActive: true,
        city: { equals: city, mode: 'insensitive' as any },
      },
      take: 6,
      orderBy: { powerKw: 'desc' },
    });

    // If no stations found for the exact city, return some popular ones
    if (stations.length === 0) {
      const fallback = await db.chargingStation.findMany({
        where: { isActive: true },
        take: 6,
        orderBy: { powerKw: 'desc' },
      });
      return { stations: fallback, city: 'Türkiye', isExact: false };
    }

    return { stations, city, isExact: true };
  } catch (e: any) {
    return { stations: [], city: '', isExact: false };
  }
}

export async function getStationStats() {
  try {
    const totalStations = await db.chargingStation.count({ where: { isActive: true } });
    const allStations = await db.chargingStation.findMany({
      where: { isActive: true },
      select: { city: true, provider: true },
    });
    const totalCities = new Set(allStations.map(s => s.city)).size;
    const totalProviders = new Set(allStations.map(s => s.provider)).size;
    return { totalStations, totalCities, totalProviders };
  } catch (e: any) {
    return { totalStations: 0, totalCities: 0, totalProviders: 0 };
  }
}
