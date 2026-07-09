const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

function mdToHtml(md) {
  const lines = md.split(/\r?\n/);
  const result = [];
  let inList = false;

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i].trim();
    if (!line) {
      if (inList) { result.push('</ul>'); inList = false; }
      continue;
    }
    if (line.startsWith('# ')) continue;

    if (line.startsWith('## ')) {
      if (inList) { result.push('</ul>'); inList = false; }
      result.push(`<h2>${line.slice(3)}</h2>`);
    } else if (line.startsWith('### ')) {
      if (inList) { result.push('</ul>'); inList = false; }
      result.push(`<h3>${line.slice(4)}</h3>`);
    } else if (line.startsWith('* ') || line.startsWith('- ')) {
      if (!inList) { result.push('<ul>'); inList = true; }
      const content = line.replace(/^[\*\-]\s+/, '').trim();
      let formatted = content.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
      result.push(`<li>${formatted}</li>`);
    } else if (line.startsWith('[IMG:')) {
      if (inList) { result.push('</ul>'); inList = false; }
      const match = line.match(/\[IMG:([^|]+)\|([^\]]+)\]/);
      if (match) {
        result.push(`<figure style="margin: 2rem 0;"><img src="${match[1]}" alt="${match[2]}" style="width:100%; border-radius:12px; object-fit:cover; max-height:420px;" /><figcaption style="text-align:center; font-size:0.85rem; color:#6b7280; margin-top:0.5rem; font-style:italic;">${match[2]}</figcaption></figure>`);
      }
    } else if (line.startsWith('[CALLOUT]')) {
      if (inList) { result.push('</ul>'); inList = false; }
      const text = line.replace('[CALLOUT]', '').trim();
      result.push(`<div style="background:linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%); border-left:4px solid #047857; padding:1.25rem 1.5rem; border-radius:0 12px 12px 0; margin:1.5rem 0;"><p style="margin:0; font-weight:600; color:#065f46; font-size:1rem; line-height:1.7;">${text}</p></div>`);
    } else {
      if (inList) { result.push('</ul>'); inList = false; }
      let formatted = line.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
      result.push(`<p>${formatted}</p>`);
    }
  }
  if (inList) result.push('</ul>');
  return result.join('\n');
}

