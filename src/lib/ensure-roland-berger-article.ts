import { db } from '@/lib/db';

export async function ensureRolandBergerArticle() {
  try {
    const slug = 'roland-berger-ev-charging-index-2026-kuresel-sarj-ve-elektrikli-arac-raporu';
    const existing = await db.article.findUnique({
      where: { slug },
    });

    const imageUrl = '/images/roland-berger-2026/cover.jpg';

    let category = await db.category.findFirst({
      where: { slug: 'elektrikli-araclar' },
    });

    if (!category) {
      category = await db.category.findFirst();
    }

    if (!category) return;

    const title = 'Roland Berger EV Charging Index 2026: Küresel Elektrikli Araç ve Şarj Altyapısı Raporu Açıklandı';
    const summary = "Uluslararası strateji danışmanlığı devi Roland Berger, 'EV Charging Index 2026' raporunu yayımladı. Küresel elektrikli araç satışlarının %20'den fazla arttığı ve satılan her 4 araçtan 1'inin elektrikli olduğu 2026 tablosunda; ultra hızlı şarj (150 kW+) dönüşümü, PHEV sürprizi ve Türkiye'nin dikkat çeken performansı öne çıkıyor.";

    const content = `
<div class="bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border border-emerald-200/80 rounded-2xl p-6 mb-8 shadow-sm">
  <div class="flex items-center gap-3 mb-3">
    <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-emerald-600 text-white tracking-wide uppercase">
      Resmi Sektör Raporu Özeti
    </span>
    <span class="text-xs font-medium text-emerald-800">Temmuz 2026 • Roland Berger Strateji Danışmanlığı</span>
  </div>
  <p class="text-gray-800 font-medium text-base sm:text-lg leading-relaxed mb-0">
    Dünyanın önde gelen yönetim ve strateji danışmanlığı şirketlerinden <strong>Roland Berger</strong> tarafından hazırlanan <em>"EV Charging Index 2026 (Currents of Change – Global EV Adoption and Charging Infrastructure)"</em> çalışması yayımlandı. 34 odak ülkeyi kapsayan küresel araştırma, elektrikli mobilite ekosisteminin niceliksel büyümeden <strong>niteliksel olgunlaşma ve ultra hızlı şarj (150 kW+)</strong> çağına geçtiğini gösteriyor.
  </p>
</div>

<p class="lead text-lg text-gray-700 leading-relaxed mb-6 font-normal">
  2025 yılı verileri ve 2026 projeksiyonlarını temel alan rapora göre; küresel elektrikli araç (BEV ve PHEV) satışları yıllık bazda <strong>%20'nin üzerinde büyüme kaydederek 21 milyon adede</strong> ulaştı. Dünya genelinde satılan her dört yeni binek ve hafif ticari araçtan biri elektrikli motor seçeneğine sahip oldu. Yollardaki toplam elektrikli araç filosu (EV Parc) ise <strong>73 milyon adedi aşarak</strong> küresel araç parkının %5'inden fazlasını oluşturdu.
</p>

<h2 class="text-2xl font-bold text-gray-900 mt-10 mb-4 flex items-center gap-2">
  <span class="w-2.5 h-6 bg-emerald-600 rounded-full inline-block"></span>
  1. Bölgesel Ayrışma: Asya-Pasifik ve Avrupa Hızlanırken, Kuzey Amerika Duraksıyor
</h2>

<p class="mb-4 text-gray-700 leading-relaxed">
  Roland Berger analizine göre, küresel elektrikli araç dönüşümünde coğrafi kutuplaşma giderek derinleşiyor:
</p>

<div class="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
  <div class="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:border-emerald-300 transition-all">
    <div class="flex items-center justify-between mb-2">
      <h3 class="font-bold text-gray-900 text-lg">🌏 Asya-Pasifik (APAC)</h3>
      <span class="text-xs font-extrabold px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-md">%41 Penetrasyon</span>
    </div>
    <p class="text-sm text-gray-600 leading-relaxed">
      APAC bölgesinde EV satışları <strong>14.8 milyon adede</strong> ulaştı. Bölgedeki her 10 satışın 9'unu gerçekleştiren <strong>Çin</strong>, 2025'te <strong>%50 pazar penetrasyonu</strong> barajını geçerek satılan her iki araçtan birinin elektrikli olmasını sağladı.
    </p>
  </div>

  <div class="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:border-emerald-300 transition-all">
    <div class="flex items-center justify-between mb-2">
      <h3 class="font-bold text-gray-900 text-lg">🇪🇺 Avrupa</h3>
      <span class="text-xs font-extrabold px-2.5 py-1 bg-blue-100 text-blue-800 rounded-md">%29 Penetrasyon</span>
    </div>
    <p class="text-sm text-gray-600 leading-relaxed">
      2024 yılındaki yavaşlamanın ardından güçlü bir geri dönüş sergileyen Avrupa pazarı, %33 artışla <strong>3.7 milyon yeni EV satışına</strong> ulaştı. Batı Avrupa'da penetrasyon %30'a, Doğu Avrupa'da ise %15'e yükseldi.
    </p>
  </div>

  <div class="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:border-red-300 transition-all">
    <div class="flex items-center justify-between mb-2">
      <h3 class="font-bold text-gray-900 text-lg">🌎 Kuzey Amerika</h3>
      <span class="text-xs font-extrabold px-2.5 py-1 bg-red-100 text-red-800 rounded-md">%10-%11 Penetrasyon</span>
    </div>
    <p class="text-sm text-gray-600 leading-relaxed">
      ABD ve Kanada'da politika belirsizlikleri ve temkinli tüketici duyarlılığı nedeniyle satışlar yaklaşık <strong>2.0 milyon adet bandında yatay</strong> kaldı ve pazar payı ivme kaybetti.
    </p>
  </div>

  <div class="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:border-purple-300 transition-all">
    <div class="flex items-center justify-between mb-2">
      <h3 class="font-bold text-gray-900 text-lg">🌍 MENA & Körfez</h3>
      <span class="text-xs font-extrabold px-2.5 py-1 bg-purple-100 text-purple-800 rounded-md">%10 Penetrasyon</span>
    </div>
    <p class="text-sm text-gray-600 leading-relaxed">
      Orta Doğu ve Kuzey Afrika pazarı toplam hacimde 300 bin seviyesinde kalsa da yıllık <strong>%50 büyüme</strong> ile en hızlı ivmelenen bölgelerden biri oldu.
    </p>
  </div>
</div>

<div class="my-8 rounded-2xl overflow-hidden border border-gray-200 shadow-sm bg-white p-2">
  <img 
    src="/images/roland-berger-2026/roland_berger_fig_p6.png" 
    alt="Bölgelere Göre Elektrikli Araç Satış Penetrasyonu - Roland Berger EV Charging Index 2026" 
    class="w-full rounded-xl object-contain"
  />
  <p class="text-center text-xs text-gray-500 mt-2 italic">
    Grafik 1: Bölgeler bazında EV satış penetrasyonu gelişimi (Kaynak: Roland Berger / EV-Volumes / EAFO)
  </p>
</div>

<h2 class="text-2xl font-bold text-gray-900 mt-10 mb-4 flex items-center gap-2">
  <span class="w-2.5 h-6 bg-emerald-600 rounded-full inline-block"></span>
  2. Türkiye Özel Değerlendirmesi: Togg, Tesla ve BYD Etkisi
</h2>

<p class="mb-4 text-gray-700 leading-relaxed">
  Roland Berger EV Charging Index 2026 raporunda <strong>Türkiye pazarı</strong>, bölgesel büyüme dinamiklerinde ve şarj altyapısı dengesinde pozitif ayrışan ülkeler arasında özel bir yer tuttu:
</p>

<div class="bg-slate-900 text-white rounded-2xl p-6 my-6 shadow-lg">
  <h3 class="text-xl font-bold text-emerald-400 mb-4 flex items-center gap-2">
    🇹🇷 Türkiye'nin 2026 Endeksi Performansı:
  </h3>
  <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center border-t border-slate-800 pt-5">
    <div>
      <div class="text-3xl font-extrabold text-white mb-1">%13</div>
      <div class="text-xs text-slate-400">EV Satış Penetrasyonu (%8 BEV + %5 PHEV)</div>
    </div>
    <div>
      <div class="text-3xl font-extrabold text-emerald-400 mb-1">13 Araç</div>
      <div class="text-xs text-slate-400">Kamuya Açık Şarj Soketi Başına Düşen Araç</div>
    </div>
    <div>
      <div class="text-3xl font-extrabold text-teal-300 mb-1">Dengeli</div>
      <div class="text-xs text-slate-400">Altyapı - Talep Korelasyonu</div>
    </div>
  </div>
  <p class="text-sm text-slate-300 mt-5 leading-relaxed">
    Raporda, yerli üretici <strong>Togg'un (T10X ve T10F)</strong> pazardaki güçlü varlığının yanı sıra <strong>Tesla</strong> ve <strong>BYD</strong>'nin yatırımlarıyla Türkiye'de elektrikli araç penetrasyonunun %13'e ulaştığı vurgulanıyor. Türkiye'de halka açık şarj soketi başına düşen araç sayısının <strong>13</strong> olması; ABD (33), Fransa (15), Almanya (16) ve İngiltere (25) gibi ülkelere kıyasla Türkiye'nin şarj altyapısı genişleme hızının araç parkıyla son derece dengeli ilerlediğini belgeliyor.
  </p>
</div>

<div class="my-8 rounded-2xl overflow-hidden border border-gray-200 shadow-sm bg-white p-2">
  <img 
    src="/images/roland-berger-2026/roland_berger_fig_p9.png" 
    alt="Ülkelere Göre 2025-2026 EV Satış Penetrasyon Oranları - Roland Berger EV Charging Index" 
    class="w-full rounded-xl object-contain"
  />
  <p class="text-center text-xs text-gray-500 mt-2 italic">
    Grafik 2: 34 odak ülkede BEV ve PHEV satış penetrasyon oranları (Kaynak: Roland Berger EV Charging Index 2026)
  </p>
</div>

<h2 class="text-2xl font-bold text-gray-900 mt-10 mb-4 flex items-center gap-2">
  <span class="w-2.5 h-6 bg-emerald-600 rounded-full inline-block"></span>
  3. Şarj Altyapısı: Yavaşlamıyor, Olgunlaşıyor ve "Ultra Hızlı"ya Dönüşüyor
</h2>

<p class="mb-4 text-gray-700 leading-relaxed">
  Dünya genelinde kamuya açık şarj noktası sayısı <strong>6.4 milyon adede</strong> ulaştı (Asya-Pasifik: 5.0 milyon, Avrupa: 1.1 milyon, Amerika: 0.3 milyon). 2025'te kurulan yeni halka açık şarj noktası sayısı yaklaşık 1.1 milyon olarak kaydedildi (önceki iki yıl 1.3 milyon seviyesindeydi).
</p>

<p class="mb-4 text-gray-700 leading-relaxed">
  Roland Berger uzmanları bu durumun bir geri çekilme değil, <strong>pazar olgunlaşması</strong> olduğunun altını çiziyor. Başlangıçta kapsama alanı yaratmak amacıyla yapılan kitlesel AC (yavaş) kurulumların yerini, yüksek enerji transferi sağlayan <strong>DC Hızlı ve Ultra Hızlı (150 kW+) şarj istasyonları</strong> alıyor:
</p>

<div class="overflow-x-auto my-6">
  <table class="w-full text-left text-sm text-gray-600 border border-gray-200 rounded-xl overflow-hidden shadow-sm">
    <thead class="bg-gray-100 text-gray-900 font-bold uppercase text-xs">
      <tr>
        <th class="p-3.5 border-b">Bölge / Ülke</th>
        <th class="p-3.5 border-b">Hızlı Şarj Payı (>22 kW)</th>
        <th class="p-3.5 border-b">Soket Başına Düşen Araç</th>
        <th class="p-3.5 border-b">Trend Özeti</th>
      </tr>
    </thead>
    <tbody class="divide-y divide-gray-100">
      <tr class="hover:bg-gray-50">
        <td class="p-3.5 font-semibold text-gray-900">🇨🇳 Çin</td>
        <td class="p-3.5 text-emerald-700 font-bold">%48</td>
        <td class="p-3.5">11 Araç / Soket</td>
        <td class="p-3.5">Ultra hızlı DC koridorları ve megavat seviyesinde şarj parkları.</td>
      </tr>
      <tr class="hover:bg-gray-50">
        <td class="p-3.5 font-semibold text-gray-900">🇪🇺 Batı & Doğu Avrupa</td>
        <td class="p-3.5 font-medium">%20 - %45</td>
        <td class="p-3.5">14 Araç / Soket</td>
        <td class="p-3.5">Hızlı şarj soketlerinin %50'sinden fazlası 150 kW+ ultra hızlı güce yükseltildi.</td>
      </tr>
      <tr class="hover:bg-gray-50">
        <td class="p-3.5 font-semibold text-gray-900">🇹🇷 Türkiye</td>
        <td class="p-3.5 text-emerald-700 font-bold">Yüksek DC Oranı</td>
        <td class="p-3.5 font-semibold text-emerald-800">13 Araç / Soket</td>
        <td class="p-3.5">Karayolları ve otoyol dinlenme tesislerinde DC ağırlıklı hızlı yayılım.</td>
      </tr>
      <tr class="hover:bg-gray-50">
        <td class="p-3.5 font-semibold text-gray-900">🇺🇸 Kuzey Amerika</td>
        <td class="p-3.5 font-medium">%28</td>
        <td class="p-3.5 text-amber-700 font-semibold">33 Araç / Soket</td>
        <td class="p-3.5">NACS standardına geçiş süreci ve federal fon gecikmeleriyle altyapı açığı sürüyor.</td>
      </tr>
    </tbody>
  </table>
</div>

<div class="my-8 rounded-2xl overflow-hidden border border-gray-200 shadow-sm bg-white p-2">
  <img 
    src="/images/roland-berger-2026/roland_berger_fig_p17.png" 
    alt="Halka Açık Şarj Soketi Başına Düşen Araç Sayıları - Roland Berger 2026" 
    class="w-full rounded-xl object-contain"
  />
  <p class="text-center text-xs text-gray-500 mt-2 italic">
    Grafik 3: Kamuya açık şarj istasyonu başına düşen elektrikli araç sayıları (Kaynak: Roland Berger EV Charging Index 2026)
  </p>
</div>

<h2 class="text-2xl font-bold text-gray-900 mt-10 mb-4 flex items-center gap-2">
  <span class="w-2.5 h-6 bg-emerald-600 rounded-full inline-block"></span>
  4. PHEV (Plug-in Hibrit) Sürprizi ve Tarife Stratejisi
</h2>

<p class="mb-4 text-gray-700 leading-relaxed">
  Daha önce sektör analistleri tarafından ara bir geçiş teknolojisi olarak görülüp payının hızla azalacağı tahmin edilen <strong>Şarj Edilebilir Hibrit Araçlar (PHEV)</strong>, 2025-2026 döneminde beklenmedik bir yükseliş yaşadı.
</p>
<p class="mb-4 text-gray-700 leading-relaxed">
  Avrupa'da PHEV'lerin toplam EV satışları içindeki payı <strong>%7'den %10'a fırladı</strong>. Raporda bu artışın en önemli nedenlerinden birinin jeopolitik ve ticari dinamikler olduğu vurgulanıyor: Avrupa Birliği'nin Çin menşeli tam elektrikli araçlara (BEV) getirdiği ek gümrük tarifelerinden muaf tutulan <strong>Çinli üreticiler, Avrupa pazarında PHEV modellerine ağırlık vererek Avrupa PHEV pazarının yaklaşık %20'sini ele geçirdi</strong>.
</p>

<h2 class="text-2xl font-bold text-gray-900 mt-10 mb-4 flex items-center gap-2">
  <span class="w-2.5 h-6 bg-emerald-600 rounded-full inline-block"></span>
  5. Sürücüler Şarj İstasyonlarında Ne İstiyor? (Memnuniyet Anketi Sonuçları)
</h2>

<p class="mb-4 text-gray-700 leading-relaxed">
  Roland Berger EV Charging Index küresel kullanıcı anketinde, sürücülerin şarj deneyiminde en çok şikayet ettiği ve geliştirilmesini beklediği konular sıralandı:
</p>

<div class="space-y-3 my-6">
  <div class="bg-gray-50 border border-gray-200 rounded-xl p-4 flex items-center justify-between">
    <span class="text-gray-800 font-medium text-sm">⏱️ Şarj süresinin uzunluğu / Düşük güç kapasitesi</span>
    <span class="font-extrabold text-emerald-700 text-base">%47</span>
  </div>
  <div class="bg-gray-50 border border-gray-200 rounded-xl p-4 flex items-center justify-between">
    <span class="text-gray-800 font-medium text-sm">🔌 Halka açık şarj istasyonu sayısının yetersizliği</span>
    <span class="font-extrabold text-emerald-700 text-base">%45</span>
  </div>
  <div class="bg-gray-50 border border-gray-200 rounded-xl p-4 flex items-center justify-between">
    <span class="text-gray-800 font-medium text-sm">🔄 Soket / fiş tipinin ve protokollerin tüm araç modelleriyle uyumsuzluğu</span>
    <span class="font-extrabold text-gray-700 text-base">%28</span>
  </div>
  <div class="bg-gray-50 border border-gray-200 rounded-xl p-4 flex items-center justify-between">
    <span class="text-gray-800 font-medium text-sm">☕ Şarj sırasında yeme-içme, dinlenme ve sosyal tesis eksikliği</span>
    <span class="font-extrabold text-gray-700 text-base">%25</span>
  </div>
  <div class="bg-gray-50 border border-gray-200 rounded-xl p-4 flex items-center justify-between">
    <span class="text-gray-800 font-medium text-sm">🚫 Arızalı şarj cihazları ve benzinli araçların şarj yerlerini işgali (ICEing)</span>
    <span class="font-extrabold text-gray-700 text-base">%25</span>
  </div>
</div>

<div class="my-8 rounded-2xl overflow-hidden border border-gray-200 shadow-sm bg-white p-2">
  <img 
    src="/images/roland-berger-2026/roland_berger_fig_p14.png" 
    alt="Sürücülerin Şarj Deneyiminde En Çok Şikayet Ettiği Konular - Roland Berger Anketi" 
    class="w-full rounded-xl object-contain"
  />
  <p class="text-center text-xs text-gray-500 mt-2 italic">
    Grafik 4: Küresel elektrikli araç sürücülerinin şarj altyapısı memnuniyet ve talep analizi (Kaynak: Roland Berger / Potloc Survey 2025)
  </p>
</div>

<h2 class="text-2xl font-bold text-gray-900 mt-10 mb-4 flex items-center gap-2">
  <span class="w-2.5 h-6 bg-emerald-600 rounded-full inline-block"></span>
  Sonuç ve 2026-2030 Projeksiyonu: Şarj Operatörlerini Neler Bekliyor?
</h2>

<p class="mb-4 text-gray-700 leading-relaxed">
  Roland Berger EV Charging Index 2026, elektrikli mobilite ekosisteminin dönüm noktalarından birini işaret ediyor. Çin'in %50 pazar payı ve uygun maliyetli LFP batarya teknolojileriyle küresel standartları belirlediği bu dönemde; Batı dünyasında şarj istasyonu işletmecilerinin (CPO) başarı kriteri salt istasyon sayısı değil; <strong>yüksek kullanım oranı (utilization rate), 150 kW+ ultra hızlı şarj gücü, kesintisiz şebeke entegrasyonu ve istasyon içi müşteri deneyimi</strong> olacak.
</p>

<div class="border-t border-gray-200 pt-6 mt-10 bg-slate-50 p-6 rounded-2xl">
  <h4 class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Kaynak ve Metodoloji Bildirimi</h4>
  <p class="text-xs text-gray-600 leading-relaxed mb-1">
    <strong>Kaynak Rapor:</strong> <em>EV Charging Index 2026 – Currents of Change: Global EV Adoption and Charging Infrastructure: Findings and Trends</em> (Temmuz 2026)
  </p>
  <p class="text-xs text-gray-600 leading-relaxed mb-0">
    <strong>Yayımcı:</strong> Roland Berger GmbH (Münih, Almanya) • Katkıda Bulunan Veri Kuruluşları: Eco-Movement, Mobility Global, EV-Volumes, Euromonitor, EAFO, Uluslararası Enerji Ajansı (IEA) ve Potloc Tüketici Araştırmaları.
  </p>
</div>
`;

    if (existing) {
      await db.article.update({
        where: { id: existing.id },
        data: {
          title,
          summary,
          content,
          imageUrl,
          categoryId: category.id,
          publishedAt: new Date(),
          isFeatured: true,
        },
      });
      console.log('Roland Berger 2026 article updated successfully with images!');
    } else {
      await db.article.create({
        data: {
          title,
          summary,
          slug,
          content,
          imageUrl,
          categoryId: category.id,
          publishedAt: new Date(),
          isFeatured: true,
        },
      });
      console.log('Roland Berger 2026 article created successfully with images!');
    }
  } catch (err) {
    console.error('Error ensuring Roland Berger article:', err);
  }
}
