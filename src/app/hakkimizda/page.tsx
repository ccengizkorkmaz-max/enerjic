import { Metadata } from 'next';
import { getSEOMetadata } from '@/lib/seo';

export const metadata: Metadata = getSEOMetadata({
  title: 'Hakkımızda',
  description: 'enerjic.com hakkında bilgi edinin. Sürdürülebilir yeşil teknolojiler ve temiz enerjinin geleceğini aktarıyoruz.',
  slug: 'hakkimizda',
});

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="space-y-8 prose prose-emerald max-w-none text-gray-800 leading-relaxed">
        <h1 className="text-4xl font-extrabold text-gray-900 border-b border-gray-100 pb-4 tracking-tight">
          Hakkımızda
        </h1>

        <p className="text-lg">
          <strong>enerjic.com</strong>, dünya genelindeki temiz enerji dönüşümünü, sürdürülebilir yaşam pratiklerini ve yeşil teknoloji trendlerini yerelleştirerek Türkiye’deki okuyucularına ulaştırmayı hedefleyen yeni nesil, bağımsız bir teknoloji ve haber portalıdır.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-6">Vizyonumuz</h2>
        <p>
          Karbon nötr bir gelecek yolunda; elektrikli araçların yaygınlaşmasından rüzgar ve güneş enerjisi yatırımlarına, girişimcilik ekosistemindeki yeşil SaaS projelerinden akıllı şehirlere kadar geniş bir yelpazedeki yenilikleri takip ederek toplumda çevre ve teknoloji bilincini en üst düzeye taşımak.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-6">Neler Paylaşıyoruz?</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Elektrikli Araçlar:</strong> Elektrikli otomobiller, batarya teknolojileri, mikromobilite ve şarj altyapıları.</li>
          <li><strong>Temiz Enerji:</strong> Güneş, rüzgar, hidrojen ve jeotermal gibi sürdürülebilir enerji kaynakları ve küresel projeler.</li>
          <li><strong>Girişimcilik & SaaS:</strong> Karbon izleme yazılımları, enerji verimliliği sağlayan dijital çözümler ve yeşil start-up'lar.</li>
          <li><strong>Trend Teknolojiler:</strong> Akıllı şebekeler, döngüsel ekonomi teknolojileri ve çevre dostu donanımsal icatlar.</li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-900 mt-6">Yayın İlkelerimiz</h2>
        <p>
          İçeriklerimizi hazırlarken bilimsel verilere, objektif haberciliğe ve okuyucuyu yormayan minimalist bir arayüz tasarımına önem veriyoruz. Sitemizde yer alan tüm analiz ve haberler, küresel gelişmeleri en doğru ve sade Türkçe ile aktarmayı amaçlar.
        </p>
      </div>
    </div>
  );
}
