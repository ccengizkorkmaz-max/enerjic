"use server";

import { db } from '@/lib/db';

export async function subscribeNewsletterAction(formData: FormData) {
  const email = (formData.get('email') as string || '').trim().toLowerCase();

  if (!email) {
    return { success: false, error: 'Lütfen e-posta adresinizi girin.' };
  }

  // Simple email regex validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { success: false, error: 'Geçersiz bir e-posta adresi girdiniz.' };
  }

  try {
    const existing = await db.newsletterSubscriber.findUnique({
      where: { email },
    });

    if (existing) {
      if (existing.isActive) {
        return { success: false, error: 'Bu e-posta adresiyle zaten abonesiniz.' };
      } else {
        // Re-activate
        await db.newsletterSubscriber.update({
          where: { email },
          data: { isActive: true },
        });
        return { success: true, message: 'E-Bülten aboneliğiniz başarıyla yeniden aktifleştirildi!' };
      }
    }

    // Save subscriber
    await db.newsletterSubscriber.create({
      data: {
        email,
        isActive: true,
      },
    });

    return { success: true, message: 'Aboneliğiniz başarıyla tamamlandı! Teşekkür ederiz.' };
  } catch (e: any) {
    console.error('Newsletter subscribe error: ', e);
    return { success: false, error: 'Abonelik sırasında hata oluştu: ' + e.message };
  }
}
