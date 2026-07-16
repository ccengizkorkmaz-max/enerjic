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
    } else if (line.startsWith('[TABLE]')) {
      // skip table marker
    } else if (line.startsWith('|')) {
      // table handling
      if (!result[result.length - 1]?.includes('<table')) {
        result.push('<table style="width:100%; border-collapse:collapse; margin:1.5rem 0; font-size:0.95rem;"><thead>');
      }
      const cells = line.split('|').filter(c => c.trim());
      if (cells.every(c => /^[\s\-:]+$/.test(c))) {
        // separator row
        result.push('</thead><tbody>');
      } else if (result[result.length - 1]?.includes('<thead>') || result[result.length - 1]?.includes('</thead><tbody>') === false && !result.some(r => r.includes('<tbody>'))) {
        const row = cells.map(c => `<th style="text-align:left; padding:0.75rem; border-bottom:2px solid #047857; font-weight:700; color:#111827;">${c.trim()}</th>`).join('');
        result.push(`<tr>${row}</tr>`);
      } else {
        const row = cells.map(c => `<td style="padding:0.75rem; border-bottom:1px solid #e5e7eb;">${c.trim()}</td>`).join('');
        result.push(`<tr>${row}</tr>`);
      }
    } else if (line.startsWith('[/TABLE]')) {
      result.push('</tbody></table>');
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

  if (inList) {
    result.push('</ul>');
  }

  return result.join('\n');
}

