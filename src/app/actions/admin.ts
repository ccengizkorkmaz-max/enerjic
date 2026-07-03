"use server";

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';

// 1. Auth Actions
export async function loginAction(formData: FormData) {
  const password = formData.get('password') as string;
  const adminPassword = process.env.ADMIN_PASSWORD || 'enerjic123';

  if (password === adminPassword) {
    const cookieStore = await cookies();
    cookieStore.set('admin_session', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 1 day
      path: '/',
    });
    return { success: true };
  }

  return { success: false, error: 'Hatalı şifre girdiniz.' };
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete('admin_session');
  redirect('/admin/login');
}

export async function checkAuth() {
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session');
  return session?.value === 'true';
}

// 2. Article Actions
export async function createArticleAction(formData: FormData) {
  const isAuthenticated = await checkAuth();
  if (!isAuthenticated) {
    return { success: false, error: 'Yetkisiz işlem.' };
  }

  const title = formData.get('title') as string;
  const summary = formData.get('summary') as string;
  const slug = formData.get('slug') as string;
  const categoryId = formData.get('categoryId') as string;
  const imageUrl = (formData.get('imageUrl') as string) || null;
  const content = formData.get('content') as string;
  const isFeatured = formData.get('isFeatured') === 'true';

  if (!title || !summary || !slug || !categoryId || !content) {
    return { success: false, error: 'Lütfen zorunlu alanları doldurun.' };
  }

  try {
    const existing = await db.article.findUnique({ where: { slug } });
    if (existing) {
      return { success: false, error: 'Bu URL slug zaten kullanımda.' };
    }

    const article = await db.article.create({
      data: {
        title,
        summary,
        slug,
        categoryId,
        imageUrl,
        content,
        isFeatured,
      },
      include: { category: true },
    });

    revalidatePath('/');
    revalidatePath(`/haber/${slug}`);
    revalidatePath(`/kategori/${article.category.slug}`);
    revalidatePath('/sitemap.xml');

    return { success: true };
  } catch (e: any) {
    console.error('Error creating article: ', e);
    return { success: false, error: 'Haber kaydedilirken hata oluştu: ' + e.message };
  }
}

export async function updateArticleAction(id: string, formData: FormData) {
  const isAuthenticated = await checkAuth();
  if (!isAuthenticated) {
    return { success: false, error: 'Yetkisiz işlem.' };
  }

  const title = formData.get('title') as string;
  const summary = formData.get('summary') as string;
  const slug = formData.get('slug') as string;
  const categoryId = formData.get('categoryId') as string;
  const imageUrl = (formData.get('imageUrl') as string) || null;
  const content = formData.get('content') as string;
  const isFeatured = formData.get('isFeatured') === 'true';

  if (!title || !summary || !slug || !categoryId || !content) {
    return { success: false, error: 'Lütfen zorunlu alanları doldurun.' };
  }

  try {
    const existing = await db.article.findFirst({
      where: { slug, id: { not: id } },
    });
    if (existing) {
      return { success: false, error: 'Bu URL slug başka bir haberde kullanılıyor.' };
    }

    const oldArticle = await db.article.findUnique({
      where: { id },
      include: { category: true },
    });

    const article = await db.article.update({
      where: { id },
      data: {
        title,
        summary,
        slug,
        categoryId,
        imageUrl,
        content,
        isFeatured,
      },
      include: { category: true },
    });

    revalidatePath('/');
    revalidatePath(`/haber/${slug}`);
    if (oldArticle) {
      revalidatePath(`/haber/${oldArticle.slug}`);
      revalidatePath(`/kategori/${oldArticle.category.slug}`);
    }
    revalidatePath(`/kategori/${article.category.slug}`);
    revalidatePath('/sitemap.xml');

    return { success: true };
  } catch (e: any) {
    console.error('Error updating article: ', e);
    return { success: false, error: 'Haber güncellenirken hata oluştu: ' + e.message };
  }
}

export async function deleteArticleAction(id: string) {
  const isAuthenticated = await checkAuth();
  if (!isAuthenticated) {
    return { success: false, error: 'Yetkisiz işlem.' };
  }

  try {
    const article = await db.article.delete({
      where: { id },
      include: { category: true },
    });

    revalidatePath('/');
    revalidatePath(`/haber/${article.slug}`);
    revalidatePath(`/kategori/${article.category.slug}`);
    revalidatePath('/sitemap.xml');

    return { success: true };
  } catch (e: any) {
    console.error('Error deleting article: ', e);
    return { success: false, error: 'Haber silinirken hata oluştu: ' + e.message };
  }
}

export async function updateAdPlacementAction(id: string, formData: FormData) {
  const isAuthenticated = await checkAuth();
  if (!isAuthenticated) {
    return { success: false, error: 'Yetkisiz işlem.' };
  }

  const adClient = formData.get('adClient') as string;
  const adSlot = formData.get('adSlot') as string;
  const minHeightStr = formData.get('minHeight') as string;
  const isActive = formData.get('isActive') === 'true';

  if (!adClient || !adSlot || !minHeightStr) {
    return { success: false, error: 'Lütfen tüm zorunlu alanları doldurun.' };
  }

  const minHeight = parseInt(minHeightStr, 10);
  if (isNaN(minHeight) || minHeight < 0) {
    return { success: false, error: 'Yükseklik değeri geçerli bir pozitif sayı olmalıdır.' };
  }

  try {
    await db.adPlacement.update({
      where: { id },
      data: {
        adClient,
        adSlot,
        minHeight,
        isActive,
      },
    });

    revalidatePath('/');
    revalidatePath('/haber/[slug]', 'page');
    revalidatePath('/kategori/[slug]', 'page');

    return { success: true };
  } catch (e: any) {
    console.error('Error updating ad placement: ', e);
    return { success: false, error: 'Reklam yerleşimi güncellenirken hata oluştu: ' + e.message };
  }
}

