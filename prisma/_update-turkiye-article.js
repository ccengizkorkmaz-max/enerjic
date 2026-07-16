const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("=== Updating Türkiye EV Article with Extended Content ===");

  const slug = 'turkiye-avrupanin-en-buyuk-4-elektrikli-arac-pazari-oldu-iea-2026';

  const newTitle = "Türkiye, Avrupa'nın En Büyük 4. Elektrikli Araç Pazarı Oldu: 2026 Küresel Raporlarının Çarpıcı Sonuçları";
  const newSummary = "Uluslararası Enerji Ajansı (IEA) ve Our World in Data verilerine göre Türkiye, 2025 yılında 240.000 adede ulaşan elektrikli araç satışı ve %22'lik pazar payıyla Avrupa'nın en büyük 4. pazarı oldu. İşte Togg, BYD ve diğer ülkelerle karşılaştırmalı tüm veriler.";

  const newContent = `<p>Elektrikli araç dünyasında kartlar yeniden dağıtılıyor ve Türkiye, bu köklü dönüşümün en dikkat çekici başarı hikâyelerinden birini yazıyor.</p>

<p>Uluslararası Enerji Ajansı'nın (IEA) Haziran 2026'da yayınladığı <strong>Global EV Outlook 2026</strong> raporuna göre, dünya genelinde 2025 yılında satılan otomobillerin yaklaşık %25'i elektrikli oldu. Küresel elektrikli araç satışları <strong>20 milyonu</strong> aştı ve yollardaki toplam EV stoku <strong>70 milyona</strong> yaklaştı. Peki bu devasa küresel dönüşümde Türkiye nerede duruyor?</p>

<p>Cevap, dünya otomotiv tarihinin en hızlı geçişlerinden birinde gizli.</p>

<h2>Türkiye Avrupa'nın Zirvesine Oynuyor: En Büyük 4. Pazar</h2>

<p>IEA verileri ve Our World in Data (OWID) küresel elektrikli araç veritabanından derlenen en güncel istatistiklere göre, Türkiye'deki elektrikli otomobil satışları 2025 yılında tarihi bir rekor kırarak <strong>yaklaşık 240.000 adede</strong> ulaştı. Bu rakam, 2024 yılındaki 108.000 adetlik satışın iki katından fazlasına denk geliyor ve Türkiye'yi küresel EV büyüme liginin en tepesine taşıyor.</p>

<p>Bu muazzam büyüme ile birlikte Türkiye; <strong>Almanya (~850.000), Birleşik Krallık (~530.000) ve Fransa (~450.000)</strong> gibi köklü otomotiv devlerinin ardından <strong>Avrupa'nın en büyük 4. elektrikli araç pazarı</strong> konumuna yükseldi. İtalya, İspanya, Hollanda ve İsveç gibi geleneksel olarak güçlü otomotiv pazarları, mutlak satış adetlerinde Türkiye'nin gerisinde kaldı.</p>

<div style="background:linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%); border-left:4px solid #047857; padding:1.25rem 1.5rem; border-radius:0 12px 12px 0; margin:1.5rem 0;"><p style="margin:0; font-weight:600; color:#065f46; font-size:1rem; line-height:1.7;">Türkiye'de 2025 yılında satılan her 100 yeni otomobilden 22'si elektrikli (BEV veya PHEV) modellerden oluştu. 2022 yılında bu oranın sadece %1 seviyesinde olduğu düşünülürse, üç yıl gibi kısa bir sürede %1'den %22'ye sıçrama — dünya otomotiv endüstrisinin en hızlı dönüşüm hikâyelerinden biridir.</p></div>

<h2>Gelişmekte Olan Ülkeler Arasında Tartışmasız Lider</h2>

<p>Our World in Data platformundaki karşılaştırmalı veriler, Türkiye'nin kendi gelir grubundaki ve gelişmekte olan diğer büyük ekonomiler (EMDEs) arasında ne kadar fark açtığını net bir şekilde ortaya koyuyor.</p>

<p>2025 yılı itibarıyla elektrikli araç pazar payları karşılaştırıldığında tablo şu şekilde:</p>

<table style="width:100%; border-collapse:collapse; margin:1.5rem 0; font-size:0.95rem;"><thead><tr><th style="text-align:left; padding:0.75rem; border-bottom:2px solid #047857; font-weight:700; color:#111827;">Ülke</th><th style="text-align:left; padding:0.75rem; border-bottom:2px solid #047857; font-weight:700; color:#111827;">EV Pazar Payı</th><th style="text-align:left; padding:0.75rem; border-bottom:2px solid #047857; font-weight:700; color:#111827;">2025 Satış Adedi (Yaklaşık)</th></tr></thead><tbody><tr><td style="padding:0.75rem; border-bottom:1px solid #e5e7eb;"><strong>Türkiye</strong></td><td style="padding:0.75rem; border-bottom:1px solid #e5e7eb;"><strong>%22</strong></td><td style="padding:0.75rem; border-bottom:1px solid #e5e7eb;"><strong>~240.000</strong></td></tr><tr><td style="padding:0.75rem; border-bottom:1px solid #e5e7eb;">Brezilya</td><td style="padding:0.75rem; border-bottom:1px solid #e5e7eb;">%9</td><td style="padding:0.75rem; border-bottom:1px solid #e5e7eb;">~180.000</td></tr><tr><td style="padding:0.75rem; border-bottom:1px solid #e5e7eb;">Meksika</td><td style="padding:0.75rem; border-bottom:1px solid #e5e7eb;">%7</td><td style="padding:0.75rem; border-bottom:1px solid #e5e7eb;">~95.000</td></tr><tr><td style="padding:0.75rem; border-bottom:1px solid #e5e7eb;">Hindistan</td><td style="padding:0.75rem; border-bottom:1px solid #e5e7eb;">%4</td><td style="padding:0.75rem; border-bottom:1px solid #e5e7eb;">~165.000</td></tr><tr><td style="padding:0.75rem; border-bottom:1px solid #e5e7eb;">Güney Afrika</td><td style="padding:0.75rem; border-bottom:1px solid #e5e7eb;">&lt;%1</td><td style="padding:0.75rem; border-bottom:1px solid #e5e7eb;">&lt;5.000</td></tr></tbody></table>

<p>Türkiye, pazar payı bakımından Hindistan'ı 5,5'e, Brezilya'yı ise 2,5'e katlamış durumda. Üstelik bu liderlik sadece oransal değil, mutlak satış adetlerinde de geçerli: Türkiye, Brezilya ve Hindistan gibi çok daha büyük nüfuslu pazarları bile geride bıraktı.</p>

<h2>BEV Odaklılık: Türkiye'nin Farkı</h2>

<p>Türkiye'nin EV pazarını diğer gelişmekte olan ülkelerden ayıran en büyük özellik, <strong>tamamen elektrikli araç (BEV) tercihi</strong>. Brezilya ve Meksika gibi ülkelerde satılan elektrikli araçların neredeyse yarısı şarj edilebilir hibrit (PHEV) modellerden oluşurken, <strong>Türkiye'de satılan elektrikli araçların %80'inden fazlası tamamen elektrikli (BEV)</strong> modeller.</p>

<p>Yerli otomobilimiz <strong>Togg T10X</strong> ve <strong>Tesla Model Y</strong> gibi popüler tam elektrikli modeller bu tercihin ana sürükleyicileri. BEV ağırlıklı bir pazar yapısı, Türkiye'nin kamuya açık hızlı şarj altyapısına (DC) olan ihtiyacını diğer ülkelere kıyasla çok daha kritik hale getiriyor.</p>

<h2>Togg, BYD ve Pazar Rekabeti Kızışıyor</h2>

<p>IEA ve BloombergNEF verilerine göre Türkiye'deki yerli üretim gücü ve rekabet dinamikleri hızla değişiyor:</p>

<ul>
<li><strong>Togg</strong> 2025 yılında satışlarını bir önceki yıla göre <strong>%30 oranında</strong> artırmayı başardı. Ancak pazara giren güçlü ithal markalar — özellikle <strong>BYD</strong>, <strong>Tesla</strong> ve diğer Çinli üreticiler — Togg'un pazar payını 2024'teki %30 seviyesinden 2025'te <strong>%15 civarına</strong> dengeledi.</li>
<li>Bu durum, pazarın tekelleşmekten çıkıp <strong>sağlıklı bir rekabet yapısına</strong> kavuştuğunun göstergesi. Tüketici için daha fazla seçenek, daha iyi fiyatlar ve daha hızlı teknoloji gelişimi demek.</li>
<li>ÖTV matrah limitlerindeki 2025 Temmuz güncellemesi pazarda geçici dalgalanma yaratsa da, Aralık 2025'teki aylık satışlar <strong>30.000 adetlik rekor seviyelere</strong> ulaşarak talebin yapısal ve kalıcı olduğunu gösterdi.</li>
</ul>

<h2>Şarj Altyapısında Dünya Standartlarının Üzerindeyiz</h2>

<p>Roland Berger tarafından hazırlanan <strong>EV Charging Index 2025</strong> raporuna göre Türkiye, şarj altyapısı kurulum hızında <strong>dünyanın en hızlı gelişen pazarlarından biri</strong> olarak tescillendi. IEA verilerine göre dünya genelinde kamuya açık şarj noktası sayısı 2025 sonunda <strong>4,5 milyonu</strong> aştı — bir önceki yıla göre %30'luk bir artış.</p>

<p>Türkiye'de ise:</p>
<ul>
<li>İstasyon başına düşen araç oranı dengelidir</li>
<li>Kullanıcı memnuniyeti (şarj istasyonu bulma kolaylığı ve ödeme yöntemleri) <strong>%90'ın üzerinde</strong> seyretmektedir</li>
<li>Ancak yollardaki tam elektrikli araç stoğunun hızla artması nedeniyle, şehirlerarası otoyollarda <strong>150 kW ve üzeri ultra-hızlı DC şarj noktalarının</strong> sayısının 2026 boyunca ikiye katlanması gerektiği vurgulanmaktadır</li>
</ul>

<h2>Sonuç: Türkiye Global Enerji Dönüşümünün Yükselen Yıldızı</h2>

<p>Tüm bu veriler tek bir gerçeğe işaret ediyor: Türkiye, elektrikli mobilite devriminde artık bir "izleyici" değil, <strong>aktif bir şekillendirici</strong>. Yerli üretim kapasitesi (Togg), güçlü tüketici talebi, hızla genişleyen şarj altyapısı ve uluslararası markaların artan ilgisiyle Türkiye, 2030 yılına kadar Avrupa'nın en büyük 3. EV pazarı olma potansiyelini taşıyor.</p>

<p>Bu, sadece otomotiv sektörü için değil; enerji, teknoloji, finans ve altyapı yatırımları için de devasa fırsatların kapısını aralıyor.</p>

<h2>Referanslar ve Kaynak Bilgisi</h2>

<p>Bu makaledeki veriler aşağıdaki resmi ve bağımsız kurumların 2025-2026 raporlarından derlenmiştir:</p>

<ul>
<li><strong>Uluslararası Enerji Ajansı (IEA):</strong> <a href="https://www.iea.org/reports/global-ev-outlook-2026" style="color:#047857; text-decoration:underline;" target="_blank" rel="noopener noreferrer">Global EV Outlook 2026 Report</a></li>
<li><strong>Our World in Data (OWID):</strong> <a href="https://ourworldindata.org/electric-car-sales" style="color:#047857; text-decoration:underline;" target="_blank" rel="noopener noreferrer">Tracking Global Data on Electric Vehicles — Hannah Ritchie, Haziran 2026</a></li>
<li><strong>BloombergNEF (BNEF):</strong> <a href="https://about.bnef.com/electric-vehicle-outlook/" style="color:#047857; text-decoration:underline;" target="_blank" rel="noopener noreferrer">Electric Vehicle Outlook 2026 Executive Summary</a></li>
<li><strong>Roland Berger:</strong> <a href="https://www.rolandberger.com/en/Insights/Publications/EV-Charging-Index-Steady-progress.html" style="color:#047857; text-decoration:underline;" target="_blank" rel="noopener noreferrer">Global EV Charging Index — Edition 6, 2025 Study</a></li>
</ul>`;

  // Try to find the article by slug
  const existing = await prisma.article.findUnique({ where: { slug } });

  if (existing) {
    await prisma.article.update({
      where: { slug },
      data: {
        title: newTitle,
        summary: newSummary,
        content: newContent,
      },
    });
    console.log("✅ Article updated successfully with extended content!");
  } else {
    console.log("❌ Article with slug '" + slug + "' not found in database.");
  }

  await prisma.$disconnect();
}

main().catch(e => { console.error(e); prisma.$disconnect(); });