async function main() {
  console.log("=== Seeding Fatih Altayli EV Article ===");

  const category = await prisma.category.findUnique({
    where: { slug: 'elektrikli-araclar' }
  });

  if (!category) {
    console.error("Required category 'elektrikli-araclar' is missing.");
    return;
  }

  const articleData = {
    title: "Fatih Altaylı Neden Hiç Elektrikli Araç Makalesi Yazmıyor?",
    slug: "fatih-altayli-neden-hic-elektrikli-arac-makalesi-yazmiyor",
    summary: "Fatih Altaylı elektrikli araçlar hakkında yazı yazmıyor mu? Tam tersine: Kia EV6'dan Mercedes EQS'e, BYD'den Togg'a kadar onlarca model test etti. Peki neden 'yazmıyor' gibi algılanıyor? Cevap, medyanın dönüşümünde gizli.",
    imageUrl: "https://images.unsplash.com/photo-1504711434969-e33886168d5c?auto=format&fit=crop&w=800&q=80",
    isFeatured: false,
    categoryId: category.id,
    content: `Aslında bu yaygın bir yanlış anlaşılma; çünkü Fatih Altaylı elektrikli araçlar hakkında son derece aktif bir şekilde yazılar yazıyor, incelemeler yapıyor ve YouTube programlarında bu konuyu sıkça masaya yatırıyor. Kendisi Türkiye'de otomotiv editörlüğü geçmişi olan ve yeni çıkan hemen her önemli modeli bizzat test eden nadir köşe yazarlarından biridir.

Eğer son dönemde gözünüzden kaçtıysa, elektrikli araçlar konusundaki yazı geçmişini ve bu sektöre yaklaşımını şu şekilde özetleyebiliriz:

[IMG:https://images.unsplash.com/photo-1504711434969-e33886168d5c?auto=format&fit=crop&w=1200&q=80|Otomotiv gazeteciliği: Elektrikli araç incelemelerinin yeni çağı dijital platformlara taşındı]

## 1. Bizzat Yazıyor ve Test Ediyor

Fatih Altaylı, kendi kişisel web sitesindeki (fatihaltayli.com.tr) **"Otomobil Yazıları"** kategorisinde düzenli olarak elektrikli araç deneyimlerini paylaşıyor. Sadece teknik verileri kopyalamak yerine, araçları bizzat uzun yolda ve şehir içinde test ederek oldukça açık sözlü eleştiriler kaleme alıyor.

Yazdığı bazı ses getiren elektrikli araç incelemeleri:

### "Elektrikli araçların geleceği ve elektrikli izlenimlerim" (Mart 2024)

Piyasadaki en önemli elektrikli modelleri — Kia EV6, BMW i7, Audi e-tron RS, Porsche Taycan ve daha fazlasını — tek tek kıyasladığı kapsamlı bir inceleme yazısı yayınladı.

[IMG:https://images.unsplash.com/photo-1619317190310-f8e5e1e0b5e9?auto=format&fit=crop&w=1200&q=80|Premium elektrikli modeller: Porsche Taycan'dan BMW i7'ye kadar pek çok aracı bizzat test ediyor]

### Mercedes EQS İncelemesi: "Metaverse Aleminin Otomobili"

Mercedes'in elektrikli amiral gemisini günlerce test edip, **"Dünyada teknolojik olarak en ileri düzeydeki otomobil"** diyerek köşesine taşıdı. Hyperscreen ekranı, otonom sürüş yetenekleri ve sessiz kabin deneyimini detaylı şekilde analiz etti.

### BMW iX Testi: Uzun Yolun Gerçekleri

Elektrikli bir aracı uzun yolda denemenin şarj altyapısı yetersizlikleri nedeniyle nasıl bir **"şanssızlığa"** dönüşebileceğini gerçekçi bir dille anlattı. Bu yazı, Türkiye'deki şarj ağının eksiklerini gözler önüne seren en dürüst incelemelerden biri olarak büyük yankı uyandırdı.

### Çin Markaları ve BYD Analizi

Son dönemde Çin'in elektrikli otomobil hamlelerini ve **BYD'nin Türkiye'deki yatırımlarını ve stratejilerini** köşesinde düzenli olarak analiz ediyor. Çin markalarının fiyat-performans dengesinin Avrupa devlerini nasıl köşeye sıkıştırdığını rakamlarla ortaya koyuyor.

[IMG:https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80|Elektrikli araç test sürüşleri: Altaylı, her modeli bizzat uzun yol ve şehir içinde deniyor]

## 2. Neden "Yazmıyor" Gibi Algılanıyor?

Bunun temel sebebi, Altaylı'nın geleneksel gazete medyasından (Habertürk) ayrılarak tamamen kendi bağımsız mecralarına — YouTube ve kendi internet sitesi — geçiş yapmış olmasıdır.

[CALLOUT]Altaylı artık otomobil incelemelerini yazmaktan ziyade YouTube videolarında konuşarak ve göstererek anlatmayı tercih ediyor. Bu durum, geleneksel gazete okuyucusunun radarından düşmesine neden oluyor.

### YouTube Ağırlıklı İçerik

Togg fabrikası gezisi, Tesla ve BYD karşılaştırmaları, yeni model ilk sürüş izlenimleri… Tüm bu içerikler artık yazılı basında değil, video formatında üretiliyor. Dijital dönüşümün en net örneklerinden biri olarak Altaylı, içerik üretimini tamamen görsel platforma taşıdı.

### Sert ve Gerçekçi Eleştiriler

Elektrikli araç fanatiği olmak yerine, bu araçların **menzil problemlerini, Türkiye'deki şarj altyapısı eksikliklerini ve yüksek vergileri** sert şekilde eleştirdiği için basındaki klasik "elektrikli araç güzellemelerine" mesafeli duruyor. Bu da onun bu teknolojiye tamamen karşı olduğu veya ilgilenmediği gibi yanlış bir algı yaratabiliyor.

[IMG:https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=1200&q=80|Dijital medyaya geçiş: YouTube ve bağımsız platformlar geleneksel gazete köşelerinin yerini alıyor]

## Sonuç

Kısacası, Fatih Altaylı elektrikli araçları yakından takip ediyor; ancak ana akım gazetelerde köşesi olmadığı için bu analizlerini artık **fatihaltayli.com.tr**'deki otomobil köşesinden ve **YouTube kanalından** takip etmek gerekiyor.

Medyanın dönüşümü, sadece haberin üretim biçimini değil, okuyucunun içeriğe erişim alışkanlıklarını da kökten değiştirdi. Altaylı'nın elektrikli araç yazmaması değil, bizim o yazıları arayacağımız adresi değiştirmemiz gerekiyor.`
  };

  const htmlContent = mdToHtml(articleData.content);

  try {
    const existing = await prisma.article.findUnique({
      where: { slug: articleData.slug }
    });

    if (existing) {
      await prisma.article.update({
        where: { slug: articleData.slug },
        data: {
          title: articleData.title,
          summary: articleData.summary,
          content: htmlContent,
          imageUrl: articleData.imageUrl,
          categoryId: articleData.categoryId,
          publishedAt: new Date("2026-07-09T08:00:00.000Z")
        }
      });
      console.log(`Updated database article: ${articleData.title}`);
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
          publishedAt: new Date("2026-07-09T08:00:00.000Z")
        }
      });
      console.log(`Created database article: ${articleData.title}`);
    }
  } catch (e) {
    console.error("Failed to seed Fatih Altayli article:", e.message);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch(console.error);
