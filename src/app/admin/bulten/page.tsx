import { db } from '@/lib/db';
import { deleteSubscriberAction } from '@/app/actions/admin';
import { Mail, Trash2, Calendar, AlertCircle, Search, UserCheck, Newspaper, TrendingUp, Eye } from 'lucide-react';

export const dynamic = 'force-dynamic';

interface PageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function AdminNewsletterPage({ searchParams }: PageProps) {
  const { q = '' } = await searchParams;

  let subscribers: any[] = [];
  try {
    subscribers = await db.newsletterSubscriber.findMany({
      where: q.trim() ? {
        email: {
          contains: q.trim().toLowerCase(),
        },
      } : {},
      orderBy: { createdAt: 'desc' },
    });
  } catch (e) {
    console.error('Error fetching subscribers in admin: ', e);
  }

  // Fetch top 5 most-read articles from the last 7 days for weekly digest
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  let topArticles: any[] = [];
  try {
    topArticles = await db.article.findMany({
      where: {
        publishedAt: { gte: sevenDaysAgo },
      },
      include: { category: true },
      orderBy: { viewCount: 'desc' },
      take: 5,
    });
  } catch (e) {
    console.error('Error fetching top articles for digest: ', e);
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight flex items-center">
            <Mail className="h-6 w-6 text-emerald-600 mr-2" />
            E-Bülten Abone Listesi
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Siteniz üzerinden e-bültene kayıt olan okuyucuların listesi.
          </p>
        </div>
        <div className="flex items-center space-x-2 bg-emerald-50 text-emerald-800 border border-emerald-100 px-4 py-2 rounded-2xl shrink-0 self-start sm:self-auto shadow-sm">
          <UserCheck className="h-5 w-5 text-emerald-600 mr-1.5" />
          <div>
            <div className="text-[10px] uppercase font-bold tracking-wider text-emerald-700">Toplam Abone</div>
            <div className="text-lg font-extrabold leading-none mt-0.5">{subscribers.length}</div>
          </div>
        </div>
      </div>

      <form method="GET" className="flex max-w-md gap-2">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <input
            name="q"
            type="text"
            defaultValue={q}
            placeholder="E-posta adresi ara..."
            className="block w-full border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
          />
        </div>
        <button
          type="submit"
          className="bg-gray-900 hover:bg-gray-800 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition-colors cursor-pointer shadow-sm"
        >
          Ara
        </button>
      </form>

      {subscribers.length > 0 ? (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-left text-sm text-gray-800 font-medium">
              <thead className="bg-gray-50 text-xs uppercase font-extrabold tracking-wider text-gray-500">
                <tr>
                  <th scope="col" className="px-6 py-3.5">E-Posta Adresi</th>
                  <th scope="col" className="px-6 py-3.5">Kayıt Tarihi</th>
                  <th scope="col" className="px-6 py-3.5">Durum</th>
                  <th scope="col" className="px-6 py-3.5 text-right">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {subscribers.map((subscriber) => (
                  <tr key={subscriber.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="whitespace-nowrap px-6 py-4 font-bold text-gray-900">
                      {subscriber.email}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-gray-500">
                      <div className="flex items-center text-xs mt-0.5">
                        <Calendar className="h-4 w-4 mr-1.5 text-gray-400" />
                        {formatDate(subscriber.createdAt)}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      {subscriber.isActive ? (
                        <span className="inline-flex bg-emerald-50 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-100">
                          Aktif
                        </span>
                      ) : (
                        <span className="inline-flex bg-red-50 text-red-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-red-100">
                          Pasif
                        </span>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right">
                      <form
                        action={async () => {
                          "use server";
                          await deleteSubscriberAction(subscriber.id);
                        }}
                      >
                        <button
                          type="submit"
                          className="bg-white hover:bg-red-50 text-red-600 hover:text-red-700 font-bold px-2.5 py-1 rounded-lg text-xs flex items-center border border-gray-200 hover:border-red-100 transition-colors cursor-pointer ml-auto"
                        >
                          <Trash2 className="h-3 w-3 mr-1" />
                          Sil
                        </button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-gray-50 border border-gray-150 rounded-2xl p-8 flex flex-col items-center justify-center text-center space-y-2 text-gray-500">
          <AlertCircle className="h-8 w-8 text-gray-400" />
          <p className="font-semibold text-sm">Abone bulunamadı.</p>
          {q && <p className="text-xs text-gray-400">"{q}" arama kriterine uygun bir sonuç yok.</p>}
        </div>
      )}

      {/* Weekly Digest Builder */}
      <div className="border-t border-gray-100 pt-8 space-y-5">
        <h2 className="text-xl font-extrabold text-gray-900 flex items-center">
          <Newspaper className="h-5 w-5 text-emerald-600 mr-2" />
          Haftalık Bülten Önizlemesi
        </h2>
        <p className="text-sm text-gray-500">
          Son 7 günde en çok okunan haberlerin önizlemesi. Bu içerikler haftalık e-bülten olarak abonelere gönderilebilir.
        </p>

        {topArticles.length > 0 ? (
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-700 to-emerald-900 p-6 text-white">
              <div className="flex items-center space-x-3">
                <div className="bg-white/10 p-2 rounded-xl">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-lg">enerjic.com Haftalık Özet</h3>
                  <p className="text-emerald-200 text-xs mt-0.5">Bu haftanın en çok okunan haberleri</p>
                </div>
              </div>
            </div>
            <div className="divide-y divide-gray-100">
              {topArticles.map((article, idx) => (
                <div key={article.id} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50/50 transition-colors">
                  <span className="text-2xl font-extrabold text-gray-200 w-8 text-center shrink-0">
                    {idx + 1}
                  </span>
                  {article.imageUrl && (
                    <div className="w-16 h-12 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                      <img src={article.imageUrl} alt="" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="flex-grow min-w-0">
                    <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider">{article.category.name}</p>
                    <h4 className="text-sm font-extrabold text-gray-900 truncate">{article.title}</h4>
                  </div>
                  <div className="flex items-center text-xs text-gray-400 shrink-0">
                    <Eye className="h-3.5 w-3.5 mr-1" />
                    {article.viewCount}
                  </div>
                </div>
              ))}
            </div>
            <div className="p-5 bg-gray-50 border-t border-gray-100">
              <p className="text-xs text-gray-500 text-center">
                Bu önizleme <span className="font-bold">{subscribers.length}</span> aboneye gönderilebilir.
                Resend veya SendGrid API entegrasyonuyla otomatik gönderim aktif edilebilir.
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-gray-50 border border-gray-150 rounded-2xl p-8 text-center text-gray-500 text-sm italic">
            Son 7 günde yeterli haber verisi bulunamadı.
          </div>
        )}
      </div>
    </div>
  );
}
