import { db } from '@/lib/db';
import { createCategoryAction, updateCategoryAction, deleteCategoryAction } from '@/app/actions/admin';
import { Layers, PlusCircle, Pencil, Trash2, FileText, X } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

interface PageProps {
  searchParams: Promise<{ edit?: string }>;
}

export default async function AdminCategoriesPage({ searchParams }: PageProps) {
  const { edit = '' } = await searchParams;

  let categories: any[] = [];
  try {
    categories = await db.category.findMany({
      include: {
        _count: {
          select: { articles: true },
        },
      },
      orderBy: { name: 'asc' },
    });
  } catch (e) {
    console.error('Error fetching categories: ', e);
  }

  const editCategory = edit ? categories.find((c) => c.id === edit) : null;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight flex items-center">
          <Layers className="h-6 w-6 text-emerald-600 mr-2" />
          Kategori Yönetimi
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Haberlerinizin sınıflandırıldığı kategorileri ekleyin, düzenleyin veya kaldırın.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-150 rounded-2xl p-6 shadow-sm space-y-6 sticky top-6">
            <div className="flex items-center justify-between">
              <h2 className="text-md font-extrabold text-gray-950 flex items-center">
                {editCategory ? (
                  <>
                    <Pencil className="h-5 w-5 text-emerald-600 mr-2" />
                    Kategoriyi Düzenle
                  </>
                ) : (
                  <>
                    <PlusCircle className="h-5 w-5 text-emerald-600 mr-2" />
                    Yeni Kategori Ekle
                  </>
                )}
              </h2>
              {editCategory && (
                <Link
                  href="/admin/kategoriler"
                  className="text-gray-400 hover:text-gray-650 transition-colors"
                >
                  <X className="h-4 w-4" />
                </Link>
              )}
            </div>

            <form
              action={async (formData: FormData) => {
                "use server";
                if (editCategory) {
                  await updateCategoryAction(editCategory.id, formData);
                } else {
                  await createCategoryAction(formData);
                }
              }}
              className="space-y-4"
            >
              <div className="space-y-1">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide">Kategori Adı *</label>
                <input
                  name="name"
                  type="text"
                  required
                  placeholder="Örn: Rüzgar Enerjisi"
                  defaultValue={editCategory ? editCategory.name : ''}
                  className="block w-full border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide">Açıklama</label>
                <textarea
                  name="description"
                  rows={4}
                  placeholder="Kategori hakkında kısa açıklama..."
                  defaultValue={editCategory ? (editCategory.description || '') : ''}
                  className="block w-full border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                />
              </div>

              <div className="flex gap-3 pt-2">
                {editCategory && (
                  <Link
                    href="/admin/kategoriler"
                    className="w-1/2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-2.5 rounded-xl text-center text-sm transition-colors cursor-pointer"
                  >
                    İptal
                  </Link>
                )}
                <button
                  type="submit"
                  className={`${editCategory ? 'w-1/2' : 'w-full'} bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2.5 rounded-xl text-sm transition-colors cursor-pointer shadow-sm`}
                >
                  {editCategory ? 'Kaydet' : 'Kategori Ekle'}
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-md font-extrabold text-gray-950 font-sans">Mevcut Kategoriler ({categories.length})</h2>

          {categories.length > 0 ? (
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 text-left text-sm text-gray-800">
                  <thead className="bg-gray-50 text-xs uppercase font-extrabold tracking-wider text-gray-500">
                    <tr>
                      <th scope="col" className="px-6 py-3.5">Kategori Adı</th>
                      <th scope="col" className="px-6 py-3.5">Açıklama</th>
                      <th scope="col" className="px-6 py-3.5">Haber Sayısı</th>
                      <th scope="col" className="px-6 py-3.5 text-right">İşlemler</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 bg-white">
                    {categories.map((cat) => (
                      <tr key={cat.id} className={`hover:bg-gray-50/50 transition-colors ${editCategory?.id === cat.id ? 'bg-emerald-50/20' : ''}`}>
                        <td className="whitespace-nowrap px-6 py-4">
                          <div className="font-extrabold text-gray-900">{cat.name}</div>
                          <div className="text-xs text-gray-400 font-mono mt-0.5">/{cat.slug}</div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="line-clamp-2 text-xs text-gray-500 max-w-xs" title={cat.description || ''}>
                            {cat.description || '-'}
                          </p>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <span className="inline-flex items-center text-xs font-bold text-gray-700 bg-gray-100 px-2.5 py-0.5 rounded-full">
                            <FileText className="h-3.5 w-3.5 text-gray-400 mr-1" />
                            {cat._count.articles}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <Link
                              href={`/admin/kategoriler?edit=${cat.id}`}
                              className="bg-white hover:bg-gray-50 text-gray-700 font-bold px-2.5 py-1 rounded-lg text-xs flex items-center border border-gray-200 transition-colors cursor-pointer"
                            >
                              <Pencil className="h-3 w-3 mr-1" />
                              Düzenle
                            </Link>

                            <form
                              action={async () => {
                                "use server";
                                await deleteCategoryAction(cat.id);
                              }}
                            >
                              <button
                                type="submit"
                                className="bg-white hover:bg-red-50 text-red-600 hover:text-red-700 font-bold px-2.5 py-1 rounded-lg text-xs flex items-center border border-gray-200 hover:border-red-100 transition-colors cursor-pointer"
                              >
                                <Trash2 className="h-3 w-3 mr-1" />
                                Sil
                              </button>
                            </form>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 border border-gray-150 rounded-2xl p-8 text-center text-gray-500 italic">
              Henüz kategori bulunmuyor. Sol taraftan ekleme yapabilirsiniz.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
