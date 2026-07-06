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
  console.log("=== Seeding 4 New Organic & High-Quality Articles ===");

  // Fetch category IDs dynamically
  const categories = await prisma.category.findMany();
  const categoryMap = {};
  categories.forEach(cat => {
    categoryMap[cat.slug] = cat.id;
  });

  if (!categoryMap['elektrikli-araclar'] || !categoryMap['temiz-enerji'] || !categoryMap['girisimcilik-saas'] || !categoryMap['trend-teknolojiler']) {
    console.error("Required categories are missing.");
    return;
  }

  const newArticles = [
    {
      title: "Hyundai IONIQ 5 Küresel Pazarda Neden Liderliği Kaptırmıyor? Rakipleriyle Detaylı Karşılaştırma",
      slug: "hyundai-ioniq-5-kuresel-pazarda-neden-lider",
      summary: "Hyundai'nin elektrikli ikon modeli IONIQ 5, 2026 yılında da küresel pazarda rekor satış başarılarına imza atıyor. Rakiplerinden sıyrılmasını sağlayan 800V şarj mimarisini ve sürüş dinamiklerini detaylandırıyoruz.",
      imageUrl: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=800&q=80",
      isFeatured: true,
      categoryId: categoryMap['elektrikli-araclar'],
      content: `## Elektrikli Araç Pazarında IONIQ 5 Rüzgarı
      
Otomotiv dünyasında elektrikli araç (EV) dönüşümü büyük bir hızla ilerlerken, bazı modeller sundukları mühendislik çözümleri ve kullanıcı odaklı yaklaşımları sayesinde rakiplerinden belirgin şekilde sıyrılıyor. Hyundai'nin elektrikli otomobil pazarındaki amiral gemisi konumunda olan IONIQ 5, 2026 yılının ilk yarısında küresel pazarlarda elde ettiği satış başarılarıyla bu durumun kalıcı bir trend olduğunu kanıtladı. Ford Mustang Mach-E ve Chevrolet Equinox EV gibi iddialı rakiplerini geride bırakan bu fütüristik otomobilin başarısı, sadece tasarımıyla değil, doğrudan günlük hayatı kolaylaştıran teknolojik donanımlarıyla şekilleniyor.

## 800 Volt Mimarisiyle Zamanı Yönetmek

Elektrikli araç sürücülerinin seyahat ederken karşılaştığı en büyük kaygılardan biri şüphesiz bataryanın dolmasını beklemektir. Sektördeki otomobillerin çok büyük bir kısmı halen 400 volt seviyesindeki elektrik altyapısını kullanırken, IONIQ 5 lüks segment araçlarda görmeye alışkın olduğumuz 800 voltluk ultra hızlı şarj mimarisine ev sahipliği yapıyor. 

Bu teknolojik fark, uygun bir DC istasyonuna bağlandığında bataryayı sadece 18 dakikada yüzde 10'dan yüzde 80 seviyesine çıkarmaya olanak tanıyor. Sadece 5 dakikalık kısa bir kahve molasında dahi yaklaşık 100 kilometrelik ek sürüş mesafesi sunabilen bu sistem, otoyol yolculuklarında elektrikli araç kullanmayı fosil yakıtlı otomobil deneyimine yaklaştırıyor.

## E-GMP Şasisiyle Gelen Konfor ve Genişlik

Hyundai'nin elektrikli araçlar için sıfırdan tasarladığı modüler şasi platformu (E-GMP), sürüş dinamiklerini ve konforu tamamen değiştiriyor. İçten yanmalı motorlu araçların şasileri üzerine monte edilen elektrikli modellerin aksine, bu platformda bataryalar tabana düz bir şekilde yayılıyor ve tekerlekler uç noktalara çekiliyor. 

Sonuç olarak ortaya çıkan 3 metrelik dingil mesafesi, orta sınıf bir crossover'dan lüks bir SUV genişliği elde edilmesini sağlıyor. Düz zemin yapısı ve ileri-geri kaydırılabilen orta konsol gibi detaylar, kabin içindeki hareket özgürlüğünü ve ferahlığı en üst düzeye çıkarıyor.

## İki Yönlü Enerji Paylaşımı ile Mobil Yaşam

IONIQ 5, enerjiyi sadece tüketen değil, ihtiyaç halinde dış dünya ile paylaşan aktif bir elektrik deposu görevi üstleniyor. V2L adı verilen iki yönlü şarj altyapısı, aracın hem dışındaki soket hem de arka koltuk altındaki priz üzerinden 220V alternatif akım çıkışı sağlıyor. 

Bu sayede kamp yaparken küçük bir buzdolabını veya kahve makinesini doğrudan araçtan beslemek, hatta yolda yardıma ihtiyaç duyan başka bir elektrikli otomobili şarj etmek mümkün hale geliyor. Tüm bu özellikler bir araya geldiğinde IONIQ 5, sadece bir ulaşım aracı olmaktan çıkarak kullanıcısının mobil yaşam alanına dönüşüyor.`
    },
    {
      title: "Apartman Sakinleri İçin Güneş Devrimi: Balkon Tipi GES (Balcony Solar) Nedir?",
      slug: "apartman-sakinleri-icin-gunes-devrimi-balkon-ges",
      summary: "Müstakil evi veya geniş çatısı olmayan kiracılar ve apartman sakinleri için geliştirilen balkon tipi güneş panellerini (Balcony Solar), yasal durumunu ve teknik altyapısını inceliyoruz.",
      imageUrl: "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=800&q=80",
      isFeatured: false,
      categoryId: categoryMap['temiz-enerji'],
      content: `## Apartmanlarda Temiz Enerji Dönemi

Yenilenebilir enerji teknolojileri dünya genelinde hızla yayılırken, güneş paneli kurulumları uzun bir süre boyunca sadece geniş müstakil evlerin çatılarıyla ya da büyük sanayi tesisleriyle sınırlı kaldı. Ancak Türkiye başta olmak üzere pek çok ülkede kent nüfusunun çok büyük bir kısmının apartman dairelerinde yaşadığı göz önüne alındığında, yeşil enerjinin gerçek anlamda yaygınlaşması için alternatif çözümler üretilmesi kaçınılmazdı. Son yıllarda adını sıkça duyduğumuz balkon tipi güneş enerjisi sistemleri (Balcony Solar), tam olarak bu ihtiyaca yanıt vererek temiz enerji üretimini apartman dairelerine ve kiracıların hayatına taşıyor.

## Tak-Çalıştır Sistemlerin Basit Mühendisliği

Balkon tipi güneş enerjisi sistemleri, karmaşık kablolama süreçleri ve apartman onayları gibi bürokratik engeller gerektirmeyen, son derece sade ve pratik bir yapıya sahip. Sistem temel olarak hafif tasarlanmış bir veya iki adet güneş paneli ile bu panellerin hemen arkasına monte edilen bir mikro invertörden oluşuyor. 

Panellerin güneş ışığından elde ettiği doğru akım (DC) elektrik, mikro invertör aracılığıyla evde kullandığımız standart 220V alternatif akıma (AC) dönüştürülüyor. Sürücülerin veya ev sahiplerinin yapması gereken tek şey, bu sistemden çıkan fişi balkondaki en yakın prize takmak oluyor. Üretilen elektrik, ev şebekesine dahil olarak buzdolabı, modem, televizyon veya bilgisayar gibi sürekli çalışan cihazlar tarafından anında tüketiliyor.

## Kiracılar İçin Taşınabilir ve Özgür Yatırım

Geleneksel çatı tipi kurulumların en büyük dezavantajı, kalıcı bir yatırım olmaları nedeniyle kiracılar için uygun olmamasıdır. Balkon tipi sistemler ise tamamen taşınabilir şekilde tasarlanıyor. 

Ev değiştirmek istediğinizde panelleri ve kelepçeleri kolayca sökerek yeni dairenizin balkonuna monte edebiliyor, elektrik faturası tasarrufunuza kaldığınız yerden devam edebiliyorsunuz. Ayrıca çatının ortak kullanım alanı olmasından kaynaklanan apartman genel kurulu izinleriyle de uğraşmanız gerekmiyor; çünkü sistem tamamen sizin kendi kullanım alanınız olan balkon sınırları içinde kalıyor.

## Faturalardaki Görünmeyen Etki

Standart bir balkon tipi sistem genellikle 400W ila 800W arasında bir üretim kapasitesine sahip. Türkiye'nin zengin güneşlenme oranları göz önüne alındığında, 800W kapasiteli bir mikro GES, bir hanenin yıllık elektrik ihtiyacının yaklaşık yüzde 35'ini tek başına karşılayabiliyor. 

Özellikle gündüz saatlerinde sürekli arka planda enerji tüketen beyaz eşyaların elektrik maliyeti bu sayede sıfıra yaklaşıyor. Hem bütçe dostu yapısı hem de çevreye katkısıyla bu sistemler, şehir içi konutlarda yeni bir bireysel enerji devriminin kapısını aralıyor.`
    },
    {
      title: "Elektrikli Araçların Ömrünü Tamamlayan Bataryalarına İkinci Hayat: Second-Life Depolama Girişimleri",
      slug: "elektrikli-arac-bataryalarina-ikinci-hayat-second-life",
      summary: "Elektrikli araçlarda menzili düşen bataryaların çöpe gitmesini önleyen, bu pilleri rüzgar ve güneş enerjisi santrallerinde sabit depolama ünitesi olarak kullanan döngüsel ekonomi girişimlerini inceliyoruz.",
      imageUrl: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80",
      isFeatured: false,
      categoryId: categoryMap['girisimcilik-saas'],
      content: `## Bataryaların İkinci Baharı: Döngüsel Ekonomi Girişimleri

Elektrikli araç pazarının devasa bir hızla büyümesi, yakın gelecekte yanıtlanması gereken çok önemli bir soruyu da beraberinde getiriyor: Kullanım ömrünü tamamlayan milyonlarca araç bataryası ne olacak? Elektrikli otomobillerde kullanılan lityum-iyon bataryalar, zaman içinde kapasiteleri yüzde 70-80 seviyesine düştüğünde araçlar için yetersiz kabul edilir ve yenileriyle değiştirilir. Ancak bu durum bataryaların tamamen işlevsiz hale geldiği anlamına gelmez. İçlerinde halen muazzam miktarda enerji depolama potansiyeli barındıran bu piller, yenilikçi yeşil teknoloji girişimleri sayesinde sabit enerji depolama sistemleri olarak yeniden endüstriye kazandırılıyor.

## Hücrelerden Konteynerlere Uzanan Yeniden Üretim Süreci

Elektrikli araçlardan sökülen bataryaların ikinci bir ömür kazanması, detaylı bir mühendislik ve test sürecini zorunlu kılar. İlk aşamada bataryalar modül ve hücre seviyesinde analiz edilerek sağlık durumları ve kalan ömürleri hassas bir şekilde ölçülür. 

Performansını tamamen yitirmiş ya da hasarlı hücreler ayrıştırılarak geri dönüşüme gönderilirken, sağlıklı olan modüller gelişmiş batarya yönetim yazılımlarıyla (BMS) donatılarak yeniden paketlenir. Bu modüller bir araya getirilerek endüstriyel tesisler, güneş santralleri veya elektrik şebekeleri için devasa sabit depolama ünitelerine dönüştürülür.

## Çevre ve Hammadde Üzerindeki Pozitif Etkisi

Yeni bir lityum-iyon pil üretmek, lityum, nikel ve kobalt gibi kritik madenlerin topraktan çıkarılmasından fabrikasyona kadar yüksek karbon salınımına yol açan bir süreçtir. Bataryaların ömrünü bu sabit depolama sistemleriyle 10-15 yıl daha uzatmak, madencilik faaliyetlerinin çevreye verdiği zararı ciddi oranda azaltır. 

Aynı zamanda yeni batarya üretimi ihtiyacını erteleyerek, üretilen her pilin yaşam döngüsü boyunca sunduğu çevresel faydayı maksimuma çıkarır. Bu süreç, sadece karbon salınımını azaltmakla kalmaz, batarya geri dönüşüm teknolojilerinin de olgunlaşması için sektöre zaman kazandırır.

## Yükselen SaaS ve Donanım İş Modelleri

İkinci hayat batarya pazarı, Climate-Tech (iklim teknolojileri) alanında çalışan yeni girişimciler için büyük bir finansal ekosistem yaratıyor. Bataryaların sağlık durumlarını bulut üzerinden anlık olarak analiz eden ve kalan ömür tahminleri yapan yapay zeka destekli SaaS yazılımları, günümüzde en çok yatırım alan alanlar arasında yer alıyor. 

Otomotiv devleriyle anlaşmalar kurarak atık pilleri endüstriyel kesintisiz güç kaynaklarına (UPS) dönüştüren girişimler, hem döngüsel ekonomiye hizmet ediyor hem de enerji depolama maliyetlerini düşürerek yeşil enerji geçişini hızlandırıyor.`
    },
    {
      title: "Şarj Beklemeye Son: CATL'in Avrupa'ya Açılan 5 Dakikalık Batarya Değiştirme (Battery Swap) Teknolojisi",
      slug: "sarj-beklemeye-son-catl-battery-swap-avrupa",
      summary: "Dünyanın en büyük batarya üreticisi CATL, 2.000 istasyona ulaşan hızlı batarya değiştirme (Battery Swap) sistemini Avrupa'ya açıyor. Elektrikli araçlarda şarj sürelerini tarihe gömecek bu yeni altyapıyı inceliyoruz.",
      imageUrl: "https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=800&q=80",
      isFeatured: false,
      categoryId: categoryMap['trend-teknolojiler'],
      content: `## Elektrikli Araçlarda Batarya Değişim Teknolojisi

Elektrikli araçların küresel olarak yaygınlaşmasının önündeki en büyük iki psikolojik engel, uzun yolculuklarda yaşanan menzil kaygısı ve şarj istasyonlarında harcanan süredir. Şarj teknolojileri gelişip güçleri 350 kW seviyesine ulaşsa bile, bir bataryanın yüzde 80 doluluğa ulaşması halen en az 15-20 dakika sürüyor. Bu bekleme süresi, geleneksel akaryakıt dolum süreleriyle kıyaslandığında uzun kalmaktadır. Dünyanın en büyük batarya üreticisi konumundaki Çinli teknoloji devi CATL, bu sorunu şarj sürelerini kısaltarak değil, bataryayı doğrudan değiştirerek çözmeyi hedefleyen modüler batarya değişim sistemini Avrupa pazarına taşıyor.

## Modüler Yapı ve Çikolata Blokları Tasarımı

CATL tarafından geliştirilen ve Evogo adıyla bilinen bu yeni teknoloji, çikolata tabletlerini andıran son derece yenilikçi, küçük modüler batarya blokları kullanıyor. Sürücüler, araçlarının altına yerleştirilen bu kilitli batarya bloklarını otomatik değişim istasyonlarında dakikalar içinde tazeleyebiliyor. 

İstasyona giren araç, robotik kollar vasıtasıyla altındaki boş pilleri bırakıp, sadece 3 ila 5 dakika arasında tam şarjlı yeni batarya paketlerini alarak yoluna devam edebiliyor. Bu süre, geleneksel bir benzin istasyonunda harcanan süreyi neredeyse yakalıyor.

## BaaS Modeli ile Elektrikli Araçlar Daha Erişilebilir

Batarya değiştirme teknolojisinin getirdiği en büyük finansal devrim, araç ve batarya mülkiyetinin birbirinden ayrılmasıdır. Battery-as-a-Service (BaaS) olarak adlandırılan bu iş modelinde, elektrikli bir araç satın alırken en maliyetli bileşen olan bataryaya ücret ödemiyorsunuz. 

Bunun yerine bataryayı bir servis olarak kiralıyor ve aylık kullanım miktarına göre abonelik ücreti ödüyorsunuz. Bu sayede elektrikli araçların başlangıç fiyatları ciddi şekilde düşerken, tüketicinin batarya eskimesi veya kapasite kaybı konusundaki tüm endişeleri de ortadan kalkıyor.

## Şebeke Sağlığı ve Sürdürülebilirlik Katkısı

Araçların otoyollarda anlık olarak yüksek güçle hızlı şarj edilmesi, elektrik şebekelerinde büyük dalgalanmalara yol açar ve batarya sağlığına yüksek ısı nedeniyle zarar verir. Batarya değişim istasyonlarında ise sökülen modüller, klimalı ve optimum koşullara sahip özel odalarda yavaş, dengeli ve sağlıklı bir şekilde şarj edilir. 

Bu durum hem pillerin ömrünü ciddi şekilde uzatıyor hem de şebekeye binen anlık yükü gün içine yayarak enerji güvenliğini destekliyor. CATL'in Çin'de 2.000 istasyonu aşan bu altyapıyı Avrupa genelinde otoyol ağlarına entegre etme adımları, elektrikli ulaşımın geleceğinde şarj kablolarının rolünü tamamen değiştirebilir.`
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

  console.log(`=== Successfully processed ${count} organic articles in DB ===`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
