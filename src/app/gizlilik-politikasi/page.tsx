import { Metadata } from 'next';
import { getSEOMetadata } from '@/lib/seo';

export const metadata: Metadata = getSEOMetadata({
  title: 'Gizlilik Politikası',
  description: 'enerjic.com gizlilik politikası ve çerez kullanımı hakkında detaylı bilgi edinin.',
  slug: 'gizlilik-politikasi',
});

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="space-y-8 prose prose-emerald max-w-none text-gray-800 leading-relaxed">
        <h1 className="text-4xl font-extrabold text-gray-900 border-b border-gray-100 pb-4 tracking-tight">
          Gizlilik Politikası
        </h1>

        <p className="text-sm text-gray-400">Son Güncelleme: 2 Temmuz 2026</p>

        <p>
          enerjic.com olarak, ziyaretçilerimizin gizliliğini korumak bizim için en üst düzeyde önem taşır. Bu Gizlilik Politikası belgesi, enerjic.com tarafından hangi tür kişisel bilgilerin toplandığını, nasıl kullanıldığını ve bu bilgilerin nasıl korunduğunu açıklamaktadır.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-6">Log Dosyaları</h2>
        <p>
          Çoğu standart web sunucusunda olduğu gibi, enerjic.com log dosyalarını analiz amaçlı saklar. Bu dosyalar; internet protokol (IP) adresleri, tarayıcı türü, internet servis sağlayıcısı (ISP), giriş/çıkış sayfaları, platform türü, tarih/saat damgası ve eğilimleri analiz etmek, siteyi yönetmek, kullanıcı hareketlerini izlemek için tıklama sayıları gibi standart bilgileri içerir. IP adresleri kişisel olarak tanımlanabilir bilgilerle ilişkilendirilmemiştir.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-6">Çerezler ve Web İşaretçileri</h2>
        <p>
          enerjic.com, ziyaretçilerin tercihlerini kaydetmek, kullanıcılara özel içerik sunmak ve kullanıcıların tarayıcı türüne göre web sayfa içeriklerini optimize etmek için çerezleri (cookies) kullanır.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-6">Google AdSense ve DoubleClick Dart Çerezi</h2>
        <p>
          Google, üçüncü taraf bir satıcı olarak, sitemizde reklam yayınlamak için çerezleri kullanır. Google'ın DART çerezlerini kullanması, kullanıcılarımızın enerjic.com'a ve internetteki diğer sitelere yaptıkları ziyaretlere dayalı olarak reklamlar sunmasına olanak tanır. Kullanıcılar, Google reklam ve içerik ağı gizlilik politikasını ziyaret ederek DART çerezinin kullanılmasını engelleyebilirler.
        </p>
        <p>
          Sitemizde kullanılan reklam ortaklarımızdan bazıları da çerez ve web işaretçileri kullanabilir. Reklam ortaklarımız arasında <strong>Google AdSense</strong> bulunmaktadır. Bu üçüncü taraf reklam sunucuları veya reklam ağları, enerjic.com üzerinde görünen reklamların doğrudan tarayıcınıza gönderilmesi için teknolojiyi kullanır ve bu durumda IP adresinizi otomatik olarak alırlar.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-6">Haklarınız ve İletişim</h2>
        <p>
          Gizlilik Politikamızla ilgili herhangi bir sorunuz veya hakkınızda topladığımız bilgilere dair talepleriniz olması durumunda, bizimle <a href="mailto:info@enerjic.com" className="text-emerald-700 underline font-semibold">info@enerjic.com</a> adresi üzerinden dilediğiniz zaman iletişime geçebilirsiniz.
        </p>
      </div>
    </div>
  );
}
