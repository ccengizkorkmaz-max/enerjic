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