export async function approveCommentAction(id: string) {
  const isAuthenticated = await checkAuth();
  if (!isAuthenticated) {
    return { success: false, error: 'Yetkisiz işlem.' };
  }

  try {
    const comment = await db.comment.update({
      where: { id },
      data: { isApproved: true },
      include: { article: true },
    });

    revalidatePath(`/haber/${comment.article.slug}`);

    return { success: true };
  } catch (e: any) {
    console.error('Error approving comment: ', e);
    return { success: false, error: 'Yorum onaylanırken hata oluştu: ' + e.message };
  }
}

export async function deleteCommentAction(id: string) {
  const isAuthenticated = await checkAuth();
  if (!isAuthenticated) {
    return { success: false, error: 'Yetkisiz işlem.' };
  }

  try {
    const comment = await db.comment.delete({
      where: { id },
      include: { article: true },
    });

    revalidatePath(`/haber/${comment.article.slug}`);

    return { success: true };
  } catch (e: any) {
    console.error('Error deleting comment: ', e);
    return { success: false, error: 'Yorum silinirken hata oluştu: ' + e.message };
  }
}

export async function deleteSubscriberAction(id: string) {
  const isAuthenticated = await checkAuth();
  if (!isAuthenticated) {
    return { success: false, error: 'Yetkisiz işlem.' };
  }

  try {
    await db.newsletterSubscriber.delete({
      where: { id },
    });

    revalidatePath('/admin/bulten');

    return { success: true };
  } catch (e: any) {
    console.error('Error deleting subscriber: ', e);
    return { success: false, error: 'Abone silinirken hata oluştu: ' + e.message };
  }
}

function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[ğĞ]/g, 'g')
    .replace(/[üÜ]/g, 'u')
    .replace(/[şŞ]/g, 's')
    .replace(/[ıİ]/g, 'i')
    .replace(/[öÖ]/g, 'o')
    .replace(/[çÇ]/g, 'c')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-');
}

export async function createCategoryAction(formData: FormData) {
  const isAuthenticated = await checkAuth();
  if (!isAuthenticated) {
    return { success: false, error: 'Yetkisiz işlem.' };
  }

  const name = (formData.get('name') as string || '').trim();
  const description = (formData.get('description') as string || '').trim();

  if (!name) {
    return { success: false, error: 'Kategori adı zorunludur.' };
  }

  const slug = slugify(name);

  try {
    const existing = await db.category.findFirst({
      where: {
        OR: [
          { name },
          { slug },
        ],
      },
    });

    if (existing) {
      return { success: false, error: 'Bu isimde veya URL uzantısında (slug) bir kategori zaten mevcut.' };
    }

    await db.category.create({
      data: {
        name,
        slug,
        description: description || null,
      },
    });

    revalidatePath('/');
    revalidatePath('/haber/[slug]', 'page');
    revalidatePath('/kategori/[slug]', 'page');
    revalidatePath('/sitemap.xml');

    return { success: true };
  } catch (e: any) {
    console.error('Error creating category: ', e);
    return { success: false, error: 'Kategori oluşturulurken hata oluştu: ' + e.message };
  }
}

export async function updateCategoryAction(id: string, formData: FormData) {
  const isAuthenticated = await checkAuth();
  if (!isAuthenticated) {
    return { success: false, error: 'Yetkisiz işlem.' };
  }

  const name = (formData.get('name') as string || '').trim();
  const description = (formData.get('description') as string || '').trim();

  if (!name) {
    return { success: false, error: 'Kategori adı zorunludur.' };
  }

  try {
    const category = await db.category.update({
      where: { id },
      data: {
        name,
        description: description || null,
      },
    });

    revalidatePath('/');
    revalidatePath(`/kategori/${category.slug}`);
    revalidatePath('/haber/[slug]', 'page');

    return { success: true };
  } catch (e: any) {
    console.error('Error updating category: ', e);
    return { success: false, error: 'Kategori güncellenirken hata oluştu: ' + e.message };
  }
}

export async function deleteCategoryAction(id: string) {
  const isAuthenticated = await checkAuth();
  if (!isAuthenticated) {
    return { success: false, error: 'Yetkisiz işlem.' };
  }

  try {
    const articleCount = await db.article.count({
      where: { categoryId: id },
    });

    if (articleCount > 0) {
      return {
        success: false,
        error: `Bu kategori silinemez. Kategoriye ait ${articleCount} adet haber bulunmaktadır. Lütfen önce bu haberleri silin veya başka bir kategoriye taşıyın.`,
      };
    }

    await db.category.delete({
      where: { id },
    });

    revalidatePath('/');
    revalidatePath('/haber/[slug]', 'page');
    revalidatePath('/kategori/[slug]', 'page');
    revalidatePath('/sitemap.xml');

    return { success: true };
  } catch (e: any) {
    console.error('Error deleting category: ', e);
    return { success: false, error: 'Kategori silinirken hata oluştu: ' + e.message };
  }
}
