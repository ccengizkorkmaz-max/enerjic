import { Metadata } from 'next';
import { getSEOMetadata } from '@/lib/seo';
import ChargingCalculator from '@/components/ChargingCalculator';
import Link from 'next/link';
import { Zap, HelpCircle, ArrowRight, Battery, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const metadata: Metadata = getSEOMetadata({
  title: 'Elektrikli Araç Şarj Süresi ve Maliyet Hesaplayıcı 2026',
  description: 'Togg T10X, Tesla Model Y, BYD ve tüm elektrikli araçların evde ve hızlı şarj istasyonlarında kaç dakikada dolacağını ve kaç TL tutacağını canlı hesaplayın.',
  slug: 'sarj-hesaplayici',
});

export default function ChargingCalculatorPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Breadcrumb & Intro */}
      <div className="space-y-4 text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center space-x-2 bg-emerald-50 text-emerald-800 text-xs font-bold px-3.5 py-1.5 rounded-full border border-emerald-100">
          <Zap className="w-4 h-4 text-emerald-600 fill-emerald-600 animate-pulse" />
          <span>Enerjic Akıllı Hesaplayıcı</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">
          Elektrikli Araç Şarj Süresi & Maliyet Hesaplama
        </h1>

        <p className="text-base sm:text-lg text-gray-600 leading-relaxed font-normal">
          Aracınızın batarya kapasitesini ve şarj istasyonu gücünü seçerek <strong>kaç dakikada şarj olacağını</strong>, <strong>kaç kWh elektrik çekeceğini</strong> ve ev/istasyon tarifelerine göre <strong>toplam maliyetini</strong> anında öğrenin.
        </p>
      </div>

      {/* Main Interactive Component */}
      <ChargingCalculator />

      {/* FAQ & Information Section */}
      <div className="bg-gray-50 border border-gray-100 rounded-3xl p-6 sm:p-10 space-y-8">
        <div className="flex items-center space-x-3 border-b border-gray-200 pb-4">
          <HelpCircle className="w-6 h-6 text-emerald-600" />
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
            Elektrikli Araç Şarjı Hakkında Sıkça Sorulan Sorular
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-gray-700 leading-relaxed">
          <div className="space-y-2 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-900 text-base flex items-center">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 mr-2 shrink-0" />
              Neden bataryayı %80'e kadar şarj etmek önerilir?
            </h3>
            <p className="text-gray-600 text-xs leading-normal">
              Lityum-iyon bataryalar %80 doluluğa ulaştıktan sonra hücre sağlığını korumak için şarj hızını otomatik olarak düşürür (%80-100 arası şarj süresi daha uzundur). Günlük kullanımda %80 şarj sınırı koymak batarya ömrünü uzatır.
            </p>
          </div>

          <div className="space-y-2 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-900 text-base flex items-center">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 mr-2 shrink-0" />
              AC Şarj ile DC Hızlı Şarj arasındaki fark nedir?
            </h3>
            <p className="text-gray-600 text-xs leading-normal">
              AC (Alternatif Akım) şarj evde veya sitede gece boyunca şarj için idealdir, aracın dahili şarj dönüştürücüsünü kullanır. DC (Doğrudan Akım) şarj ise yüksek gücü doğrudan bataryaya aktararak 20-30 dakikada hızlı doldurma sağlar.
            </p>
          </div>

          <div className="space-y-2 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-900 text-base flex items-center">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 mr-2 shrink-0" />
              Evde elektrikli araç şarj etmek ne kadar tasarrufludur?
            </h3>
            <p className="text-gray-600 text-xs leading-normal">
              Ev elektriği tarifesi halka açık DC hızlı şarj istasyonlarına göre ortalama %70-75 daha uygundur. Deponuzu gece evde doldurmak kilometre başına maliyetinizi benzine göre yaklaşık 5 kat düşürür.
            </p>
          </div>

          <div className="space-y-2 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-900 text-base flex items-center">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 mr-2 shrink-0" />
              Şarj süresini etkileyen ek faktörler nelerdir?
            </h3>
            <p className="text-gray-600 text-xs leading-normal">
              Ortam sıcaklığı (aşırı soğuk veya sıcak havalar), bataryanın ilk sıcaklığı, istasyonda aynı anda şarj olan araç sayısı ve aracınızın desteklediği maksimum şarj gücü süreyi doğrudan etkiler.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center bg-emerald-950 text-white rounded-2xl p-6 gap-4">
          <div>
            <h4 className="font-bold text-base text-white">Elektrikli Araç İncelemelerini Keşfedin</h4>
            <p className="text-xs text-emerald-200/80 mt-1">
              Türkiye pazarındaki tüm elektrikli araçların menzil, şarj hızı ve teknik detaylarını karşılaştırın.
            </p>
          </div>
          <Link
            href="/elektrikli-araclar"
            className="inline-flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-5 py-2.5 rounded-xl text-xs transition cursor-pointer shadow-md shrink-0"
          >
            <span>Araç Kataloğuna Git</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
