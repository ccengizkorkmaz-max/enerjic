import Link from 'next/link';
import { db } from '@/lib/db';
import { Flame, Sparkles, Leaf, Zap, Cpu, Rocket } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  slug: string;
}

const CATEGORY_ICONS: Record<string, any> = {
  'elektrikli-araclar': Zap,
  'temiz-enerji': Leaf,
  'girisimcilik-saas': Rocket,
  'trend-teknolojiler': Cpu,
};

export default async function NewsCategoryBar({ activeSlug }: { activeSlug?: string }) {
  let categories: Category[] = [];
  try {
    categories = await db.category.findMany({
      orderBy: { name: 'asc' },
    });
  } catch (e) {
    console.error('Error fetching categories for NewsCategoryBar:', e);
  }

  const fallbackCategories = [
    { id: '1', name: 'Elektrikli Araçlar', slug: 'elektrikli-araclar' },
    { id: '2', name: 'Temiz Enerji', slug: 'temiz-enerji' },
    { id: '3', name: 'Girişimcilik & SaaS', slug: 'girisimcilik-saas' },
    { id: '4', name: 'Trend Teknolojiler', slug: 'trend-teknolojiler' },
  ];

  const list = categories.length > 0 ? categories : fallbackCategories;

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between gap-4 overflow-x-auto pb-2 scrollbar-none">
        <div className="flex items-center space-x-2 shrink-0">
          <span className="flex items-center space-x-1 text-xs font-black uppercase tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-100 px-3 py-2 rounded-xl mr-1">
            <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500 animate-pulse" />
            <span>Kategoriler:</span>
          </span>

          <Link
            href="/"
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 flex items-center space-x-1.5 shrink-0 border cursor-pointer ${
              !activeSlug
                ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white border-emerald-600 shadow-sm shadow-emerald-500/20'
                : 'bg-white text-gray-700 border-gray-200 hover:border-emerald-300 hover:bg-emerald-50/50'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Tüm Haberler</span>
          </Link>

          {list.map((cat) => {
            const Icon = CATEGORY_ICONS[cat.slug] || Leaf;
            const isActive = activeSlug === cat.slug;

            return (
              <Link
                key={cat.id}
                href={`/kategori/${cat.slug}`}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 flex items-center space-x-1.5 shrink-0 border cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white border-emerald-600 shadow-sm shadow-emerald-500/20'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-emerald-400 hover:text-emerald-800 hover:bg-emerald-50/60 shadow-xs'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-emerald-600'}`} />
                <span>{cat.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
