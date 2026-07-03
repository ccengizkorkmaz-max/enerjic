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
  console.log("=== Seeding Real & High-Quality SEO Articles (Expanded with User Sugggestions) ===");

  // 1. Clean old article & comment records
  await prisma.comment.deleteMany();
  await prisma.article.deleteMany();
  console.log("Cleaned old articles and comments.");

  // 2. Fetch or create categories
  const categories = {
    'elektrikli-araclar': { name: 'Elektrikli Araçlar', desc: 'Elektrikli araç incelemeleri, batarya teknolojileri, menzil analizleri ve rehberler.' },
    'temiz-enerji': { name: 'Temiz Enerji', desc: 'Güneş enerjisi, rüzgar enerjisi, ısı pompaları ve sürdürülebilir enerji dönüşümü.' },
    'girisimcilik-saas': { name: 'Girişimcilik & SaaS', desc: 'Yeşil girişimler, Climate-Tech SaaS girişimleri, karbon muhasebesi yazılımları ve iş modelleri.' },
    'trend-teknolojiler': { name: 'Trend Teknolojiler', desc: 'Katı hal pilleri, yapay zeka destekli akıllı şebekeler, hidrojen enerjisi ve V2G çözümleri.' },
  };

  const categoryMap = {};
  for (const [slug, cat] of Object.entries(categories)) {
    let dbCat = await prisma.category.findUnique({ where: { slug } });
    if (!dbCat) {
      dbCat = await prisma.category.create({
        data: {
          name: cat.name,
          slug: slug,
          description: cat.desc
        }
      });
    }
    categoryMap[slug] = dbCat.id;
  }
  console.log("Category map populated.");

  // 3. Define 16 High-Quality Turkish Articles
  const articles = [
    // --- USER SUGGESTED ARTICLES ---
    {
      title: "Ünlülerin Tercih Ettiği Elektrikli Araçlar: Hangi Yıldız Hangi Modeli Kullanıyor?",
      slug: "unlulerin-tercih-ettigi-elektrikli-araclar",
      summary: "Hollywood yıldızlarından sporculara ve teknoloji liderlerine kadar ünlü isimlerin günlük hayatta tercih ettiği elektrikli araç modellerini ve sürdürülebilirlik tercihlerini inceliyoruz.",
      imageUrl: "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=800",
      isFeatured: true,
      categoryId: categoryMap['elektrikli-araclar'],
      content: `## Ünlüler Dünyasında Elektrikli Araç Akımı

Sürdürülebilirlik ve çevre bilincinin artmasıyla birlikte, Hollywood yıldızları, spor dünyasının devleri ve teknoloji milyarderleri elektrikli araçları (EV) sadece birer ulaşım aracı olarak değil, aynı zamanda yaşam tarzlarının bir parçası olarak görüyor. İşte en ünlü isimler ve garajlarında yer alan elektrikli canavarlar.

### 1. Bill Gates ve Porsche Taycan Turbo S
Microsoft'un kurucusu Bill Gates, elektrikli araçlara olan tutkusunu açıkça dile getiren isimlerden biri. Satın aldığı ilk tam elektrikli araç olan Porsche Taycan Turbo S hakkında konuşurken, aracın sürüş dinamiklerine ve mühendislik harikası olmasına hayran kaldığını belirtmişti. Gates, otomobil sektörünün elektrifikasyonunu iklim kriziyle mücadelede en önemli adımlardan biri olarak görüyor.

### 2. Arnold Schwarzenegger'in Elektrikli G-Wagon'u
Eski Kaliforniya Valisi ve efsanevi aktör Arnold Schwarzenegger, çevre dostu teknolojilere olan ilgisiyle bilinir. Avusturyalı Kreisel Electric firmasıyla ortaklık kurarak klasik fosil yakıtlı Mercedes G-Wagon aracını tamamen elektrikli bir motora dönüştürdü. Arnold, bu projeyle en güçlü arazi araçlarının bile doğaya zarar vermeden sessizce çalışabileceğini kanıtlamak istedi.

### 3. Leonardo DiCaprio ve Çevre Tutkusu
Çevre aktivistliğiyle bilinen Oscar ödüllü oyuncu Leonardo DiCaprio, elektrikli araç dönüşümünün ilk destekçilerinden. Garajında hibrit öncüsü Toyota Prius, spor elektrikli Fisker Karma ve ilk nesil Tesla Roadster modellerini barındıran DiCaprio, elektrikli araç üreticilerine yaptığı yatırımlarla da sektöre finansal destek sağlıyor.

### 4. LeBron James ve GMC Hummer EV
NBA tarihinin en büyük yıldızlarından LeBron James, elektrikli Hummer EV'nin ilk sahiplerinden biri. Devasa gücü, "CrabWalk" (yan yengeç yürüyüşü) özelliği ve sıfır emisyonuyla dikkat çeken bu araç, Amerikan SUV kültürünün elektrikli gelecekte de heybetli kalabileceğinin en büyük kanıtı.

### Sonuç
Ünlülerin elektrikli araçları tercih etmesi ve bunu sosyal medyada paylaşması, geniş kitlelerin elektrikli dönüşüme olan güvenini artırmakta ve tüketici alışkanlıklarının hızla değişmesini sağlamaktadır.`
    },
    {
      title: "Elektrikli Arabaların Tarihçesi: 19. Yüzyıldan Günümüze Sessiz Devrim",
      slug: "elektrikli-arabalarin-tarihcesi-sessiz-devrim",
      summary: "Elektrikli araçların aslında 19. yüzyılda içten yanmalı motorlardan önce doğduğunu, ardından neden piyasadan silindiğini ve günümüzde nasıl muhteşem bir geri dönüş yaptığını keşfedin.",
      imageUrl: "https://images.unsplash.com/photo-1519074069444-1ba4e6663104?w=800",
      isFeatured: false,
      categoryId: categoryMap['elektrikli-araclar'],
      content: `## Elektrikli Araçların Bilinmeyen Tarihi

Çoğumuz elektrikli araçların 21. yüzyıla ait yeni bir teknoloji olduğunu düşünürüz. Oysa elektrikli arabaların tarihi, içten yanmalı motorlardan (benzinli ve dizel araçlar) çok daha eskiye dayanmaktadır. İşte elektrikli araçların doğuşu, altın çağı, dramatik çöküşü ve küllerinden yeniden doğuş hikayesi.

### 1. İlk Altın Çağ: 1830 - 1900
Elektrikli araçların temeli 1830'larda İskoç mucit Robert Anderson'ın ilk elektrikli faytonu yapmasıyla atıldı. 1900'lerin başında ise yollarda büyük bir rekabet vardı:
* **Pazar Payı:** 1900 yılında ABD'deki araçların %38'i elektrikli, %40'ı buharlı ve sadece %22'si benzinliydi.
* **Tercih Sebebi:** Elektrikli araçlar o dönemde benzinliler gibi gürültülü değildi, kötü kokmuyordu ve en önemlisi kol gücüyle çevrilen tehlikeli "marş kolu" (crank) gerektirmiyordu. Sessiz ve konforluydu.

### 2. Büyük Çöküş: Neden Benzin Kazandı?
1910'lardan sonra elektrikli araçlar neredeyse tamamen piyasadan silindi. Bunun üç büyük sebebi vardı:
* **Teksas Petrol Rezervleri:** Büyük ham petrol yataklarının keşfiyle benzin fiyatları aşırı derecede ucuzladı.
* **Henry Ford ve Model T:** Ford, bant tipi seri üretimle benzinli arabaları elektrikli araçların üçte bir fiyatına satmaya başladı.
* **Elektrikli Marş Motoru:** Cadillac'ın marş motorunu icat etmesiyle benzinli araçları çalıştırmak kolaylaştı ve elektrikli arabaların en büyük avantajı ortadan kalktı.

### 3. Küllerinden Doğuş ve Günümüz Popülerliği
Yaklaşık 80 yıllık bir sessizlikten sonra, iklim değişikliği krizleri, hava kirliliği ve fosil yakıtların tükenebilir olması sektörü yeniden tetikledi:
* **Lityum-İyon Bataryalar:** 1990'larda cep telefonlarıyla gelişen batarya teknolojisi, araçlara yeterli menzil sunabilecek kapasiteye ulaştı.
* **Tesla Etkisi:** 2008 yılında Tesla'nın spor Roadster modelini ve ardından lüks Model S'i çıkarması, elektrikli araçların yavaş ve sıkıcı değil; hızlı, teknolojik ve havalı olabileceğini tüm dünyaya gösterdi.

### Sonuç
Elektrikli araçlar aslında yeni bir icat değil; petrol çağının gölgesinde kalmış, teknolojinin olgunlaşmasıyla hak ettiği tahta geri oturan köklü bir sessiz devrimdir.`
    },
    {
      title: "Elektrikli Arabaların Kronik Sorunları: Sürücüleri Neler Bekliyor?",
      slug: "elektrikli-arabalarin-kronik-sorunlari-ve-cozumleri",
      summary: "Fosil yakıtlı araçlardaki motor ve şanzıman arızaları tarih olurken, elektrikli araçlarda karşılaşılan batarya degradasyonu, yazılım hataları ve hızlı lastik aşınması gibi yeni nesil kronik sorunları ele alıyoruz.",
      imageUrl: "https://images.unsplash.com/photo-1542282088-fe8426682b8f?w=800",
      isFeatured: false,
      categoryId: categoryMap['elektrikli-araclar'],
      content: `## Elektrikli Araçların Kronik Problemleri

Elektrikli araçlar, içten yanmalı motorlu araçlara kıyasla hareketli parça sayısı bakımından çok daha sadedir (bujiler, pistonlar, triger kayışı veya karmaşık şanzımanlar yoktur). Bu durum mekanik arıza riskini ciddi oranda düşürür. Ancak elektrikli araçların da kendine has, yeni nesil kronik ve beklenen sorunları mevcuttur.

### 1. Batarya Degradasyonu (Kapasite Kaybı)
Akıllı telefonlarımızda olduğu gibi, elektrikli araç bataryaları da zamanla kapasite kaybeder:
* **Sebepleri:** Aşırı sıcak havada sürüş, aracı sürekli çok hızlı DC şarj istasyonlarında doldurmak ve bataryayı %0'a kadar boşaltıp %100'de uzun süre bekletmek degradasyonu hızlandırır.
* **Etkisi:** Ortalama bir batarya yılda %1 ila %2 arasında kapasite kaybeder. 8-10 yıl sonunda aracın menzili ilk günküne göre %15-20 oranında azalabilir.

### 2. Erken Lastik Aşınması
Elektrikli araç sahiplerinin en sık karşılaştığı sürpriz sorunlardan biri lastiklerin çok hızlı eskimesidir:
* **Sebebi:** Elektrikli araçlar ağır bataryalar yüzünden benzinli muadillerine göre %30-40 daha ağırdır. Ayrıca elektrik motorları ilk hareket anında maksimum torku anında tekerleğe iletir. Bu ani güç ve yüksek ağırlık, lastik dişlerinin normalden 2 kat daha hızlı aşınmasına yol açar. Bu yüzden özel "EV" logolu dayanıklı lastiklerin kullanılması şarttır.

### 3. Yazılım Hataları ve Dijital Kilitlenmeler
Modern elektrikli araçlar adeta tekerlekli bilgisayarlardır. Ekranların donması, güncellemeler sırasında sistemin kilitlenmesi veya sensör hataları sürüş keyfini bölebilir. Hatta bazen araç anahtarının veya mobil uygulamanın aracı tanımaması gibi yazılımsal sorunlar yaşanmaktadır.

### 4. Rejeneratif Fren Korozyonu (Paslanma)
Elektrikli araçlar yavaşlarken motoru jeneratör gibi kullanarak elektrik üretir ve aracı yavaşlatır (rejeneratif frenleme). Bu yüzden mekanik fren diskleri ve balataları çok az kullanılır.
* **Kronik Etkisi:** Kullanılmayan mekanik fren diskleri, özellikle yağmurlu havalarda korozyona (paslanmaya) uğrayabilir ve ses yapmaya başlayabilir. Bu sorunu önlemek için aracı ara sıra sert frenlerle manuel olarak durdurup diskleri temizlemek önerilir.

### Sonuç
Elektrikli araçlar sanayi bakımlarını ve yağ değişimlerini hayatımızdan çıkarsa da, batarya sağlığı yönetimi ve yazılım güncellemeleri gibi yeni nesil takipleri zorunlu kılmaktadır.`
    },
    {
      title: "Elektrikli Arabalar Fosil Yakıtlı Araçları Ortadan Kaldırabilir mi? Ekonomik ve Beşeri Analiz",
      slug: "elektrikli-arabalar-fosil-yakitli-araclari-ortadan-kaldirabilir-mi",
      summary: "Elektrikli araç dönüşümünün akaryakıtlı otomobilleri tamamen tarihe gömüp gömemeyeceğini, şebeke altyapısı kapasitesi, kritik maden arzı ve insan alışkanlıkları çerçevesinde inceliyoruz.",
      imageUrl: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800",
      isFeatured: false,
      categoryId: categoryMap['elektrikli-araclar'],
      content: `## Fosil Yakıtların Sonu mu? Elektrikli Dönüşümün Analizi

Pek çok ülke ve otomobil üreticisi, 2030'lu yıllardan itibaren benzinli ve dizel araç satışını tamamen yasaklamayı hedefliyor. Peki elektrikli arabalar, fosil yakıtlı araçları dünya genelinde tamamen ortadan kaldırabilir mi? Bu dönüşümün önündeki ekonomik ve beşeri (insani) koşulları inceliyoruz.

### 1. Ekonomik Koşullar ve Altyapı Maliyetleri
Fosil yakıtların tamamen ortadan kalkabilmesi için öncelikle ekonomik dengelerin kurulması gerekir:
* **Fiyat Eşitliği:** Elektrikli araçların başlangıç fiyatlarının batarya maliyetlerindeki düşüşle birlikte benzinli araçlar seviyesine inmesi gerekmektedir.
* **Şebeke Kapasitesi:** Şehirlerdeki milyonlarca aracın şebekeye bağlanması devasa bir enerji yükü oluşturacaktır. Şebeke trafolarının yenilenmesi ve enerjinin kömür/doğalgaz yerine rüzgar/güneş gibi temiz kaynaklardan üretilmesi milyarlarca dolarlık yatırım gerektirir.
* **Hammadde Krizi:** Bataryalar için gereken lityum, kobalt ve nikel madenlerinin arzı sınırlıdır. Bu madenlerin çıkarılması ve geri dönüştürülmesi süreçleri küresel ölçekte koordine edilmelidir.

### 2. Beşeri (İnsani) Koşullar ve Alışkanlıklar
Dönüşümün başarısı insan davranışlarının değişmesine bağlıdır:
* **Şarj Altyapısına Erişim:** Müstakil evi olanlar için şarj kolaydır ancak apartmanlarda veya sokak otoparklarında yaşayan milyarlarca insan için gece şarjı büyük bir sorundur. Şehir içi hızlı şarj noktaları yaygınlaşmadığı sürece bu kitle fosil yakıtları bırakmakta zorlanacaktır.
* **Uzak Coğrafyalar ve Zor Koşullar:** Sibirya gibi aşırı soğuk iklimlerde veya Afrika'nın şebekesiz kırsal bölgelerinde elektrikli araç kullanımı pratik değildir. Bu coğrafyalarda fosil yakıtlar veya sentetik e-yakıtlar uzun yıllar daha varlığını koruyacaktır.

### Sonuç
Elektrikli araçlar gelişmiş şehirlerde ve binek otomobil segmentinde önümüzdeki 20 yıl içinde fosil yakıtlı araçları neredeyse tamamen ortadan kaldıracaktır. Ancak ağır ticari taşımacılık, havacılık ve altyapısı gelişmemiş coğrafyalarda fosil yakıtlı veya alternatif yakıtlı motorlar bir süre daha hayatımızda kalmaya devam edecektir.`
    },

    // --- ORiGiNAL 12 ARTICLES ---
    {
      title: "Elektrikli Araç Alırken Nelere Dikkat Edilmeli? (Kapsamlı Rehber)",
      slug: "elektrikli-arac-alirken-nelere-dikkat-edilmeli",
      summary: "Elektrikli araç satın alma aşamasında batarya kimyaları (LFP vs NMC), menzil standartları (WLTP vs EPA) ve şarj hızı gibi hayati önem taşıyan kriterleri inceliyoruz.",
      imageUrl: "https://images.unsplash.com/photo-1563720223185-11003d516935?w=800",
      isFeatured: false,
      categoryId: categoryMap['elektrikli-araclar'],
      content: `## Elektrikli Araç Satın Alma Rehberi

Elektrikli araç (EV) pazarı son yıllarda benzeri görülmemiş bir hızla büyüyor. Geleneksel içten yanmalı motorlu araçlardan elektrikli araçlara geçiş yaparken dikkat etmeniz gereken bazı temel farklar ve teknik detaylar bulunmaktadır. Bu rehberde, yeni bir elektrikli araç satın alırken göz önünde bulundurmanız gereken kritik unsurları ele alıyoruz.

### 1. Batarya Kimyası: LFP mi yoksa NMC mi?
Elektrikli araçların kalbi bataryasıdır. Günümüzde yaygın olarak iki temel batarya kimyası kullanılır:
* **LFP (Lityum Demir Fosfat):** Daha güvenlidir, yangın riski minimumdur ve ömrü uzundur (binlerce kez doldurulabilir). Bataryayı her gün %100 doldurmakta sakınca yoktur. Ancak enerji yoğunluğu daha düşük olduğundan araçlar daha ağır olabilir ve soğuk havalarda performansı NMC'ye kıyasla daha fazla düşer.
* **NMC (Nikel Manganez Kobalt):** Enerji yoğunluğu çok yüksektir, daha hafif araçlarda daha uzun menzil sunar. Soğuk hava performansı iyidir. Ancak maliyeti daha yüksektir ve batarya sağlığını korumak için günlük şarj seviyesinin %80 ile sınırlandırılması önerilir.

### 2. Menzil Standartları: WLTP vs EPA
Araç kataloglarında yazan menzil değerleri her zaman gerçeği yansıtmaz. Hangi test standardının kullanıldığı önemlidir:
* **WLTP (Avrupa Standardı):** Türkiye'de satılan araçlarda genellikle bu standart kullanılır. Gerçek sürüşe görece yakındır ancak otoyol hızları ve klima kullanımı gibi faktörler nedeniyle genellikle bu menzilin %15-20 daha azını elde edersiniz.
* **EPA (ABD Standardı):** Gerçek hayat koşullarını en iyi yansıtan test standardıdır. EPA menzil değerleri genellikle günlük kullanımda yakalayabileceğiniz en gerçekçi değerlerdir.

### 3. Şarj Hızları (AC ve DC Kapasitesi)
Aracın şarj hızı, seyahat konforunuzu doğrudan belirler:
* **AC Şarj (Ev/İşyeri şarjı):** Araçların AC dahili şarj cihazı (onboard charger) genellikle 11 kW veya 22 kW olur. 11 kW'lık bir araçla 60 kWh bataryayı evde yaklaşık 6 saatte doldurabilirsiniz.
* **DC Şarj (Hızlı Şarj):** Uzun yolda kullanılan hızlı şarj istasyonlarının gücü 50 kW ile 350 kW arasında değişir. Aracınızın maksimum DC şarj kapasitesi (örneğin 150 kW) ne kadar yüksekse, uzun yoldaki şarj duraklamalarınız o kadar kısa sürecektir (%10'dan %80'e 20-30 dakika).

### Sonuç
Elektrikli araç alırken sadece dış görünümüne değil; batarya teknolojisine, gerçekçi menzil testlerine ve şarj hızlarına odaklanmak, uzun vadede en doğru kararı vermenizi sağlayacaktır.`
    },
    {
      title: "Evde Şarj Maliyeti Hesaplama: Akaryakıta Karşı Ne Kadar Tasarruf Sağlar?",
      slug: "evde-sarj-maliyeti-hesaplama-tasarruf-analizi",
      summary: "Kendi evinizde şarj ettiğiniz elektrikli aracın km başına tüketim maliyetini hesaplıyor ve benzin/dizel motorlu araçlarla karşılaştırarak amortisman tablosunu çıkarıyoruz.",
      imageUrl: "https://images.unsplash.com/photo-1558441719-ff34b0524a24?w=800",
      isFeatured: false,
      categoryId: categoryMap['elektrikli-araclar'],
      content: `## Elektrikli Araç Evde Şarj Maliyet Analizi

Elektrikli araçların sunduğu en büyük avantajlardan biri, fosil yakıtlara kıyasla kilometre başına sunduğu inanılmaz düşük işletme maliyetidir. Peki, evde şarj edilen bir elektrikli araç gerçekten ne kadar tasarruf sağlar? Gelin güncel tarifelerle somut bir matematiksel hesaplama yapalım.

### 1. Ev Elektrik Tarifesiyle Tüketim Hesabı
Türkiye'de evsel elektrik tüketiminde kademeli tarife uygulanmaktadır. Düşük kademe ve yüksek kademe elektrik fiyatları (dağıtım bedeli ve vergiler dahil) üzerinden ortalama bir birim fiyat belirleyelim:
* Ortalama Ev Tipi Elektrik Birim Fiyatı: **~2.8 TL / kWh** (Ortalama kademe baz alınmıştır).

Standart bir elektrikli aracın (örneğin Tesla Model Y veya Togg T10X) 100 kilometrede ortalama **17 kWh** enerji tükettiğini varsayalım.
* **100 km Evde Şarj Maliyeti:** 17 kWh x 2.8 TL = **47.6 TL**
* **1 km Evde Şarj Maliyeti:** ~0.48 TL (48 Kuruş!)

### 2. Benzinli/Dizel Araç ile Karşılaştırma
Ortalama 100 kilometrede 7 litre benzin tüketen standart bir içten yanmalı arabayı ele alalım. Benzinin litre fiyatını ortalama **43 TL** varsayalım:
* **100 km Benzin Maliyeti:** 7 Litre x 43 TL = **301 TL**
* **1 km Benzin Maliyeti:** ~3.01 TL

### 3. Yıllık Tasarruf Tablosu
Yılda ortalama **15.000 kilometre** yol yapan bir sürücü için yıllık yakıt gideri karşılaştırması şu şekildedir:
* **Benzinli Araç Yıllık Yakıt Gideri:** 15.000 km x 3.01 TL = **45.150 TL**
* **Elektrikli Araç Yıllık Şarj Gideri (Evden):** 15.000 km x 0.48 TL = **7.200 TL**
* **Yıllık Net Kazanç (Tasarruf):** **37.950 TL**

### İstasyon Şarjı ve Diğer Koşullar
Eğer şarjınızı tamamen evden değil de dışarıdaki yüksek hızlı DC şarj istasyonlarından yaparsanız, kWh maliyeti 8 TL ile 10 TL arasında değişecektir. Bu durumda bile km başına maliyetiniz ~1.50 TL civarında kalır ve benzinli araca kıyasla yarı yarıya tasarruf sağlamaya devam edersiniz.

### Sonuç
Eğer aracınızı kendi evinizde veya iş yerinizde yavaş AC şarj ile doldurma imkanına sahipseniz, elektrikli araçlar yakıt bütçenizi yaklaşık **%80-85 oranında düşürür**.`
    },
    {
      title: "Menzil Kaygısını (Range Anxiety) Yenmek: Uzun Yolculuk İpuçları",
      slug: "menzil-kaygisini-yenmek-uzun-yolculuk-rehberi",
      summary: "Elektrikli araç sürücülerinin en büyük endişelerinden biri olan menzil kaygısını aşmak ve sorunsuz uzun yol rotaları planlamak için en etkili taktikler.",
      imageUrl: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800",
      isFeatured: false,
      categoryId: categoryMap['elektrikli-araclar'],
      content: `## Elektrikli Araçlar ile Menzil Kaygısını Aşmak

"Menzil Kaygısı" (Range Anxiety), bataryanın yolun ortasında biteceği ve aracın yolda kalacağı korkusudur. Bu korku, elektrikli araçlara yeni geçiş yapan sürücüler arasında oldukça yaygındır. Ancak doğru planlama, modern şarj altyapısı ve akıllı sürüş teknikleriyle bu kaygıyı tamamen geride bırakmak mümkündür.

### 1. Akıllı Rota Planlama Yazılımları Kullanın
Uzun yola çıkmadan önce sadece Google Haritalar'a güvenmeyin. Elektrikli araçlar için özel olarak optimize edilmiş rota planlama araçlarını tercih edin:
* **A Better Routeplanner (ABRP):** Aracınızın modelini, hava durumunu, yol eğimini ve bagaj yükünü hesaba katarak en optimum şarj istasyonu duraklarını ve duraklarda ne kadar süre kalmanız gerektiğini hesaplar.
* **PlugShare:** Türkiye ve dünyadaki tüm şarj ağlarının haritasını sunar. İstasyonların çalışır durumda olup olmadığını diğer kullanıcıların yorum ve check-in işlemlerinden takip edebilirsiniz.

### 2. Batarya Ön Isıtma (Preconditioning) Özelliğini Aktif Edin
Eğer aracınızda batarya ön ısıtma özelliği varsa, hızlı şarj istasyonuna yaklaşırken bu özelliği açın (veya şarj istasyonunu aracın kendi navigasyonuna rota olarak ekleyin). Bu sayede batarya optimum kimyasal sıcaklığa ulaşır ve şarj istasyonuna girdiğiniz anda araç maksimum hızda şarj olmaya başlar. Şarj süreniz yarı yarıya kısalabilir.

### 3. Sürüş Hızınızı Akıllıca Yönetin
Elektrikli araçlar otoyol hızlarında (120 km/s ve üzeri) içten yanmalı araçlara göre çok daha fazla enerji harcar. Rüzgar direnci hızın karesiyle doğru orantılı arttığı için:
* Hızınızı **130 km/s** yerine **110 km/s** seviyesine sabitlemek, menzilinizi yaklaşık **%20 oranında artırabilir**. Bu da ekstra şarj molası vermenizi engelleyerek hedefinize daha erken ulaşmanızı sağlayabilir.

### Sonuç
Gelişen şarj ağı altyapısı sayesinde artık Türkiye'nin hemen hemen her otoyolunda 50-80 km aralıklarla yüksek hızlı DC şarj üniteleri bulunuyor. Doğru yazılımlarla planlanmış bir seyahatte yolda kalmak neredeyse imkansızdır.`
    },

    // --- Kategori: Temiz Enerji ---
    {
      title: "Ev Tipi Güneş Enerjisi Kurulum Rehberi: Adım Adım GES Süreci",
      slug: "ev-tipi-gunes-enerjisi-kurulum-rehberi-ges",
      summary: "Evlerin çatısına kurulan mikro güneş santralleri (GES) için yasal mevzuat, kurulum maliyetleri ve yatırımın geri dönüş süresini tüm gerçekçi verilerle inceliyoruz.",
      imageUrl: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800",
      isFeatured: true,
      categoryId: categoryMap['temiz-enerji'],
      content: `## Çatı Tipi Güneş Enerjisi Sistemleri (GES)

Kendi elektriğini üretmek ve karbon ayak izini sıfırlamak isteyen müstakil ev sahipleri için çatı tipi güneş enerjisi sistemleri (GES) en popüler çözümdür. Türkiye'deki yasal düzenlemeler ve düşen panel maliyetleri, bireysel elektrik üretimini finansal açıdan da mantıklı hale getirdi.

### 1. Kurulum Gücü ve Kapasite İhtiyacı
Standart bir müstakil evin aylık ortalama elektrik tüketimi **250 - 500 kWh** arasındadır. Bu ihtiyacı karşılamak için **5 kW ile 10 kW** arasında değişen bir kurulu güç yeterlidir.
* **10 kW GES için gereken alan:** Yaklaşık 50-60 metrekare gölgesiz çatı alanı.
* **Üretim potansiyeli:** Türkiye'nin güneşlenme oranına göre yılda ortalama 13.000 - 15.500 kWh elektrik üretebilir.

### 2. Yasal İzinler ve Net Selamlama (Mahsuplaşma)
Türkiye'de 10 kW altı çatı tipi GES projeleri için "Lisanssız Elektrik Üretim Yönetmeliği" çerçevesinde aylık mahsuplaşma uygulanır:
* Gündüz ürettiğiniz fazla elektriği şebekeye satarsınız.
* Gece veya kış aylarında şebekeden elektrik tüketirsiniz.
* Ay sonunda üretilen ve tüketilen enerji miktarları karşılaştırılır, eğer fazla üretiminiz varsa elektrik dağıtım şirketi size ödeme yapar.

### 3. Maliyet ve Geri Dönüş (Amortisman) Süresi
Modern güneş panelleri ve invertörlerin maliyeti son 5 yılda ciddi oranda geriledi:
* **10 kW kurulu güç anahtar teslim maliyeti:** ~7.000 - 9.500 USD (inşaat, mühendislik, izinler dahil).
* **Yıllık tasarruf/gelir potansiyeli:** Ortalama elektrik faturaları göz önüne alındığında, sistem kendini **4.5 ila 6 yıl** arasında amorti etmektedir. Güneş panellerinin ömrünün minimum 25 yıl olduğu düşünüldüğünde, sistem kendini amorti ettikten sonra en az 20 yıl boyunca tamamen ücretsiz elektrik sunmaktadır.

### Sonuç
Güneş enerjisi yatırımları, çevre dostu olmanın yanı sıra enflasyona ve artan enerji fiyatlarına karşı ev bütçenizi koruyan en güvenli uzun vadeli yatırımlardan biridir.`
    },
    {
      title: "Isı Pompası Nedir? Isınma ve İklimlendirmede Enerji Verimliliği",
      slug: "isi-pompasi-nedir-enerji-verimliligi-karsilastirmasi",
      summary: "Doğalgaz ve klimaya karşı enerji tüketiminde 4 kata kadar tasarruf sağlayan ısı pompası teknolojisini, çalışma prensibini ve ev içi kullanım senaryolarını ele alıyoruz.",
      imageUrl: "https://images.unsplash.com/photo-1581094288338-2314dddb7ecc?w=800",
      isFeatured: false,
      categoryId: categoryMap['temiz-enerji'],
      content: `## Isı Pompası Teknolojisi ve Verimlilik Analizi

Karbon nötr bir geleceğe giden yolda, binaların ısınma sistemlerinin elektrikli hale getirilmesi kritik bir adımdır. Bu dönüşümün en önemli aktörü ise "Isı Pompası" (Heat Pump) teknolojisidir. Isı pompaları ısıyı üretmek yerine taşır, bu sayede inanılmaz yüksek verimlilik değerlerine ulaşır.

### 1. Isı Pompası Nasıl Çalışır?
Isı pompası, temel olarak evlerimizde bulunan buzdolabı veya klimaların çalışma prensibine sahiptir. Dış ortamdaki (hava, toprak veya su) düşük sıcaklıktaki ısıyı alır, soğutucu akışkan yardımıyla sıkıştırarak sıcaklığını artırır ve evinizin ısıtma tesisatına (yerden ısıtma veya radyatörler) aktarır.

### 2. COP Değeri (Verimlilik Katsayısı)
Isı pompalarının verimliliği **COP (Coefficient of Performance)** katsayısı ile ölçülür:
* Standart bir elektrikli ısıtıcı 1 kW elektrik harcayarak 1 kW ısı üretir (COP = 1).
* Ortalama bir ısı pompası ise 1 kW elektrik harcayarak dış ortamdan taşıdığı enerjiyle **3.5 ila 4.5 kW** arasında ısı enerjisi sunar (COP = 3.5 - 4.5). Yani verimlilik oranı **%350 - %450** arasındadır!

### 3. Doğalgaz ve Klima ile Karşılaştırma
* **Doğalgaz Kombileri:** Verimlilikleri maksimum %90-95 civarındadır ve fosil yakıt tüketerek karbon salınımı yaparlar.
* **Isı Pompası:** Çatı tipi güneş paneli sistemleri ile entegre edildiğinde evinizi neredeyse sıfır enerji maliyetiyle ve tamamen yeşil enerjiyle ısıtmanızı (ve yaz aylarında soğutmanızı) sağlar.

### Sonuç
Kurulum maliyeti doğalgaz kombilerine kıyasla daha yüksek olsa da, işletme maliyetindeki büyük düşüş ve karbon salınımı yapmaması sayesinde ısı pompaları yeni nesil modern konut projelerinin vazgeçilmez standardı haline gemektedir.`
    },
    {
      title: "Yenilenebilir Enerji Kooperatifleri: Bireysel Tüketiciler İçin Yeni Model",
      slug: "yenilenebilir-enerji-kooperatifleri-bireysel-uretim",
      summary: "Çatısı güneş paneli kurulumuna uygun olmayan apartman sakinleri ve bireysel tüketiciler için ortak enerji üretim kooperatiflerinin yasal ve finansal yapısını inceliyoruz.",
      imageUrl: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=800",
      isFeatured: false,
      categoryId: categoryMap['temiz-enerji'],
      content: `## Yenilenebilir Enerji Kooperatifleri ile Ortak Üretim

Güneş veya rüzgar enerjisinden elektrik üretmek harika bir fikir olsa da herkes müstakil bir eve veya kuruluma uygun geniş bir çatıya sahip değildir. Apartman dairelerinde yaşayanlar veya kiracılar için temiz enerji üretimine katılmanın en demokratik ve finansal olarak karlı yolu **Yenilenebilir Enerji Kooperatifleri**dir.

### 1. Enerji Kooperatifi Nedir?
Enerji kooperatifleri, birden fazla bireysel tüketicinin bir araya gelerek ortak sermayeyle büyük ölçekli bir güneş veya rüzgar santrali kurmasıdır. Kurulan bu santralden elde edilen gelir veya üretilen elektrik, ortakların katılım oranlarına (hisselerine) göre paylaşılır.

### 2. Yasal Altyapı ve Lisanssız Üretim
Türkiye'de enerji kooperatifleri kurularak lisanssız elektrik üretimi yapılmasına yasal olarak izin verilmektedir:
* Kooperatif ortakları, kendi evlerinin veya ticari işletmelerinin elektrik aboneliklerini kooperatif üretimi ile ilişkilendirebilirler.
* Uzaktaki bir arazide kooperatif tarafından üretilen elektrik, üyelerin kendi evlerindeki faturalarından düşülür (mahsuplaşma yöntemi).

### 3. Avantajları Nelerdir?
* **Düşük Giriş Bariyeri:** Kendi başınıza büyük bir arazi GES yatırımı yapamazken, kooperatiften birkaç hisse alarak bütçenize uygun miktarda temiz enerji yatırımı yapabilirsiniz.
* **Profesyonel Yönetim:** Santralin bakımı, temizliği, sigortası ve yasal süreçleri kooperatif yönetimi tarafından yürütülür; siz bireysel olarak bu operasyonel işlerle uğraşmazsınız.

### Sonuç
Avrupa'da (özellikle Almanya ve Danimarka'da) elektrik üretiminin çok ciddi bir kısmı vatandaş kooperatiflerinin elindedir. Türkiye'de de yaygınlaşan bu model, hem enerji bağımsızlığımızı artırmakta hem de bireysel yatırımcılar için güvenli bir pasif gelir kapısı sunmaktadır.`
    },

    // --- Kategori: Girişimcilik & SaaS ---
    {
      title: "Climate-Tech ve SaaS: Karbon Ayak İzi Takip Yazılımlarının Yükselişi",
      slug: "climate-tech-ve-saas-karbon-takip-yazilimlari",
      summary: "Yeşil mutabakat kuralları ve sınırda karbon vergisi düzenlemeleriyle birlikte şirketlerin emisyonlarını ölçen ve yöneten SaaS çözümlerini mercek altına alıyoruz.",
      imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800",
      isFeatured: false,
      categoryId: categoryMap['girisimcilik-saas'],
      content: `## Climate-Tech Pazarında Yükselen Trend: Karbon SaaS Çözümleri

İklim kriziyle mücadelede "ölçemediğiniz şeyi yönetemezsiniz" ilkesi geçerlidir. Şirketlerin karbon ayak izini ölçmesi, raporlaması ve azaltması yasal bir zorunluluk haline geldikçe, bu süreci otomatize eden yazılım girişimleri (Carbon Accounting SaaS) milyar dolarlık pazar değerlerine ulaşıyor.

### 1. Karbon Raporlaması Neden Zorunlu Hale Geliyor?
Avrupa Birliği'nin **Sınırda Karbon Düzenleme Mekanizması (CBAM / Carbon Border Adjustment Mechanism)** başta olmak üzere küresel düzenlemeler, ihracat yapan firmaların karbon salınımlarını beyan etmelerini ve sınırda vergi ödemelerini zorunlu kılıyor. Şirketler artık sadece finansal bilançolarını değil, "karbon bilançolarını" da sunmak zorundalar.

### 2. Karbon SaaS Yazılımları Ne İşe Yarar?
Bu bulut tabanlı yazılımlar (örneğin Watershed, Sweep, CarbonSights):
* Şirketlerin ERP, enerji faturaları, seyahat verileri ve tedarik zinciri datalarını API'ler aracılığıyla çeker.
* **Scope 1 (Doğrudan emisyonlar), Scope 2 (Tüketilen elektrik) ve Scope 3 (Tedarik zinciri emisyonları)** seviyesindeki tüm karbon salınımlarını yapay zeka desteğiyle anlık olarak hesaplar.
* Uluslararası standartlara (GHG Protocol, ESG) uygun resmi denetim raporları hazırlar.

### 3. İş Modeli ve Pazar Fırsatı
Geleneksel danışmanlık firmalarıyla aylar süren karbon ölçümleri, SaaS yazılımları sayesinde sürekli, dinamik ve çok daha düşük maliyetli hale gelmektedir. Bu girişimler genellikle yıllık abonelik (annual subscription) ve veri entegrasyon hacmine göre lisanslama modeliyle çalışır.

### Sonuç
Tedarik zincirlerini yeşillendirmek isteyen küresel devler, alt tedarikçilerinden de karbon verisi talep etmektedir. Karbon takibi yapan SaaS girişimleri, önümüzdeki 10 yılın en hızlı büyüyen B2B yazılım dikeyi olmaya adaydır.`
    },
    {
      title: "Güneş Enerjisi Sektöründe SaaS İş Modelleri ve Dijital Dönüşüm",
      slug: "gunes-enerjisi-sektorunde-saas-is-modelleri",
      summary: "Güneş paneli kurulum firmalarının iş süreçlerini, çatı analizlerini ve fizibilite raporlarını dakikalar içinde otomatize eden yazılım odaklı dikey SaaS girişimleri.",
      imageUrl: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800",
      isFeatured: false,
      categoryId: categoryMap['girisimcilik-saas'],
      content: `## Güneş Enerjisi Sektöründe Dikey SaaS Girişimleri

Güneş enerjisi sektörü donanım odaklı görünse de, arka plandaki mühendislik tasarımı, müşteri edinimi ve teklif hazırlama süreçleri ciddi bir yazılım ihtiyacı doğurmaktadır. Kurulum (EPC) firmalarının bu operasyonel yüklerini azaltan dikey SaaS araçları hızla yaygınlaşıyor.

### 1. Solar CAD ve Çatı Analiz Yazılımları
Geleneksel yöntemlerle bir çatıya kaç panel sığacağını ve ne kadar elektrik üreteceğini hesaplamak saatler süren CAD çizimleri gerektirirdi. Modern güneş SaaS araçları (örneğin Aurora Solar veya PVsyst entegre bulut araçları):
* Uydu görüntüleri ve LiDAR verilerini kullanarak çatının 3 boyutlu modelini saniyeler içinde çıkarır.
* Gölgelenme analizlerini yaparak en optimum panel yerleşimini otomatik çizer.

### 2. Hızlı Fizibilite ve Satış Otomasyonu
Solar SaaS çözümleri, satış ekiplerinin sahaya gitmeden müşteriye özel interaktif web sayfaları üzerinden teklif sunmasını sağlar. Müşteri, çatısına kurulacak panelleri 3D görebilir, finansal geri dönüş simülasyonunu inceleyebilir ve sözleşmeyi online imzalayabilir.

### 3. Operasyonel Verimlilik ve Yatırım Geri Dönüşü
Yazılım kullanan kurulum firmaları, müşteri kazanım maliyetlerini (CAC) ortalama **%30-40 oranında düşürebilmekte** ve mühendislik planlama sürelerini günlerden dakikalara indirebilmektedir.

### Sonuç
Güneş enerjisi donanımı ucuzladıkça, yazılım tabanlı süreç optimizasyonu kurulum şirketlerinin karlılıklarını korumaları için en kritik rekabet avantajı haline gelmektedir.`
    },
    {
      title: "Yeşil Girişimlerde Hibe ve Yatırım Fırsatları (Climate-Tech VC Piyasası)",
      slug: "yesil-girisimlerde-hibe-ve-yatirim-firsatlari-climate-tech-vc",
      summary: "Avrupa Yeşil Mutabakatı, TÜBİTAK destekleri ve sürdürülebilirlik odaklı girişim sermayesi fonlarının Climate-Tech girişimlerine sunduğu finansal kaynaklar.",
      imageUrl: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=800",
      isFeatured: false,
      categoryId: categoryMap['girisimcilik-saas'],
      content: `## Climate-Tech Girişimleri İçin Finansman Kaynakları

Dünya genelinde net-zero hedeflerine ulaşmak için trilyonlarca dolarlık yatırım gerekiyor. Bu durum, sürdürülebilirlik ve iklim teknolojileri üreten girişimler (Climate-Tech) için benzeri görülmemiş hibe ve girişim sermayesi (VC) fırsatları yaratıyor.

### 1. Kamu Hibeleri ve Uluslararası Destekler
Yeşil girişimler, donanım ve derin teknoloji (Deep-Tech) Ar-Ge'si gerektirdiğinden kamu fonları başlangıç aşamasında hayati önem taşır:
* **TÜBİTAK Yeşil Mutabakat Destekleri:** Karbon emisyonu azaltımı, enerji verimliliği ve döngüsel ekonomi projelerine odaklanan yerli girişimlere önemli hibe ve geri ödemesiz destekler sunmaktadır.
* **AB Horizon Europe (Ufuk Avrupa):** Milyarlarca avroluk bütçesiyle çevre, temiz enerji ve akıllı ulaşım alanındaki girişimlerin Ar-Ge çalışmalarını doğrudan fonlar.

### 2. Girişim Sermayesi (Climate-Tech VC) Trendleri
Dünyada ve Türkiye'de sadece sürdürülebilirlik odağı olan özel fonların (Impact Investors / Etki Yatırımcıları) sayısı hızla artıyor. Emisyon azaltım potansiyeli yüksek olan girişimler önceliklidir.

### 3. Yatırımcıların Aradığı Temel Kriterler
* **Ölçeklenebilirlik:** Teknolojinizin küresel pazara kolayca ihraç edilebilir olması.
* **Etki Metrikleri:** Yatırım aldığınızda ton bazında ne kadar karbon emisyonunu engelleyebileceğinizi net verilerle ispatlayabilmeniz.

### Sonuç
Eğer çevreye pozitif etkisi olan bir yazılım veya donanım geliştiriyorsanız, geleneksel yazılım alanlarına kıyasla finansmana erişim şansınız bugün çok daha yüksektir.`
    },

    // --- Kategori: Trend Teknolojiler ---
    {
      title: "Katı Hal Pilleri (Solid-State): Batarya Teknolojisinde Devrim Yakın mı?",
      slug: "kati-hal-pilleri-solid-state-batarya-teknolojisi",
      summary: "Mevcut sıvı elektrolitli pillerin yerini alması beklenen katı hal bataryalarının sunduğu güvenlik, 2 kat yüksek enerji yoğunluğu ve ultra hızlı şarj potansiyeli.",
      imageUrl: "https://images.unsplash.com/photo-1617791160505-6f006e121980?w=800",
      isFeatured: true,
      categoryId: categoryMap['trend-teknolojiler'],
      content: `## Batarya Teknolojisinin Kutsal Kasesi: Katı Hal Pilleri

Mevcut elektrikli araçlarda kullanılan lityum iyon bataryalar sıvı veya jel kıvamında bir elektrolit içerir. Bu sıvı elektrolitler aşırı ısınma durumunda yanıcı olabilir ve enerji yoğunluğu sınırlarına yaklaşmıştır. Katı Hal Pilleri (Solid-State Batteries) ise bu sıvıyı tamamen katı seramik veya polimer malzemelerle değiştirerek batarya dünyasında yeni bir çağ açmaya hazırlanıyor.

### 1. Katı Hal Pillerinin Sunduğu Büyük Avantajlar
* **İki Kat Enerji Yoğunluğu:** Aynı hacimde geleneksel pillere göre yaklaşık 2 kat daha fazla enerji depolanabilir. Bu, bugün 500 km menzil sunan bir elektrikli aracın batarya boyutunu değiştirmeden **1.000 km menzile** ulaşması anlamına gelir.
* **Ultra Hızlı Şarj:** Sıvı pillerde hızlı şarj sırasında oluşan dendrit adı verilen kristaller pili kısa devre yapabilir. Katı hal pillerinde ise bu risk yoktur ve pil **10 dakikanın altında** %80 seviyesine şarj edilebilir.
* **Maksimum Güvenlik:** Tamamen katı malzemelerden oluştukları için sızıntı yapmazlar, aşırı sıcakta veya kaza anında alev almazlar.

### 2. Ticari Üretim Zorlukları ve Yol Haritası
Laboratuvar ortamında harika çalışan katı hal pillerinin seri üretimi oldukça zordur. Katı katmanların birbirine teması ve üretim maliyetlerinin düşürülmesi üzerinde çalışmalar devam etmektedir. Toyota, Samsung SDI ve QuantumScape gibi devler, **2027-2028 yılları arasında** ilk seri üretim katı hal pilli elektrikli araçları yollara çıkarmayı hedefliyor.

### Sonuç
Katı hal pilleri yaygınlaştığında elektrikli araçların şarj süresi benzin deposu doldurma süresine inecek ve menzil kaygısı tamamen tarihe karışacaktır.`
    },
    {
      title: "Yapay Zeka ve Akıllı Şebekeler: Şebeke Dengesini Korumak",
      slug: "yapay-zeka-ve-akilli-sebekeler-grid-optimizasyonu",
      summary: "Yenilenebilir enerjinin süreksizliğini (rüzgar kesilmesi, bulutlu hava) ve EV şarj yüklerini yapay zeka modelleriyle anlık tahmin edip dengeleyen akıllı grid teknolojileri.",
      imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800",
      isFeatured: false,
      categoryId: categoryMap['trend-teknolojiler'],
      content: `## Akıllı Şebekelerin Yönetiminde Yapay Zeka Dönemi

Rüzgar ve güneş gibi yenilenebilir enerji kaynakları hava durumuna bağlı olduğu için kesintilidir (bulut geçtiğinde güneş enerjisi düşer, rüzgar durduğunda üretim sıfırlanır). Aynı zamanda milyonlarca elektrikli aracın akşam saatlerinde eş zamanlı şarja takılması elektrik şebekesinde büyük yük dalgalanmaları yaratır. Bu karmaşık denklemi yönetmenin tek yolu **Akıllı Şebekeler ve Yapay Zeka** entegrasyonudur.

### 1. AI Destekli Üretim ve Tüketim Tahminleme
Yapay zeka algoritmaları, geçmiş hava durumu verileri, uydu görüntüleri ve rüzgar ölçümlerini analiz ederek güneş ve rüzgar santrallerinin ne kadar elektrik üreteceğini **dakikalık hassasiyetle** tahmin eder. Eş zamanlı olarak, şehirlerin tüketim alışkanlıklarını analiz ederek enerji talebini öngörür.

### 2. Akıllı Yük Dengeleme (Smart Charging)
Bir sitede veya şehirde 100 elektrikli araç aynı anda şarj istasyonuna bağlandığında şebekenin çökmesini önlemek için AI devreye girer:
* Araçların aciliyet durumuna (örneğin sabah işe gidecek olanlar öncelikli) ve şebekedeki elektrik fiyatının en ucuz olduğu saatlere göre şarj gücünü dinamik olarak dağıtır.

### Sonuç
Yapay zeka destekli yönetim sistemleri olmaksızın, tamamen yenilenebilir enerjiye dayalı ve elektrikli araçlarla donatılmış modern bir şehrin enerji altyapısını kesintisiz sürdürmek mümkün değildir.`
    },
    {
      title: "V2G (Vehicle-to-Grid) Teknolojisi ile Evinizi Besleyin",
      slug: "v2g-vehicle-to-grid-teknolojisi-iki-yonlu-sarj",
      summary: "Elektrikli aracınızı devasa bir mobil jeneratöre dönüştüren, elektrik kesintisinde evinizi beslemenizi ve şebekeye enerji satmanızı sağlayan iki yönlü şarj teknolojisi.",
      imageUrl: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800",
      isFeatured: false,
      categoryId: categoryMap['trend-teknolojiler'],
      content: `## Elektrikli Araçlar Mobil Güç Kaynakları Oluyor: V2G

Ortalama bir elektrikli araç bataryası (örneğin 75 kWh), standart bir hanenin **4-5 günlük elektrik ihtiyacını** tek başına karşılayabilecek güçtedir. "Vehicle-to-Grid" (Araçtan Şebekeye) veya "Vehicle-to-Home" (Araçtan Eve) teknolojileri, bu devasa depolama kapasitesini sadece sürüş için değil, şebekeyi dengelemek ve elektrik kesintilerini önlemek için de kullanmamızı sağlar.

### 1. İki Yönlü Şarj (Bi-directional Charging) Nasıl Çalışır?
Geleneksel şarj istasyonları elektriği sadece şebekeden araca doğru tek yönlü iletir. İki yönlü şarj altyapısı ise aracın bataryasındaki DC (doğru akım) elektriği AC (alternatif akım) elektriğe dönüştürerek ev tesisatınıza veya doğrudan elektrik şebekesine geri gönderebilir.

### 2. Finansal Fırsatlar: Elektriği Ucuza Al, Pahalıya Sat
Elektrik tarifelerinin gün içinde saatlik değiştiği ülkelerde (veya geleceğin akıllı şebekelerinde):
* Aracınızı elektriğin en ucuz olduğu gece saatlerinde şarj edersiniz.
* Elektriğin ve talebin en yoğun (ve en pahalı) olduğu akşam saatlerinde ise bataryanızdaki enerjinin bir kısmını şebekeye geri satarak kar elde edersiniz.

### 3. Acil Durum Jeneratörü Olarak Kullanım (V2H)
Deprem, fırtına veya altyapı arızaları nedeniyle yaşanan elektrik kesintilerinde, elektrikli aracınız evinize bağlanarak buzdolabınızı, aydınlatmanızı ve ısınma sistemlerinizi günlerce kesintisiz çalıştırabilir.

### Sonuç
V2G teknolojisi yaygınlaştığında yollardaki milyonlarca elektrikli araç, şebekenin en büyük temiz enerji depolama deposuna dönüşecek ve yeşil enerji geçişini ciddi şekilde hızlandıracaktır.`
    }
  ];

  console.log(`Prepared ${articles.length} high-quality articles. Converting to HTML and inserting...`);

  let count = 0;
  for (const a of articles) {
    try {
      const htmlContent = mdToHtml(a.content);
      await prisma.article.create({
        data: {
          title: a.title,
          slug: a.slug,
          summary: a.summary,
          content: htmlContent,
          imageUrl: a.imageUrl,
          isFeatured: a.isFeatured,
          categoryId: a.categoryId,
          publishedAt: new Date(),
        }
      });
      count++;
    } catch (e) {
      console.error(`Failed to insert article ${a.title}:`, e.message);
    }
  }

  console.log(`\n=== Successfully seeded ${count} real articles (HTML Format with Windows Fix)! ===`);
  await prisma.$disconnect();
}

main().catch(console.error);
