import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { db } from '@/lib/db';
import { getSEOMetadata } from '@/lib/seo';
import Sidebar from '@/components/Sidebar';
import LoadMoreFeed from '@/components/LoadMoreFeed';
import NewsCategoryBar from '@/components/NewsCategoryBar';
import AdSkeleton from '@/components/AdSkeleton';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const category = await db.category.findUnique({
      where: { slug },
    });

    if (!category) return {};

    return getSEOMetadata({
      title: `${category.name} Haberleri`,
      description: category.description || `${category.name} kategorisindeki en son haberler, analizler ve güncel gelişmeler.`,
      slug: `kategori/${category.slug}`,
    });
  } catch (e) {
    console.error('Metadata generation error: ', e);
    return {};
  }
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;

  let category = null;
  try {
    category = await db.category.findUnique({
      where: { slug },
    });
  } catch (e) {
    console.error('Fetch category error: ', e);
  }

  if (!category) {
    notFound();
  }

  let articles: any[] = [];
  try {
    articles = await db.article.findMany({
      where: { categoryId: category.id },
      include: { category: true },
      orderBy: { publishedAt: 'desc' },
      take: 5,
    });
  } catch (e) {
    console.error('Fetch category articles error: ', e);
  }

  let mostReadArticles: any[] = [];
  try {
    mostReadArticles = await db.article.findMany({
      include: { category: true },
      orderBy: { viewCount: 'desc' },
      take: 5,
    });
  } catch (e) {
    console.error('Sidebar fetch error: ', e);
  }

  // Fetch ad placements
  let adPlacements: any[] = [];
  try {
    adPlacements = await db.adPlacement.findMany();
  } catch (e) {
    console.error('Category Page: Error fetching ad placements', e);
  }

  const headerAd = adPlacements.find((p) => p.slotCode === 'header_banner') || null;
  const sidebarAd = adPlacements.find((p) => p.slotCode === 'sidebar_top') || null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
      {/* Header Banner Ad Placement */}
      <div className="flex justify-center mb-6">
        <AdSkeleton slotCode="header_banner" placement={headerAd} />
      </div>

      {/* Button-style News Categories Bar */}
      <NewsCategoryBar activeSlug={slug} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-4">
        {/* Main Feed Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="border-b border-gray-150 pb-4 mb-6">
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              {category.name} <span className="text-emerald-700">Haberleri</span>
            </h1>
            {category.description && (
              <p className="text-gray-500 mt-2 text-base leading-relaxed">
                {category.description}
              </p>
            )}
          </div>

          <LoadMoreFeed
            initialArticles={articles}
            categoryId={category.id}
            limit={5}
          />
        </div>

        {/* Sidebar Column */}
        <div>
          <Sidebar mostRead={mostReadArticles} adPlacement={sidebarAd} />
        </div>
      </div>
    </div>
  );
}
