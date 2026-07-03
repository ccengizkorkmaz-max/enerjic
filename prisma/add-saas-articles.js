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
  console.log("=== Seeding 3 New Seedtable-based SaaS Articles ===");

  // 1. Get the category ID for 'girisimcilik-saas'
  let category = await prisma.category.findUnique({
    where: { slug: 'girisimcilik-saas' }
  });

  if (!category) {
    category = await prisma.category.create({
      data: {
        name: 'Girişimcilik & SaaS',
        slug: 'girisimcilik-saas',
        description: 'Yeşil girişimler, Climate-Tech SaaS girişimleri, karbon muhasebesi yazılımları ve iş modelleri.'
      }
    });
  }

  const articlesToAdd = [
    {
      title: "Avrupa'nın En Hızlı Büyüyen 10 Yeşil SaaS (Climate-Tech) Girişimi",
      slug: "avrupanin-en-hizli-buyuyen-yesil-saas-girisimleri",
      summary: "Avrupa genelinde karbon muhasebesi, sürdürülebilirlik takibi ve emisyon raporlaması sunan en hızlı büyüyen yeşil SaaS (Climate-Tech) girişimlerini ve yenilikçi iş modellerini inceliyoruz.",
      imageUrl: "https://images.pexels.com/photos/3183158/pexels-photo-3183158.jpeg?auto=compress&cs=tinysrgb&w=800",
      isFeatured: false,
      categoryId: category.id,
      content: `## Bulut Teknolojileriyle Dünyayı Kurtarmak: Climate-Tech SaaS
      
İklim kriziyle mücadelede geleneksel yöntemlerin yerini hızla veri odaklı dijital çözümler alıyor. Özellikle Avrupa Birliği'nin getirdiği yeni CSRD (Kurumsal Sürdürülebilirlik Raporlama Direktifi) regülasyonları, şirketlerin karbon ayak izlerini beyan etmesini zorunlu kılıyor. Bu durum, veri analitiği sunan İklim Teknolojisi (Climate-Tech) SaaS girişimlerinin patlama yapmasına yol açtı. İşte Seedtable verilerine göre Avrupa'da en hızlı büyüyen ve en çok dikkat çeken 10 yeşil SaaS girişimi.

### 1. Sweep (Fransa)
Fransa merkezli Sweep, kurumsal şirketlerin tedarik zincirlerindeki karbon emisyonlarını (Kapsam 1, 2 ve 3) izlemelerini, ölçmelerini ve azaltmalarını sağlayan lider bir SaaS platformudur. Sweep, finansal veri takibi hassasiyetinde karbon takibi yapabilmesiyle öne çıkıyor ve son dönemde aldığı dev yatırımlarla dikkat çekiyor.

### 2. Plan A (Almanya)
Berlin merkezli Plan A, yapay zeka destekli kurumsal karbon muhasebesi ve sürdürülebilirlik platformudur. Şirketlerin karbon salınımlarını izlemesini sağlamakla kalmıyor, aynı zamanda bilimsel verilere dayalı emisyon azaltma planları oluşturarak şirketlerin net-sıfır hedeflerine ulaşmalarını hızlandırıyor.

### 3. Greenly (Fransa)
KOBİ odaklı bir karbon muhasebesi yazılımı olan Greenly, banka hesap hareketlerini ve yazılım entegrasyonlarını analiz ederek şirketlerin karbon ayak izini otomatik olarak hesaplar. Kullanıcı dostu arayüzü ve uygun maliyetli yapısıyla KOBİ segmentinde pazar lideri konumundadır.

### 4. Watershed (Birleşik Krallık / ABD)
Avrupa operasyonlarını Londra üzerinden hızla büyüten Watershed, bulut tabanlı bir iklim veri platformudur. Spotify, Airbnb ve Stripe gibi dev teknoloji firmalarının karbon ayak izi ölçümlerinde kullanılan Watershed, pazarın en güçlü kurumsal oyuncularından biri olarak kabul edilmektedir.

### 5. CarbonCloud (İsveç)
Gıda sektörüne odaklanan CarbonCloud, gıda ürünlerinin tarladan sofraya gelene kadar geçen tüm üretim aşamalarındaki karbon salınımını hesaplayan dikey bir SaaS çözümüdür. Gıda markalarının ambalajlarına karbon etiketi koymalarını sağlayarak tüketici bilincini artırmaktadır.

### 6. Climatiq (Almanya)
Climatiq, yazılımcıların mevcut kurumsal yazılımlara (ERP, CRM vb.) karbon hesaplama motorları eklemesini sağlayan güçlü bir API tabanlı SaaS girişimidir. Şirketlerin kendi iç sistemlerinde karbon ölçümü yapabilmelerine olanak tanır.

### 7. Sylvera (Birleşik Krallık)
Karbon dengeleme (carbon offsetting) projelerinin kalitesini ve doğruluğunu yapay zeka ve uydu verileri kullanarak derecelendiren bir SaaS platformudur. Şirketlerin satın aldıkları karbon kredilerinin gerçekten çevreye faydalı olup olmadığını bağımsız olarak doğrular.

### 8. Normative (İsveç)
Avrupa Komisyonu ve çeşitli hükümetlerle ortak projeler yürüten Normative, tam kapsamlı bir kurumsal karbon muhasebesi motorudur. Şirketlerin tedarik zincirlerindeki görünmeyen emisyon kaynaklarını ortaya çıkarır.

### 9. Ecovadis (Fransa)
Şirketlerin tedarik zincirlerindeki sürdürülebilirlik ve ESG (Çevresel, Sosyal ve Yönetişim) performanslarını değerlendiren küresel bir SaaS derecelendirme platformudur. Küresel devlerin tedarikçi seçim kriterlerinde en önemli referans noktasıdır.

### 10. Carbon Metrics (Almanya)
Finansal kuruluşların ve yatırım fonlarının, portföylerindeki şirketlerin iklim risklerini ve karbon salınımlarını analiz etmelerini sağlayan, finans odaklı bir yeşil SaaS girişimidir.`
    },
    {
      title: "İstanbul Girişimcilik Ekosisteminde Öne Çıkan Yerli Sürdürülebilirlik Yazılımları",
      slug: "istanbul-girisimcilik-ekosisteminde-surdurulebilirlik-yazilimlari",
      summary: "İstanbul merkezli yeşil teknoloji ekosisteminde karbon yönetimi, atık takibi ve akıllı enerji çözümleri sunarak öne çıkan yerli sürdürülebilirlik girişimlerini mercek altına alıyoruz.",
      imageUrl: "https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=800",
      isFeatured: false,
      categoryId: category.id,
      content: `## Yerli Teknoloji Dünyasında Yeşil Dönüşüm Dalgası
      
Türkiye'nin coğrafi konumu ve Avrupa Birliği ile olan yoğun ticari ilişkileri, sınırda karbon düzenlemelerinin (SKDM) hayata geçmesiyle birlikte yerli üreticileri karbon takibine zorluyor. Bu dönüşüm, İstanbul merkezli girişimcilik ekosisteminde iklim teknolojileri geliştiren yerli girişimlerin sayısında büyük bir artış getirdi. İşte İstanbul startup ekosisteminde öne çıkan bazı yerli sürdürülebilirlik yazılımları:

### 1. Karbon Muhasebesi ve Emisyon Takip Yazılımları
Yerli üreticilerin AB standartlarına uyum sağlamasını kolaylaştırmak amacıyla geliştirilen yerli karbon muhasebesi yazılımları, fabrikaların ham madde alımından enerji tüketimine kadar tüm süreçleri dijital ortamda takip etmelerini sağlıyor. Bu yazılımlar, ihracatçı firmaların sınırda karbon vergisinden kaçınması için kritik rol oynamaktadır.

### 2. Akıllı Atık Yönetimi ve Döngüsel Ekonomi
İstanbul'da geliştirilen IoT destekli akıllı atık yönetimi yazılımları, belediyelerin ve büyük sanayi tesislerinin atık toplama rotalarını optimize ederek yakıt tüketimini azaltıyor. Ayrıca üretim artıklarının diğer sektörlere ham madde olarak satılmasını sağlayan B2B döngüsel ekonomi pazaryerleri de hızla büyüyor.

### 3. Yapay Zeka Destekli Enerji Verimliliği Girişimleri
Endüstriyel tesislerin elektrik ve doğal gaz tüketimlerini anlık olarak izleyen ve yapay zeka algoritmalarıyla geleceğe yönelik tasarruf önerileri sunan yerli enerji SaaS girişimleri, enerji maliyetlerinin arttığı bu dönemde sanayicilerin en büyük destekçisi haline geldi.

### 4. Tarım Teknolojileri (Agri-Tech) ve Su Yönetimi
İklim krizinin tarım üzerindeki olumsuz etkilerini azaltmak amacıyla geliştirilen akıllı sulama ve hassas tarım yazılımları, çiftçilerin toprak nemine ve hava durumuna göre optimize edilmiş sulama yapmalarını sağlayarak su israfını önlemektedir.`
    },
    {
      title: "Climate-Tech SaaS Yatırımlarında Yükselen Trendler ve İklim Raporlaması",
      slug: "climate-tech-saas-yatirimlarinda-yukselen-trendler",
      summary: "Risk sermayesi (VC) fonlarının yeni gözdesi olan iklim teknolojisi yazılımlarındaki güncel yatırım trendlerini, ESG kriterlerini ve yeni regülasyonların sektöre etkilerini analiz ediyoruz.",
      imageUrl: "https://images.pexels.com/photos/5849577/pexels-photo-5849577.jpeg?auto=compress&cs=tinysrgb&w=800",
      isFeatured: false,
      categoryId: category.id,
      content: `## Küresel Finans Dünyasının Yeni Rotası: Sürdürülebilir Yatırımlar
      
Teknoloji dünyasında yapay zekanın ardından en büyük yatırım çeken dikey, İklim Teknolojileri (Climate-Tech) olmaya devam ediyor. Seedtable ve diğer sektörel veri kaynaklarına göre, risk sermayesi (VC) şirketlerinin SaaS yatırımlarında ESG (Çevresel, Sosyal ve Yönetişim) kriterlerine uyumluluk artık bir ön şart haline geldi. Sektördeki en önemli yatırım trendlerini derledik:

### 1. Regülasyon Güdümlü Büyüme
İklim teknolojisi yatırımlarının en büyük itici gücü yasal zorunluluklardır. AB'nin CSRD düzenlemesi, ABD'deki SEC karbon beyan kuralları ve Türkiye'deki Sınırda Karbon Düzenleme Mekanizması, şirketleri bu yazılımları satın almaya zorluyor. Yatırımcılar, pazarın yasal olarak büyüme garantisi barındırdığını gördükleri için bu dikeye yatırım yapmaktan çekinmiyorlar.

### 2. Kapsam 3 (Scope 3) Emisyon Raporlamasında SaaS Çözümleri
Bir şirketin kendi doğrudan emisyonlarını (Kapsam 1 ve 2) ölçmesi nispeten kolayken, tedarikçilerinin, lojistik ortaklarının ve hatta ürünlerini kullanan tüketicilerin salınımlarını (Kapsam 3) ölçmesi son derece zordur. Bu karmaşık tedarik zinciri ağını analiz edip veri toplayan SaaS platformları şu an en yüksek yatırım değerlemelerine ulaşan girişimlerdir.

### 3. Karbon Dengeleme ve Doğa Tabanlı Kredilerin Doğrulanması
Yatırımcılar sadece karbon hesaplayan değil, aynı zamanda bu karbonu dengelemek için alınan sertifikaların güvenilirliğini yapay zeka, uydu takibi ve makine öğrenimi ile denetleyen (Sylvera gibi) doğrulama yazılımlarına büyük fonlar aktarıyor. Yeşil yıkama (Greenwashing) riskini azaltan bu çözümler finans dünyasında büyük ilgi görüyor.`
    }
  ];

  let addedCount = 0;
  for (const art of articlesToAdd) {
    const existing = await prisma.article.findUnique({
      where: { slug: art.slug }
    });

    if (!existing) {
      await prisma.article.create({
        data: {
          title: art.title,
          slug: art.slug,
          summary: art.summary,
          imageUrl: art.imageUrl,
          isFeatured: art.isFeatured,
          categoryId: art.categoryId,
          content: mdToHtml(art.content)
        }
      });
      console.log(`Created new article: ${art.title}`);
      addedCount++;
    } else {
      console.log(`Article already exists: ${art.title}`);
    }
  }

  console.log(`Successfully completed. Added ${addedCount} new SaaS articles.`);
  await prisma.$disconnect();
}

main().catch(console.error);
