import Link from 'next/link';
import { Leaf } from 'lucide-react';
import NewsletterForm from './NewsletterForm';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-400 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="bg-emerald-950 text-emerald-400 p-2 rounded-xl group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300">
                <Leaf className="h-5 w-5" />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-white">
                enerjic<span className="text-emerald-400">.com</span>
              </span>
            </Link>
            <p className="text-sm text-gray-450 leading-relaxed">
              Elektrikli araçlar, temiz enerji, SaaS ve yeşil teknolojiler üzerine Türkiye’nin yeni nesil yerelleştirilmiş bilgi kaynağı.
            </p>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-sm font-semibold text-gray-200 uppercase tracking-wider mb-4">Kategoriler</h3>
            <ul className="space-y-2.5">
              <li>
                <Link href="/kategori/elektrikli-araclar" className="text-sm text-gray-400 hover:text-white transition-colors duration-200">
                  Elektrikli Araçlar
                </Link>
              </li>
              <li>
                <Link href="/kategori/temiz-enerji" className="text-sm text-gray-400 hover:text-white transition-colors duration-200">
                  Temiz Enerji
                </Link>
              </li>
              <li>
                <Link href="/kategori/girisimcilik-saas" className="text-sm text-gray-400 hover:text-white transition-colors duration-200">
                  Girişimcilik & SaaS
                </Link>
              </li>
              <li>
                <Link href="/kategori/trend-teknolojiler" className="text-sm text-gray-400 hover:text-white transition-colors duration-200">
                  Trend Teknolojiler
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-200 uppercase tracking-wider mb-4">Kurumsal</h3>
            <ul className="space-y-2.5">
              <li>
                <Link href="/hakkimizda" className="text-sm text-gray-400 hover:text-white transition-colors duration-200">
                  Hakkımızda
                </Link>
              </li>
              <li>
                <Link href="/iletisim" className="text-sm text-gray-400 hover:text-white transition-colors duration-200">
                  İletişim
                </Link>
              </li>
              <li>
                <Link href="/gizlilik-politikasi" className="text-sm text-gray-400 hover:text-white transition-colors duration-200">
                  Gizlilik Politikası
                </Link>
              </li>
              <li>
                <Link href="/kullanim-sartlari" className="text-sm text-gray-400 hover:text-white transition-colors duration-200">
                  Kullanım Şartları
                </Link>
              </li>
              <li>
                <Link href="/sarj-rehberi" className="text-sm text-gray-400 hover:text-white transition-colors duration-200">
                  Şarj Rehberi
                </Link>
              </li>
              <li>
                <Link href="/tasarruf-hesaplayici" className="text-sm text-gray-400 hover:text-white transition-colors duration-200">
                  Tasarruf Hesaplayıcı
                </Link>
              </li>
              <li>
                <Link href="/elektrikli-araclar" className="text-sm text-gray-400 hover:text-white transition-colors duration-200">
                  EV Kataloğu
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div>
            <NewsletterForm layout="footer" />
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">
            &copy; {currentYear} enerjic.com. Tüm hakları saklıdır.
          </p>
          <p className="text-xs text-gray-500">
            Core Web Vitals ve Google AdSense politikalarına uygun olarak optimize edilmiştir.
          </p>
        </div>
      </div>
    </footer>
  );
}
