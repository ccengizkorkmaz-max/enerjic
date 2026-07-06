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

  // Fetch EV brands for software update pages
  let softwareUpdateBrands: string[] = [];
  try {
    const updates = await db.softwareUpdate.findMany({
      select: { brand: true },
      distinct: ['brand'],
    });
    softwareUpdateBrands = updates.map(u => u.brand.toLowerCase());
  } catch (e) {
    console.error('Sitemap SW updates fetch error: ', e);
  }

  // Static pages
  const staticRoutes = [
    { route: '', priority: 1.0, freq: 'daily' as const },
    { route: '/elektrikli-araclar', priority: 0.9, freq: 'daily' as const },
    { route: '/yazilim-guncellemeleri', priority: 0.8, freq: 'daily' as const },
    { route: '/sarj-rehberi', priority: 0.8, freq: 'weekly' as const },
    { route: '/tasarruf-hesaplayici', priority: 0.7, freq: 'monthly' as const },
    { route: '/elektrikli-araclar/liderlik-tablolari', priority: 0.7, freq: 'weekly' as const },
    { route: '/elektrikli-araclar/oneri', priority: 0.7, freq: 'monthly' as const },
    { route: '/hakkimizda', priority: 0.5, freq: 'monthly' as const },
    { route: '/iletisim', priority: 0.5, freq: 'monthly' as const },
    { route: '/gizlilik-politikasi', priority: 0.3, freq: 'yearly' as const },
    { route: '/kullanim-sartlari', priority: 0.3, freq: 'yearly' as const },
  ].map((item) => ({
    url: `${baseUrl}${item.route}`,
    lastModified: new Date(),
    changeFrequency: item.freq,
    priority: item.priority,
  }));

  // Category pages
  const categoryRoutes = categories.map((cat) => ({
    url: `${baseUrl}/kategori/${cat.slug}`,
    lastModified: cat.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // Article pages
  const articleRoutes = articles.map((art) => ({
    url: `${baseUrl}/haber/${art.slug}`,
    lastModified: art.updatedAt,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // Software update brand pages
  const swUpdateRoutes = softwareUpdateBrands.map((brand) => ({
    url: `${baseUrl}/yazilim-guncellemeleri/${brand}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...categoryRoutes, ...articleRoutes, ...swUpdateRoutes];
}
