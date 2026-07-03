import Link from 'next/link';
import AdSkeleton from './AdSkeleton';
import NewsletterForm from './NewsletterForm';

interface Category {
  name: string;
  slug: string;
}

interface Article {
  id: string;
  title: string;
  slug: string;
  category: Category;
}

interface SidebarProps {
  mostRead: Article[];
  adPlacement?: any;
}

export default function Sidebar({ mostRead, adPlacement }: SidebarProps) {
  return (
    <aside className="space-y-8">
      {/* CLS-safe Sidebar Ad Placement */}
      <div className="flex justify-center">
        <AdSkeleton slotCode="sidebar_top" placement={adPlacement} />
      </div>

      {/* En Çok Okunanlar List */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 border-b-2 border-emerald-700 pb-3 mb-5 tracking-tight flex items-center">
          <span className="bg-emerald-700 text-white text-xs px-2 py-0.5 rounded mr-2 uppercase font-mono">TREND</span>
          En Çok Okunanlar
        </h3>

        <div className="space-y-4">
          {mostRead.length > 0 ? (
            mostRead.map((article, index) => (
              <div key={article.id} className="flex items-start space-x-4 group py-1.5">
                <span className="text-3xl font-extrabold text-gray-200 group-hover:text-emerald-500 transition-colors w-8 shrink-0 text-right leading-none font-mono">
                  {index + 1}
                </span>
                <div className="space-y-1 flex-grow">
                  <Link
                    href={`/kategori/${article.category.slug}`}
                    className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 hover:text-emerald-800 transition-colors"
                  >
                    {article.category.name}
                  </Link>
                  <Link href={`/haber/${article.slug}`} className="block">
                    <h4 className="text-sm font-bold text-gray-800 group-hover:text-emerald-700 transition-colors leading-snug line-clamp-2">
                      {article.title}
                    </h4>
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-400 text-sm">İçerik bulunamadı.</p>
          )}
        </div>
      </div>

      {/* Newsletter Signup Form */}
      <NewsletterForm layout="sidebar" />
    </aside>
  );
}
