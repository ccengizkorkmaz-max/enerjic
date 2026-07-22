import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';
import { getSEOMetadata } from '@/lib/seo';
import Sidebar from '@/components/Sidebar';
import InArticleAd from '@/components/InArticleAd';
import AdSkeleton from '@/components/AdSkeleton';
import CommentSection from '@/components/CommentSection';
import ShareButtons from '@/components/ShareButtons';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const article = await db.article.findUnique({
      where: { slug },
    });

    if (!article) return {};

    return getSEOMetadata({
      title: article.title,
      description: article.summary,
      slug: `haber/${article.slug}`,
      type: 'article',
      imageUrl: article.imageUrl || undefined,
      publishedTime: article.publishedAt.toISOString(),
    });
  } catch (e) {
    console.error('Metadata generation error: ', e);
    return {};
  }
}

export default async function ArticleDetailPage({ params }: PageProps) {
  const { slug } = await params;

  let article = null;
  try {
    article = await db.article.findUnique({
      where: { slug },
      include: { category: true },
    });
  } catch (e) {
    console.error('Fetch article error: ', e);
  }

  if (!article) {
    notFound();
  }

  // Increment view count asynchronously
  try {
    await db.article.update({
      where: { id: article.id },
      data: { viewCount: { increment: 1 } },
    });
  } catch (e) {
    console.error('Increment view count error: ', e);
  }

  // Fetch trend articles for Sidebar
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
    console.error('Article Detail: Error fetching ad placements', e);
  }

  const headerAd = adPlacements.find((p) => p.slotCode === 'header_banner') || null;
  const sidebarAd = adPlacements.find((p) => p.slotCode === 'sidebar_top') || null;
  const inArticleAd = adPlacements.find((p) => p.slotCode === 'in_article_p3') || null;

  // Fetch approved comments
  let approvedComments: any[] = [];
  try {
    approvedComments = await db.comment.findMany({
      where: { articleId: article.id, isApproved: true },
      orderBy: { createdAt: 'asc' },
    });
  } catch (e) {
    console.error('Article Detail: Error fetching comments', e);
  }

  // Fetch related articles (same category, exclude current)
  let relatedArticles: any[] = [];
  try {
    relatedArticles = await db.article.findMany({
      where: {
        categoryId: article.categoryId,
        id: { not: article.id },
      },
      include: { category: true },
      orderBy: { publishedAt: 'desc' },
      take: 3,
    });
  } catch (e) {
    console.error('Article Detail: Error fetching related articles', e);
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
      {/* Header Banner Ad Placement */}
      <div className="flex justify-center mb-6">
        <AdSkeleton slotCode="header_banner" placement={headerAd} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-4">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="space-y-4">
            <nav className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-emerald-700">
              <a href={`/kategori/${article.category.slug}`} className="hover:underline">
                {article.category.name}
              </a>
              <span className="text-gray-300 font-normal">&bull;</span>
              <span className="text-gray-400 font-medium">{formatDate(article.publishedAt)}</span>
            </nav>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight">
              {article.title}
            </h1>

            <p className="text-lg text-gray-500 leading-relaxed font-medium italic border-l-4 border-emerald-600 pl-4 py-1">
              {article.summary}
            </p>
          </div>

          <ShareButtons title={article.title} />

          {/* Image */}
          {article.imageUrl && (
            <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-slate-950 border border-gray-100 flex items-center justify-center group shadow-sm">
              <img
                src={article.imageUrl}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 w-full h-full object-cover filter blur-xl opacity-45 scale-110 select-none pointer-events-none"
              />
              <img
                src={article.imageUrl}
                alt={article.title}
                className="relative z-10 max-h-full max-w-full object-contain rounded-2xl transition-transform duration-500 group-hover:scale-[1.01]"
              />
            </div>
          )}

          {/* Dynamic Article Content with Paragraph 3 Ad Injector */}
          <InArticleAd content={article.content} adPlacement={inArticleAd} />

          {/* Related Articles ("İlginizi Çekebilir") */}
          {relatedArticles.length > 0 && (
            <div className="border-t border-gray-100 pt-8 mt-10 space-y-5">
              <h3 className="text-lg font-bold text-gray-900 tracking-tight">
                İlginizi Çekebilir
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {relatedArticles.map((rel) => (
                  <Link href={`/haber/${rel.slug}`} key={rel.id} className="group block space-y-2">
                    <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden bg-gray-50 border border-gray-100">
                      {rel.imageUrl ? (
                        <img
                          src={rel.imageUrl}
                          alt={rel.title}
                          className="object-cover w-full h-full group-hover:scale-[1.02] transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full bg-emerald-50/20 flex items-center justify-center">
                          <span className="text-emerald-700 text-[10px] font-bold">Görsel Yok</span>
                        </div>
                      )}
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-[9px] font-bold text-emerald-700 uppercase tracking-wider">
                        {rel.category.name}
                      </span>
                      <h4 className="text-xs font-bold text-gray-800 group-hover:text-emerald-700 transition-colors leading-snug line-clamp-2">
                        {rel.title}
                      </h4>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Comments Section */}
          <CommentSection articleId={article.id} comments={approvedComments} />
        </div>

        {/* Sidebar */}
        <div>
          <Sidebar mostRead={mostReadArticles} adPlacement={sidebarAd} />
        </div>
      </div>
    </div>
  );
}
