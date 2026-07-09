import { db } from '@/lib/db';
import HeroSection from '@/components/HeroSection';
import LoadMoreFeed from '@/components/LoadMoreFeed';
import Sidebar from '@/components/Sidebar';
import AdSkeleton from '@/components/AdSkeleton';
import NearbyStations from '@/components/NearbyStations';
import { getStationStats } from '@/app/actions/stations';

export const revalidate = 60; // ISR cache regeneration time

export default async function HomePage() {
  // Fetch the most recently published article as hero
  let featuredArticle = null;
  try {
    featuredArticle = await db.article.findFirst({
      include: { category: true },
      orderBy: { publishedAt: 'desc' },
    });
  } catch (e) {
    console.error('Home Page: Error fetching featured article', e);
  }

  // Fetch popular articles by view count (3 items)
  let popularArticles: any[] = [];
  try {
    popularArticles = await db.article.findMany({
      where: featuredArticle ? { id: { not: featuredArticle.id } } : {},
      include: { category: true },
      orderBy: { viewCount: 'desc' },
      take: 3,
    });
  } catch (e) {
    console.error('Home Page: Error fetching popular articles', e);
  }

  const excludeIds: string[] = [];
  if (featuredArticle) excludeIds.push(featuredArticle.id);
  popularArticles.forEach((a) => excludeIds.push(a.id));

  // Fetch chronological feed (up to 5 items)
  let feedArticles: any[] = [];
  try {
    feedArticles = await db.article.findMany({
      where: excludeIds.length > 0 ? { id: { notIn: excludeIds } } : {},
      include: { category: true },
      orderBy: { publishedAt: 'desc' },
      take: 5,
    });
  } catch (e) {
    console.error('Home Page: Error fetching feed articles', e);
  }

  // Fetch most read articles for Sidebar (5 items)
  let mostReadArticles: any[] = [];
  try {
    mostReadArticles = await db.article.findMany({
      include: { category: true },
      orderBy: { viewCount: 'desc' },
      take: 5,
    });
  } catch (e) {
    console.error('Home Page: Error fetching most read articles', e);
  }

  // Fetch ad placements
  let adPlacements: any[] = [];
  try {
    adPlacements = await db.adPlacement.findMany();
  } catch (e) {
    console.error('Home Page: Error fetching ad placements', e);
  }

  const headerAd = adPlacements.find((p) => p.slotCode === 'header_banner') || null;
  const sidebarAd = adPlacements.find((p) => p.slotCode === 'sidebar_top') || null;

  // Fetch station stats for the charging widget
  const stationStats = await getStationStats();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
      {/* Header Banner Ad Placement */}
      <div className="flex justify-center mb-6">
        <AdSkeleton slotCode="header_banner" placement={headerAd} />
      </div>

      {/* Hero Section */}
      <HeroSection featured={featuredArticle} popular={popularArticles} />

      {/* Nearby Charging Stations Widget */}
      <NearbyStations stats={stationStats} />

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-10">
        {/* Left Column: Article Feed */}
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-xl font-extrabold text-gray-900 pb-3 border-b border-gray-100 flex items-center">
            En Son Paylaşılanlar
          </h3>
          <LoadMoreFeed
            initialArticles={feedArticles}
            excludeIds={excludeIds}
            limit={5}
          />
        </div>

        {/* Right Column: Sidebar */}
        <div>
          <Sidebar mostRead={mostReadArticles} adPlacement={sidebarAd} />
        </div>
      </div>
    </div>
  );
}
