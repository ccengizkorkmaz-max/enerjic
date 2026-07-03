import { Metadata } from 'next';
import { getSEOMetadata } from '@/lib/seo';

export const metadata: Metadata = getSEOMetadata({
  title: 'Kullanım Şartları',
  description: 'enerjic.com kullanım şartları ve yasal sorumluluklar hakkında bilgi edinin.',
  slug: 'kullanim-sartlari',
});

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="space-y-8 prose prose-emerald max-w-none text-gray-800 leading-relaxed">
        <h1 className="text-4xl font-extrabold text-gray-900 border-b border-gray-100 pb-4 tracking-tight">
          Kullanım Şartları
        </h1>

        <p className="text-sm text-gray-400">Son Güncelleme: 2 Temmuz 2026</p>

        <p>
          enerjic.com web sitesine hoş geldiniz. Bu web sitesini ziyaret ederek ve kullanarak aşağıdaki kullanım şartlarını kabul etmiş sayılırsınız. Şartları kabul etmiyorsanız lütfen siteyi kullanmayınız.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-6">Fikri Mülkiyet Hakları</h2>
        <p>
          enerjic.com'da yayınlanan tüm yazılar, logolar, grafikler, görseller ve diğer materyallerin telif hakları enerjic.com'a veya içerik sağlayıcılarına aittir. Yazılı izin alınmaksızın bu içeriklerin kopyalanması, çoğaltılması, dağıtılması veya ticari amaçlarla kullanılması yasaktır. Haberlerimizi, kaynak göstermek ve aktif link vermek şartıyla paylaşabilirsiniz.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-6">Sorumluluk Reddi</h2>
        <p>
          enerjic.com'da sunulan bilgiler genel bilgilendirme amaçlıdır. İçeriklerin doğruluğu, güncelliği ve eksiksizliği konusunda elimizden gelen çabayı göstersek de, bu bilgilerin kullanımından doğabilecek maddi veya manevi zararlardan enerjic.com ve yazarları sorumlu tutulamaz. Yatırım veya mühendislik kararları almadan önce profesyonel destek almanız önerilir.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-6">Dış Bağlantılar (Linkler)</h2>
        <p>
          Sitemiz, kolaylık sağlamak amacıyla üçüncü taraf web sitelerine bağlantılar (linkler) içerebilir. Bağlantı verilen bu sitelerin içeriklerinin doğruluğu veya gizlilik ilkeleri üzerinde herhangi bir kontrolümüz yoktur ve bunlardan kaynaklanan hiçbir sorumluluk kabul edilmez.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-6">Değişiklik Hakları</h2>
        <p>
          enerjic.com, bu Kullanım Şartları belgesini önceden haber vermeksizin herhangi bir zamanda güncelleme hakkını saklı tutar. Ziyaretçilerin güncel şartları periyodik olarak kontrol etmeleri kendi sorumluluklarındadır.
        </p>
      </div>
    </div>
  );
}
