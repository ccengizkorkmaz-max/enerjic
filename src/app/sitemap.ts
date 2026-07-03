import { MetadataRoute } from 'next';
import { db } from '@/lib/db';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://enerjic.com';

  let articles: Array<{ slug: string; updatedAt: Date }> = [];
  try {
    articles = await db.article.findMany({
      select: {
        slug: true,
        updatedAt: true,
      },
      orderBy: {
        publishedAt: 'desc',
      },
    });
  } catch (e) {
    console.error('Sitemap DB articles fetch error: ', e);
  }

  let categories: Array<{ slug: string; updatedAt: Date }> = [];
  try {
    categories = await db.category.findMany({
      select: {
        slug: true,
        updatedAt: true,
      },
    });
  } catch (e) {
    console.error('Sitemap DB categories fetch error: ', e);
  }

  const staticRoutes = [
    '',
    '/hakkimizda',
    '/iletisim',
    '/gizlilik-politikasi',
    '/kullanim-sartlari',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1.0 : 0.5,
  }));

  const categoryRoutes = categories.map((cat) => ({
    url: `${baseUrl}/kategori/${cat.slug}`,
    lastModified: cat.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const articleRoutes = articles.map((art) => ({
    url: `${baseUrl}/haber/${art.slug}`,
    lastModified: art.updatedAt,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...categoryRoutes, ...articleRoutes];
}