async function main() {
  console.log("=== Seeding Menzil vs Hızlı Şarj Article ===");

  const category = await prisma.category.findUnique({
    where: { slug: 'elektrikli-araclar' }
  });

  if (!category) {
    console.error("Required category 'elektrikli-araclar' is missing.");
    return;
  }

  const articleData = {
    title: "Elektrikli Araçlarda Menzil mi Hızlı Şarj mı? Hyundai Kona vs Ioniq 5 Karşılaştırması",
    slug: "elektrikli-araclarda-menzil-mi-hizli-sarj-mi-kona-vs-ioniq-5",
    summary: "Elektrikli araç satın alırken menzil ve hızlı şarj hızı arasındaki kritik dengeleri inceliyor, Hyundai Kona Electric ve Hyundai IONIQ 5 modellerini 400V vs 800V batarya mimarisi üzerinden karşılaştırıyoruz.",
    imageUrl: "/images/articles/range_vs_charging.png",
    categoryId: category.id,
    content: `Elektrikli araç satın almayı düşünenlerin aklındaki en büyük soru işaretlerinden biri şudur: **Yüksek menzilli bir araç mı tercih edilmeli, yoksa çok hızlı şarj olabilen bir araç mı?**

Teknolojinin baş döndürücü bir hızla geliştiği 2025-2026 döneminde, batarya kapasiteleri ve şarj hızları aynı anda iyileşiyor. Ancak bütçe, kullanım alışkanlıkları ve altyapı sınırlılıkları nedeniyle bu iki özellik arasında hala klasik bir denge (trade-off) bulunuyor. Bu yazımızda menzil ve hızlı şarjın neden önemli olduğunu analiz ediyor ve pazarın en popüler iki temsilcisi olan **Hyundai Kona Electric** ile **Hyundai IONIQ 5** modellerini bu bakış açısıyla karşılaştırıyoruz.

---

## 1. Menzil (Range) Neden Önemli?

Menzil, elektrikli araçların fosil yakıtlı araçlar karşısındaki en büyük psikolojik ve pratik eşiğidir. Özellikle evinde veya iş yerinde düzenli olarak şarj imkanı olan kullanıcılar için büyük menzil, günlük hayatı inanılmaz derecede kolaylaştırır.

* **Menzil Kaygısını (Range Anxiety) Azaltır:** Tek şarjla daha fazla yol gidebilmek, sürücünün sürekli haritada şarj istasyonu arama stresini ortadan kaldırır.
* **Günlük Kullanım ve Şehir İçi Sürüş:** Şehir içi veya kısa mesafelerde 300-400+ km menzil sunan bir araç, haftalık şarj ihtiyacını tek bir seansa düşürebilir.
* **Büyük Bataryanın Yan Etkileri:** Daha büyük menzil, daha büyük bir batarya demektir. Bu da aracın ağırlığını, üretim maliyetini ve dolayısıyla satış fiyatını artırır. Ayrıca artan ağırlık sürüş verimliliğini ve hızlanma performansını olumsuz etkileyebilir.

---

## 2. Hızlı Şarj (DC Fast Charging) Neden Önemli?

Eğer sık sık uzun yola çıkıyorsanız veya evinizde şarj imkanınız yoksa, oyunun kurallarını belirleyen şey menzilden ziyade şarj hızıdır.

* **Uzun Yolculuklarda Mola Sürelerini Kısaltır:** 15-30 dakikada %10'dan %80 doluluğa ulaşarak 300-500 km ek menzil kazanmak, geleneksel akaryakıt dolum deneyimine en yakın çözümdür.
* **Altyapı Gelişimi:** Türkiye ve Avrupa genelinde (ZES, Eşarj vb.) hızlı şarj altyapısı hızla yaygınlaşıyor. Güçlü bir şarj ağı, daha küçük bataryalı bir araçla bile uzun seyahatleri sorunsuz yapmayı mümkün kılar.
* **Yeni Nesil Batarya Teknolojileri (2025-2026):** CATL (Shenxing) ve BYD (Blade Flash Charging) gibi devler, 5-9 dakikalık şarjla 400-500 km menzil sunan bataryalarını piyasaya sürdiler. Bu teknolojiler sayesinde şarj süreleri dramatik biçimde kısalıyor.

[CALLOUT]Uzman Görüşü: 2026 yılı itibarıyla birçok otomotiv analisti, hızlı şarj performansının menzilden daha kritik hale geldiğini savunuyor. 400 km menzilli ve 18 dakikada şarj olan bir araç, 700 km menzilli ancak 50 dakikada şarj olan bir araçtan çok daha kullanışlıdır.

---

## 3. Hangisi Daha Önemli? (Kullanım Senaryoları)

Kendi kullanım senaryonuza göre hangi özelliğe öncelik vermeniz gerektiğini aşağıdaki tablodan inceleyebilirsiniz:

[TABLE]
| Kullanım Şekli | Önerilen Öncelik | Neden? |
| --- | --- | --- |
| Şehir içi / günlük commute | Hızlı şarj + ev şarjı | Çoğu zaman evde gece şarj edersin, hızlı şarj yedek |
| Uzun yol / seyahat | Her ikisi de (tercihen yüksek menzil + çok hızlı şarj) | Menzil azalırsa durak sayısı artar, şarj yavaşsa molalar uzar |
| Evde şarjı olmayanlar | Hızlı şarj öncelikli | Kamu altyapısına bağımlı |
| Bütçe odaklı | Dengeli (orta menzil + iyi şarj hızı) | Çok büyük batarya pahalı |
[/TABLE]

---

## 4. Hyundai Kona Electric vs Hyundai IONIQ 5 Karşılaştırması

Şimdi bu teorik yaklaşımları pratik iki popüler model üzerinde inceleyelim. Hyundai grubunun iki farklı segmentteki temsilcisi: 400V mimarili **Kona Electric** ve 800V mimarili **IONIQ 5**.

### Menzil Karşılaştırması

* **Hyundai Kona Electric (Long Range - 65.4 kWh):** Gerçek dünya koşullarında şehir içinde 260-300 km (WLTP verisinde 514 km'ye kadar çıksa da otoyol sürüşlerinde bu değer 200-240 km seviyesine iner). Küçük ve hafif gövdesi sayesinde şehir içinde son derece verimlidir.
* **Hyundai IONIQ 5 (Long Range - 84 kWh):** Büyük bataryası sayesinde gerçek dünyada 350-450+ km menzili rahatlıkla sunar. Otoyol şartlarında dahi 300 km'nin üzerinde stabil sürüş imkanı sağlar.
* **Kazanan:** **IONIQ 5**. Büyük batarya kapasitesiyle uzun yolda net bir üstünlük kuruyor.

### Hızlı Şarj (DC Fast Charging) Karşılaştırması

* **Hyundai Kona Electric:** 400V batarya mimarisine sahiptir. Maksimum şarj hızı 100-110 kW civarındadır. %10'dan %80 doluluğa ulaşması yaklaşık **35-45 dakika** sürer.
* **Hyundai IONIQ 5:** Sektörün en gelişmiş **800V mimarisini** kullanır. Maksimum şarj gücü 230-260 kW seviyelerine kadar çıkar. %10'dan %80 doluluğa ulaşması sadece **18 dakika** sürer. 5 dakikalık şarjla yaklaşık 100-150 km menzil ekleyebilir.
* **Kazanan:** **IONIQ 5**. 800V teknolojisinin getirdiği hız ile Kona'ya karşı ezici bir üstünlük sağlıyor.

---

## Genel Değerlendirme Tablosu

[TABLE]
| Özellik | Hyundai Kona Electric | Hyundai IONIQ 5 | Yorum |
| --- | --- | --- | --- |
| Menzil | Orta (260-300 km) | Yüksek (350-500+ km) | IONIQ 5 uzun yol için çok daha rahat |
| Hızlı Şarj Hızı | Yavaş-Orta (35-45 dk) | Çok Hızlı (18-20 dk) | IONIQ 5 belirgin önde (800V mimarisi) |
| Günlük Kullanım | Şehir içi / kısa mesafe için ideal | Her türlü kullanım (şehir + uzun yol) | Kona daha uygun fiyatlı ve çevik |
| Uzun Yol Performansı | Orta (sık mola + daha uzun şarj) | Mükemmel (az mola + hızlı toparlanma) | IONIQ 5 net kazanıyor |
| Fiyat / Boyut | Daha ucuz, kompakt crossover | Daha pahalı, daha büyük ve ferah | Kona bütçe dostu |
[/TABLE]

---

## Hangisini Seçmelisiniz?

**Şu durumlarda Hyundai Kona Electric tercih edin:**
* Bütçeniz daha sınırlıysa,
* Çoğunlukla şehir içi ve günlük kısa mesafelerde kullanıyorsanız,
* Evinizde veya iş yerinizde düzenli (AC) yavaş şarj imkanınız varsa,
* Daha kompakt, park etmesi kolay bir şehir crossover'ı arıyorsanız.

**Şu durumlarda Hyundai IONIQ 5 tercih edin:**
* Sık sık şehirler arası seyahat ediyorsanız ve menzil kaygısı istemiyorsanız,
* DC hızlı şarj istasyonlarını aktif olarak kullanacaksanız (18 dakikada şarj),
* Geniş, ferah, omuz ve diz mesafesi yüksek, modern bir yaşam alanı istiyorsanız,
* 800V mimarisi sayesinde geleceğin teknolojisine hazır bir yatırım yapmak istiyorsanız.

Sonuç olarak; **IONIQ 5** menzil ve hızlı şarj ikilisinde üstünlük sağlayan teknolojik bir devrim sunarken, **Kona Electric** günlük şehir içi ihtiyaçları fazlasıyla karşılayan, bütçe dostu ve mantıklı bir alternatif olarak öne çıkıyor.`
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
          isFeatured: true,
          publishedAt: new Date()
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
          isFeatured: true,
          publishedAt: new Date()
        }
      });
      console.log(`Created database article: ${articleData.title}`);
    }
  } catch (e) {
    console.error("Failed to seed article:", e.message);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch(console.error);
