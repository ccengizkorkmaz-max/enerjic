"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { updateArticleAction } from '@/app/actions/admin';
import Link from 'next/link';
import { Save, ArrowLeft, Bold, Italic, Heading2, Heading3, List, Table, Code, Eye, Upload, Loader2 } from 'lucide-react';
import SocialMediaAssistant from './SocialMediaAssistant';

interface Category {
  id: string;
  name: string;
}

interface Article {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  imageUrl: string | null;
  categoryId: string;
  isFeatured: boolean;
}

interface EditArticleFormProps {
  article: Article;
  categories: Category[];
}

export default function EditArticleForm({ article, categories }: EditArticleFormProps) {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [title, setTitle] = useState(article.title);
  const [slug, setSlug] = useState(article.slug);
  const [isSlugManual, setIsSlugManual] = useState(true);
  const [imageUrl, setImageUrl] = useState(article.imageUrl || '');
  const [content, setContent] = useState(article.content);
  const [editorMode, setEditorMode] = useState<'visual' | 'html'>('visual');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setUploadError('');

    try {
      let uploadedUrl = '';

      // 1. Try ImgBB with multiple keys
      const imgbbKeys = [
        '6d207e02198a847aa98d0a2a901485a5',
        'c5c9945bf13b5e408544d6dbd4bc5a36',
        '8d3f54c640c3574f58f2ce9433f27ec7',
      ];

      for (const key of imgbbKeys) {
        try {
          const formData = new FormData();
          formData.append('image', file);
          formData.append('key', key);

          const res = await fetch('https://api.imgbb.com/1/upload', {
            method: 'POST',
            body: formData,
          });

          if (res.ok) {
            const data = await res.json();
            if (data.success && data.data?.url) {
              uploadedUrl = data.data.url;
              break;
            }
          }
        } catch (err) {
          console.warn('ImgBB upload attempt failed:', err);
        }
      }

      // 2. Try FreeImage.host if ImgBB failed
      if (!uploadedUrl) {
        try {
          const formData = new FormData();
          formData.append('source', file);
          formData.append('key', '6d207e02198a847aa98d0a2a901485a5');
          formData.append('action', 'upload');
          formData.append('format', 'json');

          const res = await fetch('https://freeimage.host/api/1/upload', {
            method: 'POST',
            body: formData,
          });

          if (res.ok) {
            const data = await res.json();
            if (data.image?.url) {
              uploadedUrl = data.image.url;
            }
          }
        } catch (err) {
          console.warn('FreeImage upload attempt failed:', err);
        }
      }

      // 3. Fallback to FileReader Base64 Data URL (Guaranteed to work 100%)
      if (!uploadedUrl) {
        uploadedUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            if (typeof reader.result === 'string') {
              resolve(reader.result);
            } else {
              reject(new Error('Görsel işlenemedi.'));
            }
          };
          reader.onerror = () => reject(new Error('Görsel okuma hatası.'));
          reader.readAsDataURL(file);
        });
      }

      if (uploadedUrl) {
        setImageUrl(uploadedUrl);
      } else {
        throw new Error('Görsel yüklenemedi, lütfen tekrar deneyin.');
      }
    } catch (err: any) {
      setUploadError(err.message || 'Yükleme sırasında bir hata oluştu.');
    } finally {
      setUploadingImage(false);
    }
  };

  const sluggify = (text: string) => {
    const trMap: { [key: string]: string } = {
      'ç': 'c', 'Ç': 'c', 'ğ': 'g', 'Ğ': 'g', 'ı': 'i', 'İ': 'i',
      'ö': 'o', 'Ö': 'o', 'ş': 's', 'Ş': 's', 'ü': 'u', 'Ü': 'u',
    };
    return text
      .toString()
      .toLowerCase()
      .replace(/[çÇğĞıİöÖşŞüÜ]/g, (match) => trMap[match] || match)
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitle(val);
    if (!isSlugManual) {
      setSlug(sluggify(val));
    }
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSlug(e.target.value);
    setIsSlugManual(true);
  };

  const insertTable = () => {
    const tableHtml = `
<table style="width:100%; border-collapse:collapse; margin:1.5rem 0; font-size:0.95rem;">
  <thead>
    <tr>
      <th style="text-align:left; padding:0.75rem; border-bottom:2px solid #047857; font-weight:700; color:#111827;">Sütun 1</th>
      <th style="text-align:left; padding:0.75rem; border-bottom:2px solid #047857; font-weight:700; color:#111827;">Sütun 2</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding:0.75rem; border-bottom:1px solid #e5e7eb;">Hücre 1</td>
      <td style="padding:0.75rem; border-bottom:1px solid #e5e7eb;">Hücre 2</td>
    </tr>
  </tbody>
</table>
`;
    document.execCommand('insertHTML', false, tableHtml);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const isFeaturedCheckbox = e.currentTarget.querySelector('#isFeatured') as HTMLInputElement;
    formData.set('isFeatured', isFeaturedCheckbox?.checked ? 'true' : 'false');
    formData.set('content', content);

    const res = await updateArticleAction(article.id, formData);

    if (res.success) {
      router.push('/admin');
      router.refresh();
    } else {
      setError(res.error || 'Hata oluştu.');
      setLoading(false);
    }
  };

  return (
    <>
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between border-b border-gray-100 pb-5">
        <div className="flex items-center space-x-2">
          <Link href="/admin" className="text-gray-400 hover:text-gray-700 p-1">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-xl font-extrabold text-gray-900">Haberi Düzenle</h1>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-4 py-2.5 rounded-xl text-sm transition-colors shadow-sm cursor-pointer disabled:opacity-50"
        >
          <Save className="h-4 w-4 mr-2" />
          {loading ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-650 text-sm px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="title" className="block text-sm font-bold text-gray-700">Haber Başlığı *</label>
          <input
            id="title"
            name="title"
            type="text"
            required
            value={title}
            onChange={handleTitleChange}
            className="block w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-gray-50 focus:bg-white transition-all"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="slug" className="block text-sm font-bold text-gray-700">URL Uzantısı (Slug) *</label>
          <input
            id="slug"
            name="slug"
            type="text"
            required
            value={slug}
            onChange={handleSlugChange}
            className="block w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-gray-50 focus:bg-white transition-all font-mono"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="categoryId" className="block text-sm font-bold text-gray-700">Kategori *</label>
          <select
            id="categoryId"
            name="categoryId"
            required
            defaultValue={article.categoryId}
            className="block w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-gray-50 focus:bg-white transition-all"
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-bold text-gray-700">Haber Görseli</label>
          <div className="flex flex-col sm:flex-row items-start gap-4">
            {imageUrl && (
              <div className="relative group h-20 w-36 rounded-xl overflow-hidden bg-gray-50 border border-gray-200 shadow-sm shrink-0">
                <img
                  src={imageUrl}
                  alt="Haber Görseli"
                  className="object-cover w-full h-full"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/images/electric_car_future.png';
                  }}
                />
              </div>
            )}
            <div className="flex-grow space-y-2 w-full">
              <div className="flex gap-2">
                <input
                  id="imageUrl"
                  name="imageUrl"
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="Örn: /images/articles/range_vs_charging.png"
                  className="block w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-gray-50 focus:bg-white transition-all text-xs"
                />
                <label className="inline-flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold px-4 py-2.5 rounded-xl text-sm transition-colors cursor-pointer shrink-0 border border-emerald-100/50 shadow-sm">
                  {uploadingImage ? (
                    <Loader2 className="h-4 w-4 animate-spin text-emerald-600" />
                  ) : (
                    <Upload className="h-4 w-4 text-emerald-600" />
                  )}
                  <span>{uploadingImage ? 'Yükleniyor...' : 'Görsel Yükle'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    disabled={uploadingImage}
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>
              <p className="text-[11px] text-gray-450 font-medium">Görsel URL'si girebilir veya bilgisayarınızdan doğrudan hızlı resim sunucusuna (ImgBB) yükleyebilirsiniz.</p>
              {uploadError && (
                <p className="text-xs text-red-650 font-medium bg-red-50 border border-red-100 rounded-lg px-2.5 py-1.5">{uploadError}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="summary" className="block text-sm font-bold text-gray-700">Özet (Spot Metin) *</label>
        <textarea
          id="summary"
          name="summary"
          required
          rows={2}
          defaultValue={article.summary}
          className="block w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-gray-50 focus:bg-white transition-all"
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <label className="block text-sm font-bold text-gray-700">Haber İçeriği *</label>
            <p className="text-[11px] text-gray-450 font-medium">Reklam yerleşimi için paragrafları &lt;p&gt;...&lt;/p&gt; etiketleri arasına yazın.</p>
          </div>
          <div className="flex bg-gray-150 p-0.5 rounded-lg border border-gray-200 shrink-0">
            <button
              type="button"
              onClick={() => setEditorMode('visual')}
              className={`flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-md transition-all cursor-pointer ${
                editorMode === 'visual'
                  ? 'bg-white text-emerald-800 shadow-sm'
                  : 'text-gray-550 hover:text-gray-800'
              }`}
            >
              <Eye className="h-3 w-3" />
              Görsel Editör
            </button>
            <button
              type="button"
              onClick={() => setEditorMode('html')}
              className={`flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-md transition-all cursor-pointer ${
                editorMode === 'html'
                  ? 'bg-white text-emerald-800 shadow-sm'
                  : 'text-gray-550 hover:text-gray-800'
              }`}
            >
              <Code className="h-3 w-3" />
              HTML Kodu
            </button>
          </div>
        </div>

        {editorMode === 'visual' && (
          <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
            <div className="flex flex-wrap items-center gap-0.5 px-3 py-1.5 border-b border-gray-150 bg-gray-50/50">
              <button
                type="button"
                onClick={() => document.execCommand('bold', false)}
                className="p-1.5 text-gray-550 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                title="Kalın (Bold)"
              >
                <Bold className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => document.execCommand('italic', false)}
                className="p-1.5 text-gray-550 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                title="İtalik (Italic)"
              >
                <Italic className="h-4 w-4" />
              </button>
              <div className="w-px h-4 bg-gray-200 mx-1"></div>
              <button
                type="button"
                onClick={() => document.execCommand('formatBlock', false, 'H2')}
                className="px-2 py-1 text-xs font-bold text-gray-550 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                title="Başlık 2 (H2)"
              >
                H2
              </button>
              <button
                type="button"
                onClick={() => document.execCommand('formatBlock', false, 'H3')}
                className="px-2 py-1 text-xs font-bold text-gray-550 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                title="Başlık 3 (H3)"
              >
                H3
              </button>
              <button
                type="button"
                onClick={() => document.execCommand('formatBlock', false, 'P')}
                className="px-2 py-1 text-xs font-bold text-gray-550 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                title="Paragraf (P)"
              >
                P
              </button>
              <div className="w-px h-4 bg-gray-200 mx-1"></div>
              <button
                type="button"
                onClick={() => document.execCommand('insertUnorderedList', false)}
                className="p-1.5 text-gray-550 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                title="Madde İşaretli Liste"
              >
                <List className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={insertTable}
                className="p-1.5 text-gray-550 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer flex items-center gap-1 text-xs font-bold"
                title="Tablo Ekle"
              >
                <Table className="h-4 w-4" />
                <span>Tablo Ekle</span>
              </button>
            </div>
            <div
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => {
                setContent(e.currentTarget.innerHTML);
              }}
              dangerouslySetInnerHTML={{ __html: content }}
              className="block w-full min-h-[350px] max-h-[600px] overflow-y-auto px-5 py-4 text-gray-800 focus:outline-none transition-all font-sans prose max-w-none border-0"
              style={{ outline: 'none' }}
            />
          </div>
        )}

        {editorMode === 'html' && (
          <textarea
            id="content"
            name="content"
            required
            rows={14}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="block w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-850 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-gray-50 focus:bg-white transition-all font-mono"
          />
        )}
      </div>

      <div className="flex items-center space-x-3 bg-gray-50 p-4 rounded-xl border border-gray-150">
        <input
          id="isFeatured"
          name="isFeatured"
          type="checkbox"
          value="true"
          defaultChecked={article.isFeatured}
          className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded cursor-pointer"
        />
        <div className="text-sm">
          <label htmlFor="isFeatured" className="font-bold text-gray-800 cursor-pointer">Manşet Alanında Göster (Öne Çıkar)</label>
          <p className="text-gray-550 text-xs mt-0.5">Bu seçeneği işaretlerseniz haber sitenin en tepesindeki büyük manşet alanında listelenir.</p>
        </div>
      </div>
    </form>

    <SocialMediaAssistant
      article={{
        id: article.id,
        title: title,
        summary: article.summary,
        imageUrl: imageUrl || null,
        category: (() => {
          const cat = categories.find(c => c.id === article.categoryId);
          return {
            name: cat?.name || 'Genel',
            slug: (cat as any)?.slug || 'genel'
          };
        })()
      }}
    />
    </>
  );
}
