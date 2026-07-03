import { Metadata } from 'next';
import { getSEOMetadata } from '@/lib/seo';
import { Mail, MapPin, Globe } from 'lucide-react';

export const metadata: Metadata = getSEOMetadata({
  title: 'İletişim',
  description: 'enerjic.com ile iletişime geçin. Reklam ve iş birlikleri için bize ulaşın.',
  slug: 'iletisim',
});

export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="space-y-8 text-gray-800 leading-relaxed">
        <div className="border-b border-gray-100 pb-4">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            İletişim
          </h1>
          <p className="text-gray-500 mt-2">
            Sorularınız, reklam teklifleriniz veya haber önerileriniz için bizimle iletişime geçebilirsiniz.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900">İletişim Bilgileri</h2>
            
            <div className="flex items-center space-x-4">
              <div className="bg-emerald-50 text-emerald-600 p-3 rounded-xl">
                <Mail className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase text-gray-400">E-Posta</p>
                <a href="mailto:info@enerjic.com" className="text-sm font-semibold text-emerald-700 hover:underline">
                  info@enerjic.com
                </a>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="bg-emerald-50 text-emerald-600 p-3 rounded-xl">
                <MapPin className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase text-gray-400">Adres</p>
                <p className="text-sm font-semibold text-gray-700">
                  Levent, Büyükdere Cd. No:120, Beşiktaş / İstanbul
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="bg-emerald-50 text-emerald-600 p-3 rounded-xl">
                <Globe className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase text-gray-400">Web Sitemiz</p>
                <p className="text-sm font-semibold text-gray-700">
                  www.enerjic.com
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 flex flex-col justify-center space-y-4">
            <h3 className="text-lg font-bold text-gray-900">Reklam & Sponsorluk</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              CleanTechnica modelindeki reklam yayın ilkelerine bağlı kalarak, elektrikli araç, sürdürülebilirlik yazılımı (SaaS) ve güneş enerjisi markalarıyla iş birlikleri yapmaktayız. Bilgi almak için doğrudan <a href="mailto:info@enerjic.com" className="text-emerald-700 underline font-semibold">info@enerjic.com</a> adresimize yazabilirsiniz.
            </p>
            <p className="text-xs text-gray-400">
              * Gönderilen tüm e-postalar en geç 24 saat içinde yanıtlanmaktadır.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
