import Link from 'next/link';
import { db } from '@/lib/db';
import DeleteArticleButton from '@/components/DeleteArticleButton';
import { FileText, Eye, Star, Edit } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  let articles: any[] = [];
  try {
    articles = await db.article.findMany({
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    });
  } catch (e) {
    console.error('Error fetching admin articles: ', e);
  }

  const totalArticles = articles.length;
  
  let totalViews = 0;
  try {
    const totalViewsResult = await db.article.aggregate({
      _sum: {
        viewCount: true,
      },
    });
    totalViews = totalViewsResult._sum.viewCount || 0;
  } catch (e) {
    console.error('Error fetching view metrics: ', e);
  }

  const featuredCount = articles.filter(a => a.isFeatured).length;

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
            Yönetim Paneli
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            İçeriklerinizi, haberlerinizi ve portal istatistiklerini buradan yönetebilirsiniz.
          </p>
        </div>
        <Link
          href="/admin/haber-ekle"
          className="inline-flex items-center justify-center bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-4 py-2.5 rounded-xl text-sm transition-colors shadow-sm"
        >
          Yeni Haber Ekle
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="border border-gray-150 rounded-2xl p-5 bg-gray-50 flex items-center space-x-4">
          <div className="bg-emerald-100 text-emerald-700 p-3 rounded-xl">
            <FileText className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Toplam Haber</p>
            <h3 className="text-2xl font-black text-gray-900 mt-1">{totalArticles}</h3>
          </div>
        </div>

        <div className="border border-gray-150 rounded-2xl p-5 bg-gray-50 flex items-center space-x-4">
          <div className="bg-blue-100 text-blue-700 p-3 rounded-xl">
            <Eye className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Toplam Okunma</p>
            <h3 className="text-2xl font-black text-gray-900 mt-1">{totalViews}</h3>
          </div>
        </div>

        <div className="border border-gray-150 rounded-2xl p-5 bg-gray-50 flex items-center space-x-4">
          <div className="bg-amber-100 text-amber-700 p-3 rounded-xl">
            <Star className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Öne Çıkan</p>
            <h3 className="text-2xl font-black text-gray-900 mt-1">{featuredCount}</h3>
          </div>
        </div>
      </div>

      <div className="border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-extrabold uppercase text-gray-400 tracking-wider">Haber Başlığı</th>
                <th className="px-6 py-4 text-xs font-extrabold uppercase text-gray-400 tracking-wider">Kategori</th>
                <th className="px-6 py-4 text-xs font-extrabold uppercase text-gray-400 tracking-wider text-center">Okunma</th>
                <th className="px-6 py-4 text-xs font-extrabold uppercase text-gray-400 tracking-wider text-center">Durum</th>
                <th className="px-6 py-4 text-xs font-extrabold uppercase text-gray-400 tracking-wider text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {articles.length > 0 ? (
                articles.map((article) => (
                  <tr key={article.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900 line-clamp-1">{article.title}</div>
                      <div className="text-xs text-gray-400 mt-0.5 font-medium">/{article.slug}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex bg-emerald-50 text-emerald-800 text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wide">
                        {article.category.name}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center font-semibold text-gray-700 text-sm">
                      {article.viewCount}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {article.isFeatured ? (
                        <span className="inline-flex bg-amber-50 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded border border-amber-200">
                          Öne Çıkan
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400 font-medium">Normal</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="inline-flex items-center space-x-3">
                        <Link
                          href={`/admin/haber-duzenle/${article.id}`}
                          className="text-gray-400 hover:text-emerald-700 p-1 transition-colors"
                          title="Düzenle"
                        >
                          <Edit className="h-4.5 w-4.5" />
                        </Link>
                        <DeleteArticleButton id={article.id} title={article.title} />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-400 text-sm">
                    Henüz haber eklenmemiş. "Yeni Haber Ekle" butonuna basarak ilk haberinizi ekleyin.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
