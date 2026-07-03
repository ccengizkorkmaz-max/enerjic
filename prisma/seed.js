const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Clear existing data
  await prisma.article.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.setting.deleteMany({});
  await prisma.adPlacement.deleteMany({});

  // Add settings
  await prisma.setting.createMany({
    data: [
      { key: 'site_name', value: 'Enerjic' },
      { key: 'site_title', value: 'Enerjic - Temiz Enerji ve Sürdürülebilir Teknolojiler' },
      { key: 'site_description', value: 'Elektrikli araçlar, temiz enerji, girişimcilik ve yeşil SaaS.' },
    ],
  });

  // Add AdPlacements
  await prisma.adPlacement.createMany({
    data: [
      { slotCode: 'header_banner', adClient: 'ca-pub-3275598773792351', adSlot: '1111111111', minHeight: 90 },
      { slotCode: 'sidebar_top', adClient: 'ca-pub-3275598773792351', adSlot: '2222222222', minHeight: 250 },
      { slotCode: 'in_article_p3', adClient: 'ca-pub-3275598773792351', adSlot: '3333333333', minHeight: 250 },
    ],
  });

  // Add Categories
  const c1 = await prisma.category.create({
    data: {
      name: 'Elektrikli Araçlar',
      slug: 'elektrikli-araclar',
      description: 'Elektrikli otomobiller, batarya teknolojileri ve otonom sürüş sistemleri.',
    },
  });

  const c2 = await prisma.category.create({
    data: {
      name: 'Temiz Enerji',
      slug: 'temiz-enerji',
      description: 'Güneş, rüzgar, hidrojen ve diğer sürdürülebilir enerji kaynakları.',
    },
  });

  const c3 = await prisma.category.create({
    data: {
      name: 'Girişimcilik & SaaS',
      slug: 'girisimcilik-saas',
      description: 'Yeşil girişimler, karbon izleme yazılımları ve çevre dostu dijital girişimcilik.',
    },
  });

  const c4 = await prisma.category.create({
    data: {
      name: 'Trend Teknolojiler',
      slug: 'trend-teknolojiler',
      description: 'Yapay zeka destekli enerji verimliliği ve döngüsel ekonomi trendleri.',
    },
  });

  // Add Articles
  await prisma.article.create({
    data: {
      title: 'Geleceğin Elektrikli Araçlarında Katı Hal Pilleri Devrimi',
      slug: 'kati-hal-pilleri-devrimi',
      summary: 'Geleneksel lityum-iyon bataryaların yerini alacak katı hal (solid-state) piller, elektrikli araçların menzilini ikiye katlarken şarj sürelerini dakikalara indiriyor.',
      content: `
        <p>Elektrikli otomobil pazarı son yıllarda benzeri görülmemiş bir hızla büyürken, otomotiv üreticileri ve pil mühendisleri araçların en kritik bileşeni olan batarya teknolojisinde devrim yaratmaya hazırlanıyor. Mevcut elektrikli araçlarda kullanılan lityum-iyon bataryalar, menzil limitleri ve uzun şarj süreleriyle kullanıcılar için hala bir soru işareti olmaya devam ediyor. Ancak bu durum katı hal pillerinin ticarileşmesiyle tamamen değişebilir.</p>
        
        <p>Katı hal bataryaları (Solid-State Batteries), sıvı elektrolit yerine katı bir iletken malzeme kullanır. Bu yapısal değişim, pillerin enerji yoğunluğunu dramatik biçimde artırırken aşırı ısınma ve yangın gibi güvenlik risklerini neredeyse sıfıra indirir. Mühendisler, aynı ağırlıktaki bir katı hal pilinin, standart bir lityum-iyon pilden iki kat daha fazla enerji depolayabildiğini belirtiyorlar.</p>
        
        <p>Peki bu teknoloji ne zaman yollarda olacak? Dünyanın en büyük otomotiv devleri ve pil üreticileri, 2027 ile 2030 yılları arasında seri üretim katı hal pillerine sahip elektrikli otomobilleri piyasaya süreceklerini duyurdular. İlk etapta lüks segment araçlarda kullanılacak olan bu bataryaların, üretim kapasitesinin artmasıyla birlikte orta ve alt segment araçlara da yayılması bekleniyor.</p>
        
        <p>Sonuç olarak, katı hal pilleri sadece şarj sürelerini 10 dakikanın altına indirmekle kalmayacak, aynı zamanda elektrikli araçların tek bir şarjla 1000 kilometrenin üzerinde yol kat etmesini sağlayacak. Bu teknolojik sıçrama, fosil yakıtlı araçların tarih sahnesinden çekilme sürecini beklenenden çok daha fazla hızlandıracaktır.</p>
      `,
      imageUrl: '/images/electric_car_future.png',
      viewCount: 1540,
      isFeatured: true,
      categoryId: c1.id,
    },
  });

  await prisma.article.create({
    data: {
      title: 'Binalarda Şeffaf Güneş Paneli Dönemi Başlıyor',
      slug: 'seffaf-gunes-paneli-donemi',
      summary: 'Gökdelenlerin pencerelerini birer enerji santraline dönüştürecek şeffaf güneş pilleri, şehir mimarisini ve temiz enerji üretim yöntemlerini kökten değiştiriyor.',
      content: `
        <p>Şehirlerdeki devasa cam gökdelenler, modern mimarinin sembolü olmanın ötesinde, artık kendi temiz enerjilerini üreten dikey güneş çiftliklerine dönüşebilir. Araştırmacılar, pencerelerin ışığı geçirmesini engellemeden güneş ışınlarını yakalayan yüksek verimli şeffaf fotovoltaik hücreler geliştirmeyi başardılar.</p>
        
        <p>Bu yeni teknoloji, görünür ışığı geçirirken ultraviyole ve kızılötesi gibi insan gözünün göremediği ışık dalgalarını emerek elektrik enerjisine dönüştürüyor. Böylece binaların dış cepheleri estetikten ödün vermeden temiz enerji kaynağı haline geliyor.</p>
        
        <p>Geleneksel çatılara yerleştirilen güneş panelleri alan kısıtlılığı sebebiyle yüksek katlı binaların enerji ihtiyacının ancak küçük bir kısmını karşılayabiliyordu. Şeffaf güneş camları ise tüm gökdelenin yüzeyini kaplayarak devasa bir üretim alanı yaratıyor.</p>
        
        <p>Geliştirici şirketler, bu panellerin verimlilik oranlarını artırmak için nanoteknolojik kaplamalar üzerinde çalışmaya devam ediyor. Yakın gelecekte akıllı telefonların ekranlarında ve elektrikli arabaların camlarında da bu şeffaf pillerin kullanılması hedefleniyor.</p>
      `,
      imageUrl: '/images/solar_panel_roof.png',
      viewCount: 920,
      isFeatured: false,
      categoryId: c2.id,
    },
  });

  await prisma.article.create({
    data: {
      title: 'Avrupa, Rüzgar Enerjisinde Rekor Kapasiteye Ulaştı',
      slug: 'avrupa-ruzgar-enerjisi-rekoru',
      summary: 'Kuzey Denizi’ndeki devasa açık deniz (offshore) rüzgar çiftlikleri sayesinde Avrupa, tek bir yılda rüzgardan elektrik üretiminde tarihi bir rekor kırdı.',
      content: `
        <p>Kuzey Denizi kıyısındaki ülkeler, rüzgar enerjisi yatırımlarında iş birliğini artırarak Avrupa'nın enerji bağımsızlığını güçlendirmeye devam ediyor. Son yayınlanan verilere göre, offshore rüzgar türbinlerinin kapasitesi rekor seviyelere ulaştı.</p>
        
        <p>Yeni nesil türbinler, devasa kanat genişlikleri ve artan jeneratör kapasiteleri sayesinde düşük rüzgar hızlarında dahi yüksek verimlilikle çalışabiliyor. Bu durum rüzgar enerjisini kesintili bir kaynak olmaktan çıkarıp daha kararlı bir yapıya kavuşturuyor.</p>
        
        <p>Kömür ve doğal gaz santrallerinin birer birer kapatıldığı Avrupa genelinde rüzgar enerjisi, temiz elektrik üretiminin omurgasını oluşturuyor. Yatırımların önümüzdeki on yılda üç katına çıkarılması planlanıyor.</p>
        
        <p>Altyapı yatırımları ve devasa deniz üstü trafo merkezleri, üretilen elektriğin kıtadaki sanayi merkezlerine kayıpsız iletilmesini kolaylaştırıyor. Enerji depolama tesisleri de rüzgarsız günler için güvence oluşturuyor.</p>
      `,
      imageUrl: '/images/wind_turbines_landscape.png',
      viewCount: 1120,
      isFeatured: false,
      categoryId: c2.id,
    },
  });

  await prisma.article.create({
    data: {
      title: 'Yeşil SaaS Girişimleri Karbon Vergisine Karşı Yükselişte',
      slug: 'yesil-saas-girisimleri-karbon-vergisi',
      summary: 'Şirketlerin karbon emisyonlarını anlık olarak hesaplayan ve raporlayan SaaS yazılımları, sınırda karbon vergisi düzenlemeleriyle yatırımcıların yeni gözdesi oldu.',
      content: `
        <p>Avrupa Birliği ve Amerika'nın sınırda karbon düzenlemelerini devreye almasıyla birlikte, ihracatçı firmalar için ürettikleri ürünlerin karbon ayak izini belgelemek yasal bir zorunluluk haline geldi. Bu durum, karbon izleme ve sürdürülebilirlik yazılımlarına olan talebi patlattı.</p>
        
        <p>Geliştirilen yeşil SaaS platformları; tedarik zincirinden lojistiğe, fabrika içi enerji tüketiminden ofis kaynaklarına kadar tüm verileri entegre ederek emisyon raporları hazırlıyor. Yapay zeka destekli analizler, karbon azaltımı için optimizasyon yolları da öneriyor.</p>
        
        <p>Girişimcilik dünyasında "ClimateTech" olarak adlandırılan bu dikey, son 12 ayda milyarlarca dolarlık risk sermayesi yatırımı çekti. Yazılım tabanlı çözümler, şirketlerin maliyetlerini düşürürken yeşil dönüşümü kolaylaştırıyor.</p>
        
        <p>Gelecekte tüm kurumsal muhasebe programlarının birer karbon takip modülüne sahip olacağı tahmin ediliyor. Bu dönüşüme erken adapte olan girişimler küresel pazarda büyük avantaj elde ediyor.</p>
      `,
      imageUrl: null,
      viewCount: 420,
      isFeatured: false,
      categoryId: c3.id,
    },
  });

  await prisma.article.create({
    data: {
      title: 'Yapay Zeka Destekli Akıllı Şebekeler ile %30 Enerji Tasarrufu',
      slug: 'yapay-zeka-akilli-sebekeler',
      summary: 'Elektrik dağıtım şebekelerine entegre edilen yapay zeka algoritmaları, yük tahminleri ve dinamik fiyatlandırma ile kayıp-kaçak oranlarını düşürüyor.',
      content: `
        <p>Klasik elektrik şebekeleri, merkezi santrallerden gelen gücü tüketicilere dağıtmak üzerine kurulmuştur. Ancak güneş ve rüzgar gibi değişken kaynakların sisteme dahil olmasıyla şebekelerin anlık dalgalanmaları yönetmesi zorlaştı. İşte bu noktada yapay zeka devreye giriyor.</p>
        
        <p>Yapay zeka modelleri; hava durumu tahminlerini, geçmiş tüketim verilerini ve anlık şebeke yükünü analiz ederek elektrik talebini saniyeler öncesinden öngörüyor. Böylece üretim tesisleri gereksiz yere çalıştırılmıyor ve enerji israfı engelleniyor.</p>
        
        <p>Akıllı sayaçlar vasıtasıyla hanelerin tüketim alışkanlıkları optimize ediliyor. Elektrik fiyatlarının en düşük olduğu saatlerde cihazların çalıştırılması sağlanarak hem tüketici faturası azaltılıyor hem de şebeke rahatlatılıyor.</p>
        
        <p>Test edilen pilot bölgelerde yapay zeka entegrasyonu sayesinde genel elektrik sarfiyatında %30'a varan tasarruf sağlandığı gözlemlendi. Bu teknoloji, şehirlerin karbon ayak izini azaltmada kritik bir rol üstleniyor.</p>
      `,
      imageUrl: null,
      viewCount: 680,
      isFeatured: false,
      categoryId: c4.id,
    },
  });

  console.log('Database successfully seeded!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
