"use server";

import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';

export async function createCommentAction(articleId: string, formData: FormData) {
  const authorName = formData.get('authorName') as string;
  const authorEmail = (formData.get('authorEmail') as string) || null;
  const content = formData.get('content') as string;
  const consent = formData.get('consent') === 'true';

  if (!authorName || !content) {
    return { success: false, error: 'Lütfen adınızı ve yorumunuzu yazın.' };
  }

  if (!consent) {
    return { success: false, error: 'Lütfen kişisel verilerinizin saklanmasını (KVKK) onaylayın.' };
  }

  try {
    const article = await db.article.findUnique({
      where: { id: articleId },
    });

    if (!article) {
      return { success: false, error: 'Haber bulunamadı.' };
    }

    await db.comment.create({
      data: {
        authorName,
        authorEmail,
        content,
        articleId,
        isApproved: false,
      },
    });

    revalidatePath(`/haber/${article.slug}`);

    return { success: true, message: 'Yorumunuz alındı. Editör onayından sonra yayınlanacaktır.' };
  } catch (e: any) {
    console.error('Error posting comment: ', e);
    return { success: false, error: 'Yorum eklenirken hata oluştu: ' + e.message };
  }
}
