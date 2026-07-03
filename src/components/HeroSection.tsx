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

interface HeroSectionProps {
  featured: Article | null;
  popular: Article[];
}

export default function HeroSection({ featured, popular }: HeroSectionProps) {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 py-8 border-b border-gray-100">
      {/* Featured Article */}
      <div className="lg:col-span-2 flex flex-col group">
        {featured ? (
          <Link href={`/haber/${featured.slug}`} className="flex flex-col h-full space-y-4">
            <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-gray-50 border border-gray-100">
              {featured.imageUrl ? (
                <img
                  src={featured.imageUrl}
                  alt={featured.title}
                  className="object-cover w-full h-full group-hover:scale-[1.02] transition-transform duration-500 ease-out"
                />
              ) : (
                <div className="w-full h-full bg-emerald-50/50 flex items-center justify-center">
                  <span className="text-emerald-700 font-semibold">Görsel Bulunmuyor</span>
                </div>
              )}
              <span className="absolute top-4 left-4 bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg z-10 shadow-sm">
                {featured.category.name}
              </span>
            </div>
            <div className="space-y-3">
              <span className="text-xs font-semibold text-gray-400">
                {formatDate(featured.publishedAt)}
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 group-hover:text-emerald-700 transition-colors duration-300 leading-tight">
                {featured.title}
              </h2>
              <p className="text-gray-600 text-base sm:text-lg leading-relaxed line-clamp-3">
                {featured.summary}
              </p>
            </div>
          </Link>
        ) : (
          <div className="h-full flex items-center justify-center bg-gray-50 border border-dashed border-gray-200 rounded-2xl p-12">
            <p className="text-gray-400 text-sm">Öne çıkarılan haber bulunamadı.</p>
          </div>
        )}
      </div>

      {/* Popular Articles */}
      <div className="flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-900 border-b-2 border-emerald-700 pb-2 mb-4 tracking-tight flex items-center">
            <span className="bg-emerald-700 text-white text-xs px-2 py-0.5 rounded mr-2 uppercase">Popüler</span>
            Gündem
          </h3>

          <div className="space-y-5 divide-y divide-gray-100">
            {popular.length > 0 ? (
              popular.map((article, idx) => (
                <div key={article.id} className={`group ${idx > 0 ? 'pt-5' : ''}`}>
                  <Link href={`/haber/${article.slug}`} className="block space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                      {article.category.name}
                    </span>
                    <h4 className="text-base font-extrabold text-gray-900 group-hover:text-emerald-700 transition-colors duration-200 line-clamp-2 leading-snug">
                      {article.title}
                    </h4>
                    <p className="text-xs text-gray-500 line-clamp-2">
                      {article.summary}
                    </p>
                    <span className="inline-block text-[10px] text-gray-400">
                      {formatDate(article.publishedAt)}
                    </span>
                  </Link>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-sm pt-4">Gündem haberi bulunamadı.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
