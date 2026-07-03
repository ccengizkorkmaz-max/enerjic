import { Metadata } from 'next';
import { db } from '@/lib/db';
import { getSEOMetadata } from '@/lib/seo';
import Sidebar from '@/components/Sidebar';
import LoadMoreFeed from '@/components/LoadMoreFeed';
import AdSkeleton from '@/components/AdSkeleton';

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  const { q } = await searchParams;
  const queryText = q || '';
  return getSEOMetadata({
    title: queryText ? `"${queryText}" Arama Sonuçları` : 'Arama Yap',
    description: queryText
      ? `enerjic.com üzerinde "${queryText}" aramasına ait en son haberler ve sürdürülebilir teknoloji içerikleri.`
      : 'enerjic.com arama sayfası ile elektrikli araçlar ve temiz enerji haberlerinde arama yapın.',
    slug: queryText ? `arama?q=${encodeURIComponent(queryText)}` : 'arama',
  });
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;
  const queryText = q || '';

  let totalCount = 0;
  let articles: any[] = [];
  try {
    if (queryText.trim()) {
      const searchWhere = {
        OR: [
          { title: { contains: queryText } },
          { summary: { contains: queryText } },
          { content: { contains: queryText } },
        ],
      };

      totalCount = await db.article.count({ where: searchWhere });

      articles = await db.article.findMany({
        where: searchWhere,
        include: { category: true },
        orderBy: { publishedAt: 'desc' },
        take: 5,
      });
    }
  } catch (e) {
    console.error('Fetch search articles error: ', e);
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
    console.error('Search Page: Error fetching ad placements', e);
  }

  const headerAd = adPlacements.find((p) => p.slotCode === 'header_banner') || null;
  const sidebarAd = adPlacements.find((p) => p.slotCode === 'sidebar_top') || null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
      {/* Header Banner Ad Placement */}
      <div className="flex justify-center mb-6">
        <AdSkeleton slotCode="header_banner" placement={headerAd} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-4">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="border-b border-gray-150 pb-4 mb-6">
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Arama <span className="text-emerald-700">Sonuçları</span>
            </h1>
            {queryText ? (
              <p className="text-gray-500 mt-2 text-base">
                <span className="font-bold text-gray-800">"{queryText}"</span> kelimesi için {totalCount} sonuç bulundu.
              </p>
            ) : (
              <p className="text-gray-500 mt-2 text-base">
                Lütfen aramak istediğiniz anahtar kelimeleri sağ üstteki arama alanına yazarak arama yapın.
              </p>
            )}
          </div>

          {queryText.trim() && (
            <LoadMoreFeed
              initialArticles={articles}
              searchQuery={queryText}
              limit={5}
            />
          )}
        </div>

        {/* Sidebar */}
        <div>
          <Sidebar mostRead={mostReadArticles} adPlacement={sidebarAd} />
        </div>
      </div>
    </div>
  );
}
