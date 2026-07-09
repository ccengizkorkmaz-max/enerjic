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

    // Skip the main H1 heading since the title field handles it
    if (line.startsWith('# ')) {
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
    } else if (line.startsWith('---')) {
      if (inList) { result.push('</ul>'); inList = false; }
      result.push('<hr className="my-6 border-gray-150" />');
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
  console.log("=== Seeding EV Battery Fire Article ===");

  // Find the 'Elektrikli Araçlar' category
  const category = await prisma.category.findUnique({
    where: { slug: 'elektrikli-araclar' }
  });

  if (!category) {
    console.error("Required category 'elektrikli-araclar' is missing in the database. Please run migrations/seed first.");
    return;
  }

  const articleData = {
    title: "Elektrikli Araçların Pilleri Aniden Yanar mı? İstatistikler ve Otopark Kuralları",
    slug: "elektrikli-araclarin-pilleri-aniden-yanar-mi",
    summary: "Elektrikli araç bataryalarının aniden yanma riskini, küresel literatürdeki istatistikleri, termal kaçak (thermal runaway) olayını ve Türkiye'deki kapalı otopark yasal mevzuatını inceliyoruz.",
    imageUrl: "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80",
    isFeatured: false,
    categoryId: category.id,
    content: `Elektrikli otomobil pazarı son yıllarda benzeri görülmemiş bir hızla büyürken, batarya güvenliği ve yangın riski en çok tartışılan konulardan biri haline geldi. Sosyal medyada viral olan ve alev alev yanan elektrikli otomobil videoları, *"Elektrikli araçların pilleri aniden yanar mı?"* sorusunu akıllara getiriyor. 

Bu makalede, dünya literatürdeki bilimsel araştırmaları, İsveç ve ABD gibi ülkelerin resmi kaza/yangın istatistiklerini ve Türkiye’deki yasal düzenlemeleri (Togg dahil kapalı otopark kuralları) inceleyerek konunun arka planındaki gerçekleri mercek altına alıyoruz.

## 1. "Aniden Yanma" Nedir? Termal Kaçak (Thermal Runaway) Mekanizması

Elektrikli araçlarda batarya yangınları genellikle **Termal Kaçak (Thermal Runaway)** adı verilen zincirleme bir reaksiyon sonucu gerçekleşir. Lityum-iyon batarya hücrelerinden biri aşırı ısındığında veya hasar gördüğünde, hücre içindeki kimyasal enerji kontrolsüz bir şekilde ısıya dönüşür. Bu ısı, komşu hücreleri de tetikleyerek tüm batarya paketine yayılabilir.

Peki bu süreç tamamen "aniden" ve durup dururken mi başlar? **Hayır.** Bilimsel literatüre göre termal kaçak neredeyse hiçbir zaman sebepsiz yere gerçekleşmez. Tetikleyici ana faktörler şunlardır:

* **Mekanik Hasar (Kaza/Darbe):** Aracın alt kısmına alınan sert bir darbe (örneğin yoldaki bir taşın batarya zırhını delmesi) hücre içi kısa devreye yol açabilir.
* **Elektriksel Aşırı Yükleme:** Şarj kontrol sistemindeki (BMS) bir arıza nedeniyle bataryanın aşırı şarj edilmesi veya aşırı deşarj olması.
* **Üretim Hataları:** Batarya hücrelerinin üretim sürecindeki mikroskobik kusurlar (örneğin dendrit oluşumu veya ayırıcı plaka hataları).

Dışarıdan bakan bir gözlemci için yangın "aniden" başlamış gibi görünse de, hücre seviyesinde gaz salınımı, sıcaklık artışı ve voltaj düşüşü gibi ön belirtiler yaşanır. Modern elektrikli araçlar, gelişmiş **Batarya Yönetim Sistemi (BMS)** sayesinde bu değişimleri milisaniyeler içinde algılayarak aracı güvenli moda alır ve sürücüyü uyarır.

## 2. Dünya Literatürü ve Yangın İstatistikleri: EV vs. İçten Yanmalı Araçlar

Medya, yapısı gereği yeni teknolojilerdeki sıra dışı olayları haberleştirmeye daha meyillidir. Bu durum, elektrikli araç yangınlarının benzinli veya dizel araçlardan daha yaygın olduğu algısını yaratır. Ancak küresel istatistikler tamamen farklı bir tablo ortaya koymaktadır:

### İsveç Sivil Savunma Dairesi (MSB) Verileri
Yangın güvenliği konusunda en şeffaf verileri sunan kurumlardan biri olan İsveç MSB'nin raporlarına göre:
* İsveç'te 2022 yılında her **100.000 elektrikli araçtan sadece 3,8'inde** yangın (veya duman çıkarma gibi hafif olaylar dahil) yaşanmıştır.
* Buna karşılık, içten yanmalı motorlu (benzinli/dizel) araçlarda bu oran **100.000 araçta 68** olarak kaydedilmiştir.
* Bu veriler, geleneksel fosil yakıtlı araçların elektrikli araçlara kıyasla yaklaşık **18 kat daha fazla** yangın riskine sahip olduğunu göstermektedir.

### ABD Ulusal Ulaştırma Güvenliği Kurulu (NTSB) Verileri
ABD'de yapılan geniş kapsamlı bir araştırmada, satılan her 100.000 araç başına düşen yangın vakaları incelenmiştir:
* **Hibrit Araçlar:** 100.000 satışta 3.474 yangın (En yüksek risk)
* **İçten Yanmalı (Benzin/Dizel) Araçlar:** 100.000 satışta 1.529 yangın
* **Tamamen Elektrikli Araçlar (BEV):** 100.000 satışta sadece 25 yangın

Bu istatistikler, elektrikli araçların geleneksel otomobillere göre **yaklaşık 60 kat daha güvenli** olduğunu ortaya koymaktadır.

## 3. Elektrikli Araç Yangınları Neden Bu Kadar Çok Gürültü Koparıyor?

Elektrikli araçların daha az yanmasına rağmen neden daha tehlikeli algılandığının yanıtı, yangının doğasında ve söndürme zorluğunda gizlidir:

* **Söndürme Zorluğu ve Su İhtiyacı:** Fosil yakıtlı bir araç yangını ortalama 2.000 ila 4.500 litre su ile kısa sürede söndürülebilirken, bir elektrikli araç batarya yangınını kontrol altına almak ve soğutmak için **40.000 ila 100.000 litreden fazla suya** ihtiyaç duyulabilir.
* **Yeniden Alevlenme Riski:** Lityum-iyon bataryalar söndürüldükten saatler, hatta günler sonra bile içten içe reaksiyona devam ederek tekrar alev alabilir (reignition). Bu nedenle itfaiye ekipleri yanan elektrikli araçları günlerce gözetim altında tutar veya su dolu özel konteynerlere batırır.
* **Zehirli Gaz Salınımı:** Batarya hücreleri yanarken hidrojen florür gibi oldukça zehirli kimyasal gazlar açığa çıkarır. Bu da kapalı alanlarda müdahaleyi zorlaştırır.

## 4. Türkiye Bağlamı: Togg ve Diğer EV'ler Kapalı Otoparka Girebilir mi?

Türkiye'de elektrikli araç sahiplerinin en çok merak ettiği konulardan biri kapalı otopark kurallarıdır. Sosyal medyadaki bazı asılsız iddialar nedeniyle elektrikli araçların kapalı otoparklara alınmadığına dair yanlış bir algı bulunmaktadır.

### Yasal Durum ve Mevzuat
* **Genel Bir Yasak Yoktur:** Türkiye Cumhuriyeti Çevre, Şehircilik ve İklim Değişikliği Bakanlığı tarafından yayımlanan **Otopark Yönetmeliği** kapsamında, elektrikli araçların (yerli otomobilimiz Togg dahil) kapalı otoparklara girişini veya park etmesini engelleyen hiçbir kısıtlama yoktur.
* **LPG Yasağı ile Karıştırılıyor:** Türkiye'de kapalı otoparklara girişi yasak olan tek araç grubu **LPG'li araçlardır**. LPG gazı havadan ağır olduğu için sızıntı durumunda otopark zemininde birikir ve patlama riski oluşturur. Elektrikli araçların bataryalarında böyle bir zemin gaz birikmesi riski bulunmamaktadır.
* **Şarj İstasyonları Teşvik Ediliyor:** Mevzuat gereği yeni yapılan AVM ve toplu konut otoparklarında belirli oranlarda elektrikli araç şarj ünitesi bulundurulması zorunludur.

## 5. Geleceğin Güvenlik Çözümü: Katı Hal (Solid-State) Pilleri

Mevcut lityum-iyon pillerdeki sıvı elektrolit yerine katı elektrolit kullanan **katı hal pilleri (solid-state)** ticarileşme aşamasındadır. Bu teknoloji, yanıcı sıvı kimyasalları tamamen ortadan kaldırdığı için batarya yangını riskini neredeyse sıfıra indirecektir. Otomotiv devleri 2027-2030 yılları arasında bu pilleri taşıyan araçları yollara çıkarmayı hedeflemektedir.

## Özet ve Sonuç

Elektrikli araçların pilleri durup dururken, hiçbir etki olmadan aniden patlamaz veya yanmaz. Gelişmiş koruma sistemleri (BMS) ve yapısal zırhlar sayesinde EV'ler, istatistiksel olarak benzinli araçlardan çok daha düşük yangın oranına sahiptir. Yangın çıktığında söndürülmesinin daha zor olması ve medyadaki yoğun görünürlüğü bu algıyı büyütmektedir. Türkiye'deki yasal mevzuata göre elektrikli araçlar kapalı otoparkları güvenle kullanabilir ve herhangi bir kısıtlamaya tabi değildir.`
  };

  const htmlContent = mdToHtml(articleData.content);

  try {
    const existing = await prisma.article.findUnique({
      where: { slug: articleData.slug }
    });

    if (existing) {
      console.log(`Article already exists: ${articleData.title}`);
    } else {
      await prisma.article.create({
        data: {
          title: articleData.title,
          slug: articleData.slug,
          summary: articleData.summary,
          content: htmlContent,
          imageUrl: articleData.imageUrl,
          categoryId: articleData.categoryId,
          isFeatured: false,
          publishedAt: new Date("2026-07-03T10:30:00.000Z")
        }
      });
      console.log(`Created database article: ${articleData.title}`);
    }
  } catch (e) {
    console.error("Failed to seed EV battery fire article:", e.message);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch(console.error);
