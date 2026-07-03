"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createArticleAction } from '@/app/actions/admin';
import { generateArticleDraftFromUrl } from '@/app/actions/ai-writer';
import Link from 'next/link';
import { Save, ArrowLeft, Sparkles, Loader2, Globe, AlertTriangle } from 'lucide-react';

interface Category {
  id: string;
  name: string;
}

interface CreateArticleFormProps {
  categories: Category[];
}

export default function CreateArticleForm({ categories }: CreateArticleFormProps) {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [isSlugManual, setIsSlugManual] = useState(false);

  // AI Writer states
  const [sourceUrl, setSourceUrl] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');
  const [aiSuccess, setAiSuccess] = useState(false);
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const isFeaturedCheckbox = e.currentTarget.querySelector('#isFeatured') as HTMLInputElement;
    formData.set('isFeatured', isFeaturedCheckbox?.checked ? 'true' : 'false');

    const res = await createArticleAction(formData);

    if (res.success) {
      router.push('/admin');
      router.refresh();
    } else {
      setError(res.error || 'Hata oluştu.');
      setLoading(false);
    }
  };

  const handleAiGenerate = async () => {
    if (!sourceUrl.trim()) {
      setAiError('Lütfen bir kaynak URL girin.');
      return;
    }
    setAiLoading(true);
    setAiError('');
    setAiSuccess(false);

    const res = await generateArticleDraftFromUrl(sourceUrl);

    if (res.success) {
      setTitle(res.title || '');
      setSlug(sluggify(res.title || ''));
      setSummary(res.summary || '');
      setContent(res.content || '');
      setAiSuccess(true);
    } else {
      setAiError(res.error || 'Bilinmeyen bir hata oluştu.');
    }
    setAiLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between border-b border-gray-100 pb-5">
        <div className="flex items-center space-x-2">
          <Link href="/admin" className="text-gray-400 hover:text-gray-700 p-1">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-xl font-extrabold text-gray-900">Yeni Haber Ekle</h1>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-4 py-2.5 rounded-xl text-sm transition-colors shadow-sm cursor-pointer disabled:opacity-50"
        >
          <Save className="h-4 w-4 mr-2" />
          {loading ? 'Kaydediliyor...' : 'Haber Yayınla'}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-650 text-sm px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      {/* AI Writer Assistant Panel */}
      <div className="bg-gradient-to-r from-violet-50 to-indigo-50 border border-violet-200 rounded-2xl p-5 space-y-4">
        <div className="flex items-center space-x-2">
          <Sparkles className="h-5 w-5 text-violet-600" />
          <h2 className="text-sm font-extrabold text-violet-900">AI Yazar Asistanı</h2>
          <span className="text-[10px] font-bold bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full">BETA</span>
        </div>
        <p className="text-xs text-violet-700">
          Bir yabancı haber kaynağının URL'sini girin. AI bu haberi okuyarak özgün bir Türkçe taslak oluşturacaktır.
        </p>
        <div className="flex gap-3">
          <div className="relative flex-grow">
            <Globe className="absolute left-3 top-2.5 h-4 w-4 text-violet-400" />
            <input
              type="url"
              value={sourceUrl}
              onChange={(e) => setSourceUrl(e.target.value)}
              placeholder="https://cleantechnica.com/2025/..."
              className="w-full bg-white border border-violet-200 rounded-xl px-4 pl-9 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-violet-500 placeholder:text-violet-300"
            />
          </div>
          <button
            type="button"
            onClick={handleAiGenerate}
            disabled={aiLoading}
            className="inline-flex items-center bg-violet-600 hover:bg-violet-700 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-colors shadow-sm cursor-pointer disabled:opacity-50 shrink-0"
          >
            {aiLoading ? (
              <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Üretiliyor...</>
            ) : (
              <><Sparkles className="h-4 w-4 mr-2" />Taslak Oluştur</>
            )}
          </button>
        </div>
        {aiError && (
          <div className="flex items-start space-x-2 text-xs text-red-700 bg-red-50 border border-red-100 rounded-xl px-3 py-2">
            <AlertTriangle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
            <span>{aiError}</span>
          </div>
        )}
        {aiSuccess && (
          <div className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-xl px-3 py-2 font-bold">
            ✅ AI taslağı başarıyla oluşturuldu! Aşağıdaki alanları kontrol edip yayınlayabilirsiniz.
          </div>
        )}
      </div>

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
            placeholder="Örn: Katı Hal Pilleri Elektrikli Araçları Değiştiriyor"
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
            placeholder="Örn: kati-hal-pilleri-devrimi"
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
            className="block w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-gray-50 focus:bg-white transition-all"
          >
            <option value="">Seçiniz...</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="imageUrl" className="block text-sm font-bold text-gray-700">Görsel URL'si</label>
          <input
            id="imageUrl"
            name="imageUrl"
            type="text"
            placeholder="Örn: /images/electric_car_future.png veya dış bağlantı"
            className="block w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-gray-50 focus:bg-white transition-all"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="summary" className="block text-sm font-bold text-gray-700">Özet (Spot Metin) *</label>
        <textarea
          id="summary"
          name="summary"
          required
          rows={2}
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          placeholder="Haberin ana fikrini özetleyen kısa spot cümle..."
          className="block w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-gray-50 focus:bg-white transition-all"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="content" className="block text-sm font-bold text-gray-700">Haber İçeriği (HTML Destekli) *</label>
        <p className="text-xs text-gray-450 font-medium">Reklam yerleşimi için paragrafları &lt;p&gt;...&lt;/p&gt; etiketleri arasına yazın. Sosyal medya videoları için &lt;iframe&gt; etiketlerini <span className="font-bold text-violet-600">embed-wrapper</span> sınıfıyla sarmalayın.</p>
        <textarea
          id="content"
          name="content"
          required
          rows={10}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="<p>Haber metni birinci paragraf...</p>&#10;<p>Haber metni ikinci paragraf...</p>"
          className="block w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-gray-50 focus:bg-white transition-all font-mono"
        />
      </div>

      <div className="flex items-center space-x-3 bg-gray-50 p-4 rounded-xl border border-gray-150">
        <input
          id="isFeatured"
          name="isFeatured"
          type="checkbox"
          value="true"
          className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded cursor-pointer"
        />
        <div className="text-sm">
          <label htmlFor="isFeatured" className="font-bold text-gray-800 cursor-pointer">Manşet Alanında Göster (Öne Çıkar)</label>
          <p className="text-gray-550 text-xs mt-0.5">Bu seçeneği işaretlerseniz haber sitenin en tepesindeki büyük manşet alanında listelenir.</p>
        </div>
      </div>
    </form>
  );
}
