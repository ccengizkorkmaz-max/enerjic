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
  console.log("=== Seeding 4 New High-Quality AdSense-Optimized Articles ===");

  // Fetch category IDs dynamically
  const categories = await prisma.category.findMany();
  const categoryMap = {};
  categories.forEach(cat => {
    categoryMap[cat.slug] = cat.id;
  });

  if (!categoryMap['elektrikli-araclar'] || !categoryMap['temiz-enerji'] || !categoryMap['girisimcilik-saas'] || !categoryMap['trend-teknolojiler']) {
    console.error("Required categories are missing. Please seed categories first.");
    return;
  }

  const newArticles = [
    {
      title: "Hyundai IONIQ 5 Küresel Pazarda Neden Liderliği Kaptırmıyor? Rakipleriyle Detaylı Karşılaştırma",
      slug: "hyundai-ioniq-5-kuresel-pazarda-neden-lider",
      summary: "Hyundai'nin elektrikli ikon modeli IONIQ 5, 2026 yılında da küresel pazarda rekor satış başarılarına imza atıyor. Rakiplerinden sıyrılmasını sağlayan 800V şarj mimarisini ve sürüş dinamiklerini detaylandırıyoruz.",
      imageUrl: "https://images.pexels.com/photos/17228800/pexels-photo-17228800/free-photo-of-hyundai-ioniq-5-electric-car.jpeg?auto=compress&cs=tinysrgb&w=800",
      isFeatured: true,
      categoryId: categoryMap['elektrikli-araclar'],
      content: `## Elektrikli Araç Pazarında IONIQ 5 Rüzgarı
      
Otomotiv dünyasında elektrikli araç (EV) dönüşümü hız kesmeden devam ederken, bazı modeller sundukları mühendislik çözümleri ve tüketici memnuniyeti ile rakiplerinin bir adım önüne geçmeyi başarıyor. Hyundai'nin elektrikli otomobil pazarındaki amiral gemisi konumunda olan **IONIQ 5**, 2026 yılının ilk yarısında küresel çapta gösterdiği rekor satış performansıyla bu başarının tesadüf olmadığını bir kez daha kanıtladı. Ford Mustang Mach-E, Chevrolet Equinox EV ve Honda Prologue gibi güçlü rakiplerini geride bırakan bu modelin arkasındaki başarı sırlarını inceliyoruz.

### 1. 800 Volt Ultra Hızlı Şarj Mimarisi
Elektrikli araç kullanıcılarının en büyük çekincesi olan şarj süresi, IONIQ 5'in rakiplerine karşı en büyük kozu. Pazardaki çoğu araç 400 voltluk elektrik altyapısını kullanırken, IONIQ 5 premium segmentteki lüks araçlar gibi **800 voltluk ultra hızlı şarj mimarisine** sahiptir.
* **Şarj Süresi:** 350 kW DC hızlı şarj istasyonuna bağlandığında, bataryasını sadece **18 dakikada %10'dan %80 seviyesine** ulaştırabilir.
* **Mesafe Kazanımı:** 5 dakikalık kısa bir duraklamada dahi yaklaşık 100 kilometrelik ek menzil kazanabilir. Rakiplerinin ortalama 35-45 dakika şarj süresi sunduğu bu segmentte, Hyundai sürücülerine ciddi bir zaman tasarrufu sağlamaktadır.

### 2. E-GMP Platformunun Sunduğu Geniş İç Hacim
Hyundai'nin sadece elektrikli araçlar için tasarladığı **E-GMP (Electric-Global Modular Platform)** şasisi, aracın sürüş dinamiklerini ve konforunu baştan tanımlıyor. İçten yanmalı motorlu araç şasilerinden dönüştürülen elektrikli araçların aksine, E-GMP sayesinde motorlar akslara yerleştirilmiş ve batarya tabana düz bir şekilde yayılmıştır.
* **Aks Mesafesi:** Aracın 3 metrelik devasa aks mesafesi, Hyundai Palisade gibi büyük SUV modellerinden bile daha geniştir. Bu durum, arka koltuktaki yolcular için lüks segment sedan konforu sunarken, düz zemin yapısı bagaj ve kabin içi depolama alanlarını maksimuma çıkarmaktadır.

### 3. V2L (Vehicle-to-Load) ile Tekerlekli Güç Kaynağı
IONIQ 5, sadece elektrik tüketen değil, aynı zamanda dışarıya elektrik verebilen iki yönlü şarj teknolojisine (V2L) sahiptir. Aracın hem içinde hem de dışındaki prizler aracılığıyla 3.6 kW gücünde 220V elektrik çıkışı sağlanmaktadır.
* **Kullanım Alanları:** Kamp alanlarında kahve makinesi, mini buzdolabı veya projeksiyon cihazı çalıştırabilir; hatta yolda kalan başka bir elektrikli aracı şarj edebilirsiniz. Bu özellik, aracı sadece bir ulaşım aracı olmaktan çıkarıp mobil bir yaşam alanına dönüştürmektedir.

### Sonuç ve Değerlendirme
Elektrikli araç pazarında rekabetin kızıştığı, Çinli üreticilerin fiyat baskısını artırdığı bu dönemde Hyundai, mühendislik kalitesi ve yenilikçi özellikleriyle IONIQ 5 modelini lider konumda tutmayı başarıyor. 800V şarj altyapısı, özgün retro-fütüristik tasarımı ve sunduğu geniş kabin konforu, bu modelin uzun yıllar daha elektrikli araç segmentinde referans noktası olmaya devam edeceğini gösteriyor.`
    },
    {
      title: "Apartman Sakinleri İçin Güneş Devrimi: Balkon Tipi GES (Balcony Solar) Nedir?",
      slug: "apartman-sakinleri-icin-gunes-devrimi-balkon-ges",
      summary: "Müstakil evi veya geniş çatısı olmayan kiracılar ve apartman sakinleri için geliştirilen balkon tipi güneş panellerini (Balcony Solar), yasal durumunu ve teknik altyapısını inceliyoruz.",
      imageUrl: "https://images.pexels.com/photos/2800834/pexels-photo-2800834.jpeg?auto=compress&cs=tinysrgb&w=800",
      isFeatured: false,
      categoryId: categoryMap['temiz-enerji'],
      content: `## Apartmanlarda Temiz Enerji Dönemi

Yenilenebilir enerji dönüşümü dünya genelinde hızla yayılırken, bugüne kadar güneş paneli kurulumları genellikle geniş çatı alanına sahip müstakil konutlar veya sanayi tesisleriyle sınırlı kalmıştı. Ancak dünya genelinde ve özellikle Türkiye'de nüfusun çok büyük bir kısmının çok katlı apartmanlarda yaşadığı düşünüldüğünde, temiz enerji üretiminin demokratikleşmesi için yeni bir çözüme ihtiyaç duyuluyordu. İşte bu noktada **Balkon Tipi Güneş Enerjisi Sistemleri (Balcony Solar)** devreye giriyor. Kiracıların dahi kolaylıkla kurup kullanabileceği ve taşınırken söküp götürebileceği bu mikro enerji sistemlerini tüm detaylarıyla ele alıyoruz.

### 1. Balkon Tipi GES Nasıl Çalışır?
Balkon tipi güneş panelleri, karmaşık kablolama süreçleri ve büyük inşaat işleri gerektirmeyen son derece sade bir mühendislik yapısına sahiptir:
* **Güneş Paneli:** Genellikle hafif, esnek veya balkon korkuluklarına kolayca monte edilebilen 1 veya 2 adet yüksek verimli güneş panelinden oluşur.
* **Mikro İnvertör (Microinverter):** Panellerin arkasına monte edilen bu küçük cihaz, panellerden gelen DC (doğru akım) elektriği evinizde kullandığınız 220V AC (alternatif akım) elektriğe dönüştürür.
* **Tak-Çalıştır Bağlantı:** İnvertörden çıkan standart elektrik fişi, evinizdeki herhangi bir prize takılır. Üretilen elektrik, ev içi şebekeye verilerek o an çalışan buzdolabı, televizyon, modem veya bilgisayar gibi cihazlar tarafından doğrudan tüketilir.

### 2. Kiracılar İçin Taşınabilir Enerji Yatırımı
Geleneksel çatı üstü GES sistemleri binaya sabitlendiği için kiracılar için mantıklı bir yatırım değildir. Ancak balkon tipi sistemler tamamen **taşınabilir (portable)** özelliktedir. Ev değiştirdiğinizde kelepçeleri sökerek panellerinizi yeni evinize taşıyabilir ve dakikalar içinde tekrar elektrik üretmeye başlayabilirsiniz. Ayrıca çatı ortaklığı gibi apartman yönetim onay süreçlerine de çoğunlukla gerek kalmaz, çünkü paneller tamamen sizin kendi kullanım alanınız olan balkona monte edilir.

### 3. Ekonomik Analiz ve Tasarruf Oranı
Standart bir balkon tipi sistem genellikle 400W ile 800W arasında bir kurulu güce sahiptir. Bu sistemlerin üretim potansiyeli bölgenin güneşlenme oranına göre değişiklik gösterir:
* **Üretim:** 800W gücündeki bir balkon GES, Türkiye koşullarında yılda ortalama 1.000 - 1.200 kWh elektrik üretebilir.
* **Tasarruf:** Bu miktar, ortalama bir hanenin yıllık elektrik ihtiyacının yaklaşık **%30 ila %40'ını** karşılayabilir. Gündüz sürekli çalışan buzdolabı ve bekleme (standby) modundaki cihazların tükettiği elektrik tamamen bedavaya getirilmiş olur. Sistem kendini ortalama 3-4 yıl içinde amorti eder.

### Sonuç
Avrupa'da, özellikle Almanya ve İtalya'da yasal olarak onaylanan ve devlet teşvikleriyle desteklenen balkon tipi GES sistemleri, apartman sakinlerinin karbon ayak izini düşürmeleri için en pratik yöntemdir. Türkiye'de de enerji fiyatlarının artmasıyla birlikte mikro güneş sistemlerine olan ilginin hızla artacağı ve şehir içi binalarda yeni bir yeşil dönüşüm dalgası yaratacağı öngörülmektedir.`
    },
    {
      title: "Elektrikli Araçların Ömrünü Tamamlayan Bataryalarına İkinci Hayat: Second-Life Depolama Girişimleri",
      slug: "elektrikli-arac-bataryalarina-ikinci-hayat-second-life",
      summary: "Elektrikli araçlarda menzili düşen bataryaların çöpe gitmesini önleyen, bu pilleri rüzgar ve güneş enerjisi santrallerinde sabit depolama ünitesi olarak kullanan döngüsel ekonomi girişimlerini inceliyoruz.",
      imageUrl: "https://images.pexels.com/photos/159220/battery-alkaline-status-charge-159220.jpeg?auto=compress&cs=tinysrgb&w=800",
      isFeatured: false,
      categoryId: categoryMap['girisimcilik-saas'],
      content: `## Bataryaların İkinci Baharı: Döngüsel Ekonomi Girişimleri

Elektrikli araç (EV) pazarının devasa bir hızla büyümesi, beraberinde çok kritik bir soruyu da getiriyor: **Ömrünü tamamlayan milyonlarca araç bataryasına ne olacak?** Elektrikli araçlarda kullanılan lityum-iyon bataryalar, kapasiteleri zamanla **%70-80 seviyesine** düştüğünde araç için yetersiz kabul edilir ve değiştirilir. Ancak bu durum bataryaların tamamen öldüğü anlamına gelmez. İçlerinde hala muazzam miktarda enerji depolama kapasitesi barındıran bu bataryalar, yenilikçi girişimler sayesinde sabit enerji depolama sistemleri (Second-Life Battery Energy Storage Systems - BESS) olarak yeniden hayata döndürülüyor.

### 1. Second-Life Teknolojisinin Çalışma Mantığı
Araçlardan sökülen bataryaların ikinci ömür sürecine girmesi hassas mühendislik aşamaları gerektirir:
* **Test ve Analiz:** Sökülen bataryalar hücre seviyesinde test edilerek sağlık durumları (State of Health - SoH) belirlenir. Hasarlı veya ömrünü tamamen yitirmiş hücreler ayrıştırılır.
* **Yeniden Paketleme:** Sağlıklı durumdaki batarya modülleri, gelişmiş batarya yönetim yazılımları (BMS) ile entegre edilerek endüstriyel boyutta sabit depolama konteynerleri haline getirilir.
* **Sabit Kullanım:** Bu yeni devasa batarya paketleri artık ağırlık veya hacim sınırının önemli olmadığı rüzgar, güneş santralleri veya fabrika şebekelerinde elektrik depolamak için kullanılır.

### 2. Sürdürülebilirlik ve Karbon Ayak İzi Etkisi
Yeni bir lityum-iyon batarya üretmek, maden çıkartma süreçleri ve fabrikasyon nedeniyle yüksek miktarda karbon salınımına yol açar. Eski bataryaların ömrünü sabit depolama sistemleriyle 10-15 yıl daha uzatmak:
* **Hammadde Tasarrufu:** Yeni lityum, nikel ve kobalt çıkarma ihtiyacını azaltır.
* **Karbon Azaltımı:** Üretim aşamasındaki karbon emisyonlarını amorti ederek bataryanın yaşam döngüsü boyunca sağladığı çevre dostu faydayı maksimize eder.

### 3. İş Modeli ve Girişimcilik Fırsatları
Second-Life batarya pazarı, yeşil girişimcilik (Climate-Tech) için yepyeni iş modelleri yaratmaktadır:
* **Bulut Tabanlı Batarya Takip Yazılımları (SaaS):** Bataryaların sağlık durumlarını bulut üzerinden anlık analiz eden yazılım çözümleri yatırım almaktadır.
* **Yeniden Üretim (Remanufacturing) EPC'leri:** Otomotiv devleriyle (Tesla, Nissan, Hyundai) anlaşarak eski bataryaları toplayan ve fabrikalar için kesintisiz güç kaynağı (UPS) olarak kuran donanım-SaaS entegre şirketler hızla değerlenmektedir.

### Sonuç
Elektrikli araç dönüşümü sadece sürüşü elektrikli yapmakla bitmiyor; kullanılan bataryaların beşiğinden mezarına kadar olan tüm yaşam döngüsünü temiz tutmayı zorunlu kılıyor. İkinci hayat batarya girişimleri, hem çevre kirliliğini engellemekte hem de yenilenebilir enerji santralleri için çok daha ucuz, erişilebilir depolama çözümleri sunarak yeşil dönüşümün en önemli tamamlayıcı halkası haline gelmektedir.`
    },
    {
      title: "Şarj Beklemeye Son: CATL'in Avrupa'ya Açılan 5 Dakikalık Batarya Değiştirme (Battery Swap) Teknolojisi",
      slug: "sarj-beklemeye-son-catl-battery-swap-avrupa",
      summary: "Dünyanın en büyük batarya üreticisi CATL, 2.000 istasyona ulaşan hızlı batarya değiştirme (Battery Swap) sistemini Avrupa'ya açıyor. Elektrikli araçlarda şarj sürelerini tarihe gömecek bu yeni altyapıyı inceliyoruz.",
      imageUrl: "https://images.pexels.com/photos/9796024/pexels-photo-9796024.jpeg?auto=compress&cs=tinysrgb&w=800",
      isFeatured: false,
      categoryId: categoryMap['trend-teknolojiler'],
      content: `## Elektrikli Araçlarda Batarya Değişim Teknolojisi

Elektrikli araçların (EV) yaygınlaşmasının önündeki en büyük iki psikolojik engel her zaman "menzil kaygısı" ve "şarj süresi" olmuştur. Şarj cihazlarının gücü 350 kW seviyesine çıksa da, bir bataryayı doldurmak hala en az 15-20 dakika sürmektedir. Bu süre, geleneksel fosil yakıtlı araçların benzin deposunu doldurma süresiyle (yaklaşık 3-5 dakika) kıyaslandığında uzun kalmaktadır. Dünyanın en büyük batarya üreticisi **CATL**, bu sorunu şarj ederek değil, bataryayı doğrudan değiştirerek çözmeyi hedefleyen **Evogo (Choco-SEB)** batarya değiştirme (Battery Swap) ağını hızla büyüterek Avrupa pazarına açma kararı aldı.

### 1. Battery Swap (Batarya Değişimi) Nasıl Çalışır?
Batarya değiştirme sistemi, bir elektrikli aracın bitmiş bataryasının otomatik istasyonlarda dakikalar içinde çıkartılıp, yerine tam şarjlı bir bataryanın takılması prensibine dayanır:
* **İstasyon Süreci:** Sürücü aracı istasyona park eder. Robotik kollar aracın altındaki kilitleri açarak boş bataryayı çeker ve şarj odasına alır.
* **Yeni Batarya:** Şarj odasından tam dolu, sağlıklı bir batarya getirilerek araca monte edilir. Tüm bu süreç sürücü araçtan inmeden sadece **3 ila 5 dakika arasında** tamamlanır.

### 2. Modüler Batarya ve BaaS (Battery-as-a-Service) İş Modeli
CATL'in geliştirdiği "Choco-SEB" batarya blokları çikolata tabletlerine benzer modüler bir yapıya sahiptir:
* **İhtiyaca Göre Batarya:** Günlük şehir içi sürüşleriniz için aracınıza sadece 1 adet modüler blok taktırıp hafif ve ekonomik sürüş yapabilirsiniz. Uzun yola çıkacağınız zaman ise istasyona uğrayıp yanına 2 modüler blok daha ekleterek menzilinizi 3 katına çıkarabilirsiniz.
* **Düşük Satın Alma Maliyeti:** Sürücüler aracı satın alırken en pahalı bileşen olan bataryayı satın almazlar. Batarya, kiralama modeliyle (BaaS) abonelik üzerinden kullanılır. Bu durum elektrikli araçların başlangıç fiyatını benzinli araçların bile altına düşürebilir.

### 3. Şebeke Güvenliği ve Batarya Sağlığı Avantajları
Bataryaların araç üzerinde hızlı şarj edilmesi yüksek ısı ürettiği için ömrünü kısaltır. Batarya değiştirme istasyonlarında ise sökülen piller klimalı ve optimum sıcaklıktaki odalarda, yavaş ve dengeli bir şekilde şarj edilir. Bu durum batarya ömrünü maksimuma çıkarırken, şehir şebekelerine anlık aşırı yük binmesini engeller.

### Sonuç
Çin genelinde 2.000 istasyon barajını aşan CATL, bu altyapıyı İngiltere ve Avrupa genelindeki otoyol ağlarına entegre etmek için anlaşmalar imzalıyor. Battery Swap teknolojisi yaygınlaştığında, elektrikli araçlar sadece şarj kablosuna bağlı kalmaktan kurtulmayacak, aynı zamanda batarya eskime derdini tamamen tüketicinin hayatından çıkartacaktır.`
    }
  ];

  console.log(`Inserting ${newArticles.length} new articles into the database...`);

  let count = 0;
  for (const art of newArticles) {
    try {
      const htmlContent = mdToHtml(art.content);
      
      // Check if article already exists to prevent duplication
      const existing = await prisma.article.findUnique({
        where: { slug: art.slug }
      });

      if (existing) {
        // Update existing article
        await prisma.article.update({
          where: { slug: art.slug },
          data: {
            title: art.title,
            summary: art.summary,
            content: htmlContent,
            imageUrl: art.imageUrl,
            isFeatured: art.isFeatured,
            categoryId: art.categoryId,
            publishedAt: new Date()
          }
        });
        console.log(`Updated article: ${art.title}`);
      } else {
        // Create new article
        await prisma.article.create({
          data: {
            title: art.title,
            slug: art.slug,
            summary: art.summary,
            content: htmlContent,
            imageUrl: art.imageUrl,
            isFeatured: art.isFeatured,
            categoryId: art.categoryId,
            publishedAt: new Date()
          }
        });
        console.log(`Created article: ${art.title}`);
      }
      count++;
    } catch (e) {
      console.error(`Failed to insert article "${art.title}":`, e.message);
    }
  }

  console.log(`=== Successfully processed ${count} articles in DB ===`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
