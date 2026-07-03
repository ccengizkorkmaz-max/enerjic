import { db } from '@/lib/db';
import { approveCommentAction, deleteCommentAction } from '@/app/actions/admin';
import { Check, Trash2, MessageSquare, AlertCircle, Calendar, User, FileText } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AdminCommentsPage() {
  let pendingComments: any[] = [];
  let approvedComments: any[] = [];

  try {
    pendingComments = await db.comment.findMany({
      where: { isApproved: false },
      include: { article: true },
      orderBy: { createdAt: 'desc' },
    });

    approvedComments = await db.comment.findMany({
      where: { isApproved: true },
      include: { article: true },
      orderBy: { createdAt: 'desc' },
    });
  } catch (e) {
    console.error('Error fetching comments in admin: ', e);
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
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight flex items-center">
          <MessageSquare className="h-6 w-6 text-emerald-600 mr-2" />
          Yorum Moderasyon Paneli
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Sitenizde paylaşılan tüm okuyucu yorumlarını buradan denetleyebilir, onaylayabilir veya silebilirsiniz.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-bold text-gray-955 flex items-center">
          Onay Bekleyenler
          <span className="ml-2.5 bg-amber-100 text-amber-800 text-xs font-extrabold px-2.5 py-0.5 rounded-full">
            {pendingComments.length}
          </span>
        </h2>

        {pendingComments.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {pendingComments.map((comment) => (
              <div
                key={comment.id}
                className="bg-white border border-amber-100 shadow-sm rounded-2xl p-5 space-y-4 hover:border-amber-200 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-gray-400 font-medium">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="flex items-center text-gray-700 font-extrabold">
                      <User className="h-3.5 w-3.5 text-gray-400 mr-1 shrink-0" />
                      {comment.authorName}
                      {comment.authorEmail && (
                        <span className="font-normal text-gray-400 ml-1">({comment.authorEmail})</span>
                      )}
                    </span>
                    <span className="flex items-center">
                      <Calendar className="h-3.5 w-3.5 text-gray-300 mr-1 shrink-0" />
                      {formatDate(comment.createdAt)}
                    </span>
                  </div>
                  <div className="flex items-center text-emerald-700 font-semibold">
                    <FileText className="h-3.5 w-3.5 text-emerald-605 mr-1 shrink-0" />
                    Haber: 
                    <Link
                      href={`/haber/${comment.article.slug}`}
                      target="_blank"
                      className="hover:underline ml-1 text-gray-900 font-bold truncate max-w-[200px] sm:max-w-[300px]"
                    >
                      {comment.article.title}
                    </Link>
                  </div>
                </div>

                <p className="text-sm text-gray-800 bg-gray-50/60 p-4 rounded-xl leading-relaxed whitespace-pre-line border border-gray-100 font-medium">
                  {comment.content}
                </p>

                <div className="flex items-center justify-end space-x-3 pt-1">
                  <form
                    action={async () => {
                      "use server";
                      await deleteCommentAction(comment.id);
                    }}
                  >
                    <button
                      type="submit"
                      className="bg-red-50 hover:bg-red-100 text-red-700 font-bold px-3 py-1.5 rounded-lg text-xs flex items-center transition-colors cursor-pointer border border-red-100"
                    >
                      <Trash2 className="h-3.5 w-3.5 mr-1" />
                      Yorumu Sil
                    </button>
                  </form>

                  <form
                    action={async () => {
                      "use server";
                      await approveCommentAction(comment.id);
                    }}
                  >
                    <button
                      type="submit"
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-1.5 rounded-lg text-xs flex items-center transition-colors cursor-pointer shadow-sm"
                    >
                      <Check className="h-3.5 w-3.5 mr-1" />
                      Yorumu Onayla
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6 flex items-center space-x-3 text-emerald-800">
            <Check className="h-6 w-6 text-emerald-600 shrink-0" />
            <div>
              <p className="font-extrabold text-sm">Harika! Onay bekleyen yorum bulunmuyor.</p>
              <p className="text-xs mt-0.5 opacity-90">Tüm okuyucu yorumları denetlendi ve güncel.</p>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-bold text-gray-955 flex items-center">
          Onaylanmış Yorumlar
          <span className="ml-2.5 bg-gray-100 text-gray-700 text-xs font-extrabold px-2.5 py-0.5 rounded-full">
            {approvedComments.length}
          </span>
        </h2>

        {approvedComments.length > 0 ? (
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-left text-sm text-gray-800">
                <thead className="bg-gray-50 text-xs uppercase font-extrabold tracking-wider text-gray-500">
                  <tr>
                    <th scope="col" className="px-6 py-3.5">Yazar</th>
                    <th scope="col" className="px-6 py-3.5">Yorum İçeriği</th>
                    <th scope="col" className="px-6 py-3.5">İlişkili Haber</th>
                    <th scope="col" className="px-6 py-3.5 text-right">İşlemler</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {approvedComments.map((comment) => (
                    <tr key={comment.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="font-bold text-gray-900">{comment.authorName}</div>
                        {comment.authorEmail && (
                          <div className="text-xs text-gray-400 font-mono mt-0.5">{comment.authorEmail}</div>
                        )}
                        <div className="text-[10px] text-gray-400 mt-1 flex items-center font-medium">
                          <Calendar className="h-3 w-3 mr-0.5" />
                          {formatDate(comment.createdAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="line-clamp-2 text-xs text-gray-600 max-w-sm" title={comment.content}>
                          {comment.content}
                        </p>
                      </td>
                      <td className="px-6 py-4 max-w-xs">
                        <Link
                          href={`/haber/${comment.article.slug}`}
                          target="_blank"
                          className="font-semibold text-xs text-emerald-800 hover:underline line-clamp-1"
                        >
                          {comment.article.title}
                        </Link>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-right">
                        <form
                          action={async () => {
                            "use server";
                            await deleteCommentAction(comment.id);
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
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 flex items-center space-x-3 text-gray-500 italic">
            <AlertCircle className="h-5 w-5 shrink-0 text-gray-400" />
            <span className="text-sm">Henüz onaylanmış bir yorum bulunmuyor.</span>
          </div>
        )}
      </div>
    </div>
  );
}
