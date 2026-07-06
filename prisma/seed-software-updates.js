const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("=== Seeding EV Software Updates ===");

  const updates = [
    // ─────────── TESLA ───────────
    {
      brand: 'Tesla',
      model: null,
      version: '2026.20.6.1',
      previousVersion: '2026.18',
      updateType: 'major',
      title: 'FSD Uygulama Entegrasyonu ve Kör Nokta Uyarısı',
      changelog: '<p>Tesla\'nın en son büyük güncellemesi, Full Self-Driving (FSD) özelliğinin mobil uygulamayla entegrasyonunu ve genişletilmiş güvenlik özelliklerini içeriyor.</p><h3>Yenilikler</h3><ul><li><strong>FSD Uygulama Entegrasyonu:</strong> FSD aktifken Tesla mobil uygulaması harita üzerinde mavi rota çizgisi gösteriyor. Aracınızı başkası kullanırken sürüş modunu uzaktan izleyebilirsiniz.</li><li><strong>Kör Nokta Uyarısı (Park):</strong> Kapı açılırken arkadan yaklaşan bisikletli veya araç algılandığında sesli uyarı verilip kapı açılması geciktiriliyor.</li><li><strong>Sistem Kararlılığı:</strong> Bağlantı optimizasyonları ve genel performans iyileştirmeleri.</li></ul>',
      highlights: JSON.stringify(['FSD Mobil Takip', 'Kör Nokta Uyarısı', 'Kapı Güvenliği']),
      releaseDate: new Date('2026-06-28'),
      sourceUrl: 'https://www.tesla.com/support/software-updates',
      sourceName: 'Tesla Resmi Destek',
      isSecurityFix: false,
    },
    {
      brand: 'Tesla',
      model: null,
      version: '2026.18',
      previousVersion: '2026.14',
      updateType: 'minor',
      title: 'Sürüş Profili İyileştirmeleri ve Kabin Deneyimi',
      changelog: '<p>Bu güncelleme sürüş profillerinin daha hassas özelleştirilebilmesini ve kabin içi deneyimin iyileştirilmesini hedefliyor.</p><ul><li><strong>Sürüş Profili:</strong> Direksiyon ağırlığı, rejeneratif frenleme ve ivmelenme tepkisinin profil bazında kaydedilmesi.</li><li><strong>Klima Optimizasyonu:</strong> Isı pompası kontrolünde enerji verimliliği artışı ve soğuk hava performansı iyileştirmesi.</li><li><strong>Medya:</strong> Spotify ve Apple Music arayüzünde küçük tasarım güncellemeleri.</li></ul>',
      highlights: JSON.stringify(['Sürüş Profili', 'Isı Pompası Verimliliği', 'Medya Arayüzü']),
      releaseDate: new Date('2026-05-12'),
      sourceUrl: 'https://www.tesla.com/support/software-updates',
      sourceName: 'Tesla Resmi Destek',
      isSecurityFix: false,
    },
    {
      brand: 'Tesla',
      model: null,
      version: '2026.14',
      previousVersion: '2026.8',
      updateType: 'patch',
      title: 'Park Asistanı Güncellemesi ve Hata Düzeltmeleri',
      changelog: '<p>Park asistanı algoritmalarında iyileştirmeler ve çeşitli hata düzeltmeleri içeren bakım güncellemesi.</p><ul><li><strong>Park Asistanı:</strong> Dar alanlarda manevra hassasiyeti artırıldı.</li><li><strong>Şarj Planlama:</strong> Rota üzerinde şarj istasyonu önerilerinde doğruluk iyileştirmesi.</li><li><strong>Hata Düzeltmeleri:</strong> Ekran donma ve Bluetooth bağlantı sorunlarına yönelik düzeltmeler.</li></ul>',
      highlights: JSON.stringify(['Park Asistanı', 'Şarj Planlama', 'Hata Düzeltme']),
      releaseDate: new Date('2026-03-20'),
      sourceUrl: 'https://www.tesla.com/support/software-updates',
      sourceName: 'Tesla Resmi Destek',
      isSecurityFix: false,
    },

    // ─────────── TOGG ───────────
    {
      brand: 'Togg',
      model: 'T10X',
      version: 'TruOS 2.1',
      previousVersion: 'TruOS 1.7.2',
      updateType: 'major',
      title: 'T10F Uyumlu Yeni Arayüz ve BDCC Entegrasyonu',
      changelog: '<p>Togg\'un en kapsamlı yazılım güncellemesi, T10X modellerini T10F sedan ile ortak altyapıya geçiriyor. "v2" olarak adlandırılan bu güncelleme hem donanım hem de yazılım tarafında önemli değişiklikler içeriyor.</p><h3>Yenilikler</h3><ul><li><strong>BDCC Modülü:</strong> Body Domain Controller ile kilitler, camlar, aydınlatma ve iklimlendirme merkezi yapıda birleştirildi.</li><li><strong>Yeni Arayüz:</strong> T10F ile ortak kullanıcı arayüzü tasarımı ve yeni ekran temaları.</li><li><strong>Hızlı Açılış:</strong> "Beklemede" (standby) modu kaldırılarak sistem açılış hızı dramatik şekilde artırıldı.</li><li><strong>Otomatik Kilit:</strong> Araçtan uzaklaşıldığında otomatik kapı kilitleme özelliği eklendi.</li></ul>',
      highlights: JSON.stringify(['BDCC Entegrasyonu', 'Yeni Arayüz', 'Hızlı Açılış', 'Oto Kilit']),
      releaseDate: new Date('2026-06-15'),
      sourceUrl: 'https://trumore.togg.com.tr/',
      sourceName: 'Togg Trumore',
      isSecurityFix: false,
    },
    {
      brand: 'Togg',
      model: 'T10X',
      version: 'TruOS 1.7.2',
      previousVersion: 'TruOS 1.6',
      updateType: 'minor',
      title: 'Yüz Tanıma ve Yorgunluk Algılama İyileştirmesi',
      changelog: '<p>TruOS 1.7.2, bilgi-eğlence sistemi ve sürücü güvenlik özelliklerinde iyileştirmeler getiriyor.</p><ul><li><strong>Yüz Tanıma:</strong> Sürücü yüz tanıma performansı artırıldı, farklı ışık koşullarında daha güvenilir çalışma sağlandı.</li><li><strong>Yorgunluk Algılama:</strong> Sürücü yorgunluk algılama sistemi hassasiyeti iyileştirildi.</li><li><strong>Navigasyon:</strong> Harita güncelleme hızı ve rota hesaplama doğruluğu artırıldı.</li></ul>',
      highlights: JSON.stringify(['Yüz Tanıma', 'Yorgunluk Algılama', 'Navigasyon']),
      releaseDate: new Date('2026-03-10'),
      sourceUrl: 'https://trumore.togg.com.tr/',
      sourceName: 'Togg Trumore',
      isSecurityFix: false,
    },
    {
      brand: 'Togg',
      model: 'T10X',
      version: 'TruOS 1.6',
      previousVersion: 'TruOS 1.5',
      updateType: 'patch',
      title: 'Standby Modu Kaldırma ve Sistem Optimizasyonu',
      changelog: '<p>Sistem performansını artırmaya yönelik optimizasyon güncellemesi.</p><ul><li><strong>Standby Kaldırma:</strong> Bekleme modunda harcanan enerji minimize edildi ve açılış süresi kısaltıldı.</li><li><strong>Ekran Temaları:</strong> Yeni karanlık mod varyasyonları eklendi.</li><li><strong>Bluetooth:</strong> Cihaz eşleştirme kararlılığı artırıldı.</li></ul>',
      highlights: JSON.stringify(['Standby Optimizasyonu', 'Yeni Temalar', 'Bluetooth İyileştirme']),
      releaseDate: new Date('2025-12-08'),
      sourceUrl: 'https://trumore.togg.com.tr/',
      sourceName: 'Togg Trumore',
      isSecurityFix: false,
    },

    // ─────────── BMW ───────────
    {
      brand: 'BMW',
      model: null,
      version: '03/2026',
      previousVersion: '11/2025',
      updateType: 'major',
      title: 'Proaktif Navigasyon ve Akıllı Bagaj Güncellemesi',
      changelog: '<p>BMW\'nin 2026 yılı ilk büyük OTA güncellemesi, yapay zeka destekli navigasyon ve araç kontrol iyileştirmeleri içeriyor.</p><ul><li><strong>Proaktif Navigasyon:</strong> AI destekli sistem, sık ziyaret edilen lokasyonları daha güvenilir hatırlıyor ve ara duraklar (örn. kahve molaları) otomatik öneriliyor.</li><li><strong>Akıllı Bagaj (Smart Opener):</strong> Arka tampon altındaki ayakla açma sensörü daha hassas hale getirildi.</li><li><strong>EV Rota Optimizasyonu:</strong> Elektrikli modeller için şarj istasyonu planlama doğruluğu artırıldı.</li><li><strong>Kararlılık:</strong> Mobil cihaz bağlantı optimizasyonları ve genel hata düzeltmeleri.</li></ul>',
      highlights: JSON.stringify(['AI Navigasyon', 'Akıllı Bagaj', 'EV Rota Planlama']),
      releaseDate: new Date('2026-03-01'),
      sourceUrl: 'https://www.bmw.com/en/innovation/software-updates.html',
      sourceName: 'BMW Remote Software Upgrade',
      isSecurityFix: false,
    },
    {
      brand: 'BMW',
      model: null,
      version: '11/2025',
      previousVersion: '07/2025',
      updateType: 'minor',
      title: 'EV Rota Optimizasyonu ve Kabin Güncellemesi',
      changelog: '<p>2025 yılının son büyük güncellemesi, elektrikli modellerdeki şarj planlaması ve kabin deneyimi iyileştirmelerine odaklanıyor.</p><ul><li><strong>Şarj Planlama:</strong> Rota üzerindeki şarj istasyonu önerilerinde gerçek zamanlı doluluk bilgisi entegrasyonu.</li><li><strong>Klima Ön Koşullandırma:</strong> Zamanlayıcı üzerinden batarya ve kabin ön ısıtma iyileştirmesi.</li><li><strong>Digital Key Plus:</strong> Ultra-wideband araç kilit açma güvenilirliği artırıldı.</li></ul>',
      highlights: JSON.stringify(['Şarj Planlama', 'Klima Ön Koşullandırma', 'Digital Key Plus']),
      releaseDate: new Date('2025-11-01'),
      sourceUrl: 'https://www.bmw.com/en/innovation/software-updates.html',
      sourceName: 'BMW Remote Software Upgrade',
      isSecurityFix: false,
    },

    // ─────────── BYD ───────────
    {
      brand: 'BYD',
      model: null,
      version: 'V2.2.0',
      previousVersion: 'V2.1.0',
      updateType: 'major',
      title: 'Profil Yönetimi, Sesli Asistan ve CarPlay İyileştirmesi',
      changelog: '<p>BYD\'nin Haziran 2026 OTA güncellemesi, Atto 3, Seal ve diğer modelleri kapsayan geniş kapsamlı bir güncelleme.</p><ul><li><strong>Profil Yönetimi:</strong> Farklı sürücüler için koltuk, ayna ve klima ayarlarını kaydeden profil sistemi.</li><li><strong>BYD Asistan:</strong> Direksiyondaki butonlarla sesli asistan kontrolü ve sesli klima komutları eklendi.</li><li><strong>Apple CarPlay / Android Auto:</strong> Bağlantı kararlılığı ve başlatma hızı iyileştirildi.</li><li><strong>Navigasyon:</strong> Harita arayüzü güncellendi ve trafik bilgisi doğruluğu artırıldı.</li></ul>',
      highlights: JSON.stringify(['Profil Yönetimi', 'Sesli Asistan', 'CarPlay/Android Auto']),
      releaseDate: new Date('2026-06-01'),
      sourceUrl: 'https://www.byd.com/eu/support',
      sourceName: 'BYD Resmi Destek',
      isSecurityFix: false,
    },
    {
      brand: 'BYD',
      model: null,
      version: 'V2.1.0',
      previousVersion: 'V2.0.0',
      updateType: 'minor',
      title: 'Batarya Ön Isıtma ve Şarj Planlaması',
      changelog: '<p>Kış aylarında batarya performansını artırmaya yönelik önemli bir güncelleme.</p><ul><li><strong>Batarya Ön Isıtma:</strong> Soğuk havalarda şarj öncesi otomatik batarya ısıtma özelliği eklendi, şarj verimliliği önemli ölçüde artırıldı.</li><li><strong>Şarj Planlaması:</strong> Ucuz elektrik saatlerinde otomatik şarj başlatma zamanlayıcısı.</li><li><strong>Enerji Tüketimi Ekranı:</strong> Detaylı enerji tüketimi grafiklerinde iyileştirme.</li></ul>',
      highlights: JSON.stringify(['Batarya Ön Isıtma', 'Şarj Planlaması', 'Enerji Grafiği']),
      releaseDate: new Date('2026-02-15'),
      sourceUrl: 'https://www.byd.com/eu/support',
      sourceName: 'BYD Resmi Destek',
      isSecurityFix: false,
    },

    // ─────────── RIVIAN ───────────
    {
      brand: 'Rivian',
      model: 'R1T / R1S',
      version: '2026.15',
      previousVersion: '2026.07',
      updateType: 'major',
      title: 'AI Rivian Asistan ve Sesli Kontrol',
      changelog: '<p>Rivian\'ın 2026 yılının en önemli güncellemesi, yapay zeka destekli sesli asistan özelliğini getiriyor.</p><ul><li><strong>Rivian Asistan:</strong> AI destekli sesli asistan ile araç ayarları, klima, navigasyon, medya ve mesajlaşma kontrolü.</li><li><strong>Doğal Dil İşleme:</strong> "Klimayı 22 dereceye ayarla" veya "En yakın şarj istasyonuna git" gibi doğal cümlelerle komut verme.</li><li><strong>Launch Mode:</strong> Daha fazla R1 varyantına genişletildi.</li><li><strong>Apple Watch:</strong> Apple Watch ile araç kilitleme, ön koşullandırma ve şarj durumu izleme.</li></ul>',
      highlights: JSON.stringify(['AI Sesli Asistan', 'Doğal Dil Kontrolü', 'Apple Watch', 'Launch Mode']),
      releaseDate: new Date('2026-05-20'),
      sourceUrl: 'https://rivian.com/support/software-updates',
      sourceName: 'Rivian Support',
      isSecurityFix: false,
    },
    {
      brand: 'Rivian',
      model: 'R1T / R1S',
      version: '2026.07',
      previousVersion: '2026.03',
      updateType: 'minor',
      title: 'Dolby Audio ve Apple Music Entegrasyonu',
      changelog: '<p>Medya ve bağlantı deneyimini iyileştiren güncelleme.</p><ul><li><strong>Dolby Audio:</strong> Apple Music için Dolby Spatial Audio desteği eklendi.</li><li><strong>Akış Kalitesi:</strong> Yeni streaming kalite ayarı ile veri kullanımını kontrol etme imkânı.</li><li><strong>Wi-Fi / Hücresel:</strong> Bağlantı geçiş kararlılığı iyileştirildi, tünel çıkışlarında daha hızlı yeniden bağlanma.</li></ul>',
      highlights: JSON.stringify(['Dolby Audio', 'Apple Music', 'Akış Kalitesi']),
      releaseDate: new Date('2026-03-05'),
      sourceUrl: 'https://rivian.com/support/software-updates',
      sourceName: 'Rivian Support',
      isSecurityFix: false,
    },

    // ─────────── FORD ───────────
    {
      brand: 'Ford',
      model: 'Mustang Mach-E / Explorer EV',
      version: 'BlueCruise 1.5',
      previousVersion: 'BlueCruise 1.4',
      updateType: 'major',
      title: 'Otomatik Şerit Değiştirme ve Gelişmiş Sürüş Asistanı',
      changelog: '<p>Ford\'un hands-free otoyol sürüş teknolojisi BlueCruise, 1.5 versiyonuyla büyük bir adım atıyor.</p><ul><li><strong>Otomatik Şerit Değiştirme:</strong> Trafik akışını korumak için araç kendi başına şerit değiştirebiliyor, sürücü müdahalesi gerektirmeden.</li><li><strong>Viraj Performansı:</strong> Virajlardaki sürüş kararlılığı ve takip hassasiyeti artırıldı.</li><li><strong>Şerit İçi Konumlandırma:</strong> Yan şeritteki büyük araçlardan otomatik uzaklaşma davranışı iyileştirildi.</li><li><strong>Genişleyen Kapsam:</strong> BlueCruise özelliği Puma, Kuga ve Ranger PHEV modellerine de açıldı.</li></ul>',
      highlights: JSON.stringify(['Oto Şerit Değiştirme', 'Viraj Performansı', 'Genişleyen Model Kapsamı']),
      releaseDate: new Date('2026-04-10'),
      sourceUrl: 'https://www.ford.com/technology/bluecruise/',
      sourceName: 'Ford BlueCruise',
      isSecurityFix: false,
    },
  ];

  let created = 0;
  let skipped = 0;

  for (const update of updates) {
    try {
      const existing = await prisma.softwareUpdate.findFirst({
        where: {
          brand: update.brand,
          version: update.version,
          model: update.model,
        },
      });

      if (existing) {
        skipped++;
        continue;
      }

      await prisma.softwareUpdate.create({ data: update });
      created++;
      console.log(`  ✓ ${update.brand} v${update.version}: ${update.title}`);
    } catch (err) {
      console.error(`  ✗ ${update.brand} v${update.version}: ${err.message}`);
    }
  }

  console.log(`\n=== Done: ${created} created, ${skipped} skipped ===`);
  await prisma.$disconnect();
}

main().catch(console.error);
