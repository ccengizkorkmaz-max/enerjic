import Link from 'next/link';

interface Category {
  name: string;
  slug: string;
}

interface Article {
  id: string;
  title: string;
  slug: string;
  summary: string;
  imageUrl: string | null;
  publishedAt: Date;
  category: Category;
}

interface ArticleFeedProps {
  articles: Article[];
}

export default function ArticleFeed({ articles }: ArticleFeedProps) {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      {articles.length > 0 ? (
        articles.map((article) => (
          <article
            key={article.id}
            className="flex flex-col sm:flex-row gap-6 p-4 sm:p-5 rounded-2xl border border-gray-100 bg-white hover:border-emerald-100 hover:shadow-[0_8px_30px_rgb(16,185,129,0.03)] transition-all duration-300 group"
          >
            {/* Image */}
            <div className="sm:w-1/3 shrink-0">
              <Link href={`/haber/${article.slug}`}>
                <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden bg-gray-50 border border-gray-100">
                  {article.imageUrl ? (
                    <img
                      src={article.imageUrl}
                      alt={article.title}
                      className="object-cover w-full h-full group-hover:scale-[1.01] transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-emerald-50/30 flex items-center justify-center">
                      <span className="text-emerald-700 text-xs font-semibold">Görsel Yok</span>
                    </div>
                  )}
                </div>
              </Link>
            </div>

            {/* Info */}
            <div className="flex flex-col justify-between flex-grow space-y-3">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Link
                    href={`/kategori/${article.category.slug}`}
                    className="text-xs font-bold uppercase tracking-wider text-emerald-700 hover:text-emerald-800 transition-colors"
                  >
                    {article.category.name}
                  </Link>
                  <span className="text-gray-300 text-xs">&bull;</span>
                  <span className="text-xs text-gray-400 font-medium">
                    {formatDate(article.publishedAt)}
                  </span>
                </div>

                <Link href={`/haber/${article.slug}`}>
                  <h3 className="text-lg sm:text-xl font-extrabold text-gray-900 group-hover:text-emerald-700 transition-colors duration-200 leading-snug">
                    {article.title}
                  </h3>
                </Link>

                <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                  {article.summary}
                </p>
              </div>

              <div>
                <Link
                  href={`/haber/${article.slug}`}
                  className="inline-flex items-center text-xs font-bold text-emerald-700 hover:text-emerald-800 tracking-wide uppercase transition-colors"
                >
                  Detayları Gör
                  <svg
                    className="ml-1.5 w-3.5 h-3.5 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          </article>
        ))
      ) : (
        <div className="text-center py-12 bg-gray-50 border border-dashed border-gray-200 rounded-2xl">
          <p className="text-gray-400 text-sm">Gösterilecek haber bulunamadı.</p>
        </div>
      )}
    </div>
  );
}
