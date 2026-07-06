const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

function mdToHtml(md) {
  const lines = md.split(/\r?\n/);
  const result = [];
  let inList = false;

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i].trim();
    if (!line) {
      if (inList) {
        result.push('</ul>');
        inList = false;
      }
      continue;
    }

    if (line.startsWith('## ')) {
      if (inList) { result.push('</ul>'); inList = false; }
      result.push(`<h2>${line.slice(3)}</h2>`);
    } else if (line.startsWith('### ')) {
      if (inList) { result.push('</ul>'); inList = false; }
      result.push(`<h3>${line.slice(4)}</h3>`);
    } else if (line.startsWith('* ') || line.startsWith('- ')) {
      if (!inList) {
        result.push('<ul>');
        inList = true;
      }
      const content = line.replace(/^[\*\-]\s+/, '').trim();
      let formatted = content.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
      result.push(`<li>${formatted}</li>`);
    } else {
      if (inList) { result.push('</ul>'); inList = false; }
      let formatted = line.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
      result.push(`<p>${formatted}</p>`);
    }
  }

  if (inList) {
    result.push('</ul>');
  }

  return result.join('\n');
}

async function main() {
  console.log("=== Seeding 3 Electric Motorcycle Articles ===");

  // Fetch category IDs
  const categories = await prisma.category.findMany();
  const categoryMap = {};
  categories.forEach(cat => {
    categoryMap[cat.slug] = cat.id;
  });

  // Use 'elektrikli-araclar' category - motorcycles also fall under this umbrella
  const targetCategoryId = categoryMap['elektrikli-araclar'];

  if (!targetCategoryId) {
    console.error("Category 'elektrikli-araclar' not found!");
    await prisma.$disconnect();
    return;
  }

  const motorcycleArticles = [
    {
      title: "Elektrikli Motorsiklet Devrimi: Zero, Energica ve LiveWire ile Yeni Bir Çağ",
      slug: "elektrikli-motorsiklet-devrimi-zero-energica-livewire",
      summary: "Elektrikli motorsiklet pazarı artık sadece küçük scooterlardan ibaret değil. Zero SR/F, Energica Experia ve LiveWire Del Mar gibi modeller, performans ve menzil konusunda benzinli rakipleriyle ciddi bir rekabet içinde.",
      imageUrl: "https://images.unsplash.com/photo-1558980394-34764db076b4?auto=format&fit=crop&w=800&q=80",
      isFeatured: true,
      categoryId: targetCategoryId,
      content: mdToHtml(`## İki Tekerlekli Evrimin Sessiz Gücü

Elektrikli otomobiller kamuoyunun gündemine yerleşeli uzun zaman oldu, ancak iki tekerlekli dünyada yaşanan dönüşüm çoğu zaman gözden kaçıyor. Oysa elektrikli motorsiklet pazarı, son birkaç yılda hem teknoloji hem de model çeşitliliği açısından devasa bir sıçrama yaşadı. Bugün artık elektrikli motorsiklet denildiğinde akla yalnızca mahalle arası gezen sessiz scooterlar gelmiyor. Pistlerde içten yanmalı motorlarla yarışan, otoban hızlarında yüzlerce kilometre menzil sunan ve sürücüye tamamen dijital bir deneyim vadeden ciddi makineler sahneye çıktı.

Bu dönüşümün öncülerini tanımak, iki tekerlekli elektrikli geleceğin nereye gittiğini anlamak açısından kritik önem taşıyor.

## Zero SR/F — Sokağın Elektrikli Kralı

Amerikan üretici Zero Motorcycles, elektrikli motorsiklet dünyasının en köklü isimlerinden biri. Şirketin amiral gemisi SR/F modeli, 111 beygir gücü ve 190 Nm tork değerleriyle benzinli naked bike segmentindeki rakipleriyle birebir rekabet edebilecek kapasitede. 17.3 kWh kapasiteli batarya paketi, şehir içi kullanımda 260 kilometreyi aşan bir menzil sunuyor.

SR/F'i öne çıkaran detaylardan biri de Cypher III+ işletim sistemi. Bu dijital beyin, sürücünün tork haritasını, rejeneratif frenleme seviyesini ve hatta motor sesini bile kişiselleştirmesine olanak tanıyor. Bosch'un motosiklet stabilite kontrol sistemi (MSC) sayesinde virajlarda bile devreye giren ABS ve traksiyon kontrolü, güvenlik standartlarını üst düzeye taşıyor. Saatte 200 kilometreyi aşan hız kapasitesiyle SR/F, elektrikli motorsikletin performans sınırlarını her gün biraz daha ileriye taşıyor.

## Energica Experia — Uzun Yolun Elektrikli Şampiyonu

İtalyan üretici Energica, MotoE yarış serisinin tek tedarikçisi olarak zaten motorsporlarında kendini kanıtlamıştı. Experia modeli ise bu yarış DNA'sını uzun yol turizmine taşıyan cesur bir hamle. 22.5 kWh kapasiteli bataryasıyla sınıfının en büyük enerji deposuna sahip olan Experia, şehir içi kullanımda 420 kilometreyi aşan bir menzil vaat ediyor.

Experia'nın en dikkat çekici özelliği DC hızlı şarj desteği. CCS standardıyla uyumlu şarj altyapısı sayesinde batarya yüzde 0'dan yüzde 80'e yalnızca 40 dakikada ulaşabiliyor. Bu, bir mola kahvesi içerken motorsikletinizin yola devam etmeye hazır hale gelmesi anlamına geliyor. 112 litrelik bagaj kapasitesi, rüzgar korumalı fairing tasarımı ve ayarlanabilir ergonomik yapısı, bu motosikleti gerçek anlamda uzun mesafe turizminin elektrikli cevabı haline getiriyor.

## LiveWire S2 Del Mar — Şehrin Çevik Yıldızı

Harley-Davidson'ın elektrikli alt markası LiveWire, S2 Del Mar modeliyle şehir içi sürüşü yeniden tanımladı. 84 beygir güç üreten kompakt motoru ve 436 pound ağırlığıyla Del Mar, trafikte inanılmaz bir çeviklik sunuyor. 10.5 kWh bataryası şehir içinde yaklaşık 180 kilometre menzil sağlarken, Level 2 şarj desteğiyle birkaç saat içinde tamamen doluyor.

Del Mar'ı özel kılan bir diğer detay ise yazılım tarafı. OTA (kablosuz) güncellemeler sayesinde motorsiklet satın alındıktan sonra bile sürekli gelişiyor. Geri vitesi, yumuşak kalkış modu ve farklı sürüş modları arasında geçiş yapabilme imkânı, özellikle elektrikli motorsikletle yeni tanışan sürücüler için büyük bir rahatlık sağlıyor. Fiyatının 2026'da ciddi şekilde düşürülmesiyle birlikte Del Mar, giriş-premium segmentte çok güçlü bir seçenek haline geldi.

## Sessiz Devrimin Rotası

Bu üç model, elektrikli motorsiklet pazarının artık her segmentte ciddi alternatifler sunduğunun somut kanıtı. Performans meraklıları için Zero SR/F, uzun yol tutkunları için Energica Experia ve şehirli sürücüler için LiveWire Del Mar, benzinli motorsikletlerin egemenliğini hızla sarsıyor. Batarya teknolojisinin her yıl daha da ilerlemesi, şarj altyapısının genişlemesi ve fiyatların demokratikleşmesiyle birlikte, iki tekerlekli dünyanın geleceğinin sessiz ama güçlü olacağı artık tartışmasız bir gerçek.`)
    },
    {
      title: "Türkiye'de Elektrikli Motorsiklet Pazarı: Volta, RKS ve Kuba Hangi Segmentte Öne Çıkıyor?",
      slug: "turkiyede-elektrikli-motorsiklet-pazari-volta-rks-kuba",
      summary: "Artan yakıt fiyatları ve şehir içi ulaşım ihtiyacıyla büyüyen Türk elektrikli motorsiklet pazarında Volta, RKS ve Kuba markaları hangi alana odaklanıyor? Yerli üreticilerin güçlü ve zayıf yönlerini inceliyoruz.",
      imageUrl: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=800&q=80",
      isFeatured: false,
      categoryId: targetCategoryId,
      content: mdToHtml(`## Yerli Üreticiler Sahne Alıyor

Türkiye'de motosiklet kültürü yıllardır güçlü bir gelenekle süregeliyor. Ancak son birkaç yılda bu kültürün içine yeni bir soluk girdi: elektrikli motorsikletler. Artan akaryakıt fiyatları, şehir içi trafik sıkışıklığı ve çevre bilincinin yükselmesi, iki tekerlekli elektrikli araçları Türk tüketicisinin radarına soktu. Bu alanda yerli üreticiler olan Volta Motor, RKS Motor ve Kuba Motor, kendi güçlü yanlarıyla pazarda ciddi bir varlık gösteriyor.

Türkiye'nin motosiklet sektöründe Avrupa'nın önemli üretim üslerinden biri haline gelmesi ve 16 milyar lirayı aşan yatırım projeleri, bu pazarın ciddiyetini gözler önüne seriyor.

## Volta Motor — Ekonomik Şehir İçi Ulaşımın Öncüsü

Volta Motor, Türkiye'nin elektrikli hafif araç segmentinde en tanınan isimlerden biri. Marka, özellikle şehir içi kısa mesafeli ulaşım çözümleri, üç tekerlekli taşıma araçları ve ekonomik elektrikli scooter modelleriyle dikkat çekiyor. Volta'nın temel felsefesi basitlik ve erişilebilirlik üzerine kurulu: düşük bakım maliyeti, kolay kullanım ve ulaşılabilir fiyat etiketleri.

Markanın 2025 yılında üretim kapasitesini yıllık 450 bin araca çıkarmaya yönelik başlattığı büyük yatırım, bu segmentteki büyüme potansiyelini açıkça gösteriyor. Kurye, teslimat ve kısa mesafe banliyö ulaşımı gibi alanlarda Volta modelleri, işletme maliyetlerini minimumda tutmak isteyen profesyonel kullanıcılar tarafından sıklıkla tercih ediliyor. Eğer günlük 30-50 kilometrelik bir şehir içi kullanım profiliniz varsa ve bütçe önceliğinizse Volta bu alanda en güçlü aday.

## RKS Motor — Çeşitlilik ve Orta Segment Performans

RKS Motor, Türk motosiklet pazarında uzun yıllardır güçlü bir varlığa sahip olan köklü bir marka. Elektrikli ürün yelpazesinde Epsilon, Delta ve Zeta gibi isimlerle sunduğu geniş model çeşitliliği, farklı ihtiyaçlara hitap eden seçenekler yaratıyor. RKS'in elektrikli modellerini öne çıkaran unsurlar arasında tasarım kalitesi, menzil optimizasyonu ve hızlı şarj kapasitesi yer alıyor.

Orta segment fiyatlandırma politikası ve benzinli modellerdeki deneyimini elektrikli tarafa aktarma becerisiyle RKS, hem ilk kez elektrikli motorsiklet alan kullanıcılara hem de mevcut benzinli motorsikletinden geçiş yapmak isteyenlere dengeli bir çözüm sunuyor. Günlük işe gidip gelme, hafta sonu kısa gezintiler ve şehir içi çevik ulaşım ihtiyaçlarında RKS modelleri performans ve maliyet arasında sağlam bir denge kuruyor.

## Kuba Motor — Servis Ağı ve Parça Güvencesi

Kuba Motor'un en büyük kozu Türkiye genelindeki yaygın servis ağı ve kolay yedek parça erişimi. Elektrikli motorsiklet alırken çoğu kullanıcının gözden kaçırdığı kritik bir konu, satış sonrası destek kapasitesidir. Kuba bu konuda rakiplerine göre ciddi bir avantaja sahip. Neredeyse her il ve ilçede bulunan yetkili servis noktaları, kullanıcılara arıza veya bakım durumunda hızlı çözüm imkânı sunuyor.

Orta segment fiyatlandırma politikası ve geniş model yelpazesiyle Kuba, erişilebilirliği yüksek bir marka konumunda. Özellikle Anadolu'nun farklı şehirlerinde yaşayan ve servis erişimini öncelikli kriter olarak değerlendiren kullanıcılar için Kuba modelleri mantıklı bir tercih oluşturuyor.

## Türkiye Pazarının Geleceği

Türkiye'deki elektrikli motorsiklet pazarı henüz erken aşamasında olsa da büyüme trendi son derece güçlü. Devlet teşvikleri, yerli üretim kapasitesinin artması ve lityum-iyon batarya maliyetlerinin düşmesi, bu sektörü hızla büyütecek temel dinamikler. Değiştirilebilir batarya sistemleri ve akıllı bağlantı (IoT) özellikleri de 2026 sonrasında standart haline gelecek teknolojiler arasında yer alıyor.

Yakıt fiyatlarının sürekli artış eğiliminde olduğu bir ülkede, günlük ulaşım maliyetini dramatik şekilde düşüren elektrikli motorsikletlerin payının önümüzdeki 5 yıl içinde katlanarak büyümesi bekleniyor. Volta'nın ekonomi odaklı yaklaşımı, RKS'in performans dengeleme becerisi ve Kuba'nın servis güvencesi, Türk tüketicisine kendi önceliklerine göre seçim yapabileceği sağlam bir yerli ekosistem sunuyor.`)
    },
    {
      title: "Katı Hal Bataryalar ve Değiştirilebilir Piller: Elektrikli Motorsikletlerde Batarya Devrimi",
      slug: "elektrikli-motorsikletlerde-batarya-devrimi-kati-hal-degistirilebilir",
      summary: "Katı hal (solid-state) bataryalar 600 km menzil ve 10 dakikada tam şarj vaat ederken, Asya'da değiştirilebilir batarya ekosistemi hızla yayılıyor. Elektrikli motorsikletlerde batarya teknolojisi nereye gidiyor?",
      imageUrl: "https://images.unsplash.com/photo-1611241893603-3c359704e0ee?auto=format&fit=crop&w=800&q=80",
      isFeatured: false,
      categoryId: targetCategoryId,
      content: mdToHtml(`## Batarya: Elektrikli Motorsikletin Kalbi

Bir elektrikli motorsikletin performansını, menzilini ve kullanım deneyimini belirleyen en kritik bileşen bataryasıdır. Motor ne kadar güçlü olursa olsun, batarya yetersiz kalıyorsa o motorsiklet sürücüsüne güven veremez. İşte tam bu noktada 2026 yılı, elektrikli iki tekerlekli dünya için gerçek bir dönüm noktası oldu. Katı hal (solid-state) batarya teknolojisinin laboratuvardan üretime geçmesi ve değiştirilebilir batarya ekosistemlerinin olgunlaşması, sektörün en temel sorunlarına somut çözümler getirmeye başladı.

## Katı Hal Bataryalar: Laboratuvardan Yola

Geleneksel lityum-iyon bataryalarda sıvı veya jel formundaki elektrolit kullanılır. Bu yapı belirli riskleri beraberinde getirir: aşırı ısınma, kapasite kaybı ve nadir de olsa termal kaçış (thermal runaway) ihtimali. Katı hal bataryalar ise bu sıvı elektroliti katı bir malzemeyle değiştirerek oyunun kurallarını yeniden yazıyor.

Finlandiyalı Verge Motorcycles, Donut Lab işbirliğiyle katı hal batarya teknolojisini seri üretime taşıyan ilk motorsiklet üreticisi oldu. Güncellenen Verge TS Pro modeli, bu teknolojiyle donatılmış olarak piyasaya sürüldü ve sonuçlar etkileyici: tek şarjla 600 kilometreyi aşan menzil, 400-500 Wh/kg enerji yoğunluğu ve tam şarj süresinin 10 dakikanın altına inmesi. Bu rakamlar, benzinli bir motorsikletin depo doldurma deneyimine son derece yakın bir kullanım rahatlığı anlamına geliyor.

Katı hal bataryaların güvenlik avantajı da göz ardı edilemez. Sıvı elektrolit olmadığı için termal kaçış riski neredeyse sıfıra iniyor. Bu durum, özellikle motorsiklet gibi kaza riskinin otomobile kıyasla daha yüksek olduğu araçlarda büyük bir güven unsuru oluşturuyor. Darbe anında bataryanın alev alma ihtimalinin minimize edilmesi, hem üreticiler hem de sigorta şirketleri için önemli bir gelişme.

## Değiştirilebilir Batarya: Şarj Yerine Takas

Katı hal teknolojisi premium segmenti dönüştürürken, şehir içi ulaşım ve profesyonel teslimat sektörü için bambaşka bir çözüm hızla yaygınlaşıyor: değiştirilebilir batarya (battery swapping) ekosistemi. Bu sistemde sürücü, boşalan bataryayı bir istasyonda bırakıp dolu bir bataryayı takarak yoluna devam ediyor. Tüm işlem bir dakikadan kısa sürüyor.

Asya-Pasifik bölgesi bu alanda dünya lideri konumunda. Çin'de China Tower gibi büyük operatörlerin işlettiği binlerce takas istasyonu, özellikle kurye ve teslimat filolarına hizmet veriyor. Endonezya, Hindistan ve Tayvan gibi ülkelerde de benzer ağlar hızla genişliyor. Bu istasyonlarda standartlaştırılmış batarya paketleri kullanılıyor, böylece farklı marka motorsikletler bile aynı altyapıdan faydalanabiliyor.

Bu modelin en ilgi çekici boyutu ise "Batarya Hizmet Olarak" (Battery-as-a-Service / BaaS) yaklaşımı. Sürücü motorsikleti satın alırken batarya maliyetini ödemek zorunda kalmıyor. Bunun yerine aylık bir abonelik ücreti karşılığında sınırsız batarya takası yapabiliyor. Bu sistem, elektrikli motorsikletin ilk satın alma maliyetini dramatik şekilde düşürerek geniş kitlelere ulaşmasını sağlıyor.

## Mevcut Teknolojideki İyileştirmeler

Katı hal ve değiştirilebilir batarya dışında, mevcut lityum-iyon teknolojisinde de önemli adımlar atılıyor. Üreticiler eski nesil 18650 hücrelerden daha yüksek kapasiteli 21700 hücrelere geçiş yaparak mevcut şasi ve tasarım kalıpları içinde daha fazla enerji depolayabiliyor. Bu geçiş tek başına bile menzilde yüzde 15-20 artış sağlıyor.

Gelişmiş Batarya Yönetim Sistemleri (BMS) de standart hale geliyor. Bu akıllı yazılımlar, her bir hücrenin sıcaklığını, voltajını ve şarj durumunu gerçek zamanlı izleyerek bataryanın ömrünü uzatıyor, performansını optimize ediyor ve güvenliğini artırıyor. Soğuk havalarda batarya ön ısıtma, sıcak havalarda aktif soğutma ve rejeneratif frenleme optimizasyonu gibi fonksiyonlar artık giriş seviyesi modellerde bile sunuluyor.

## Geleceğin Yol Haritası

Elektrikli motorsiklet batarya teknolojisi artık iki paralel yolda ilerliyor. Premium segmentte katı hal bataryalar, benzine yakın menzil ve şarj hızıyla sürücülerin son dirençlerini kırıyor. Şehir içi ve ticari segmentte ise değiştirilebilir batarya ekosistemleri, pratik ve ekonomik bir alternatif sunarak milyonlarca yeni kullanıcıyı elektrikli dünyaya çekiyor.

Bu iki teknolojinin kesişim noktası, önümüzdeki 5 yıl içinde elektrikli motorsikletlerin tüm dünyada ana akım ulaşım aracı haline gelmesini sağlayacak. Menzil kaygısının tarihe karışması, şarj süresinin benzin doldurma kadar kısalması ve sahiplik maliyetinin düşmesiyle birlikte iki tekerlekli elektrikli devrim artık bir gelecek vaadi değil, yaşanan bir gerçek.`)
    }
  ];

  for (const article of motorcycleArticles) {
    const existing = await prisma.article.findUnique({
      where: { slug: article.slug }
    });

    if (existing) {
      console.log(`  ⏭ Already exists: "${article.title}"`);
      continue;
    }

    await prisma.article.create({
      data: {
        title: article.title,
        slug: article.slug,
        summary: article.summary,
        content: article.content,
        imageUrl: article.imageUrl,
        isFeatured: article.isFeatured,
        categoryId: article.categoryId,
        viewCount: Math.floor(Math.random() * 200) + 50,
        publishedAt: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)),
      }
    });
    console.log(`  ✓ Created: "${article.title}"`);
  }

  console.log("\n=== Electric Motorcycle Articles Seeded ===");
  await prisma.$disconnect();
}

main().catch(console.error);
