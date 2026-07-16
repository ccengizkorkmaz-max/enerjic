const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

function mdToHtml(md) {
  const lines = md.split(/\r?\n/);
  const result = [];
  let inList = false;
  let inTable = false;
  let tableHasBody = false;

  function formatInline(text) {
    let out = text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    out = out.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" style="color:#047857; text-decoration:underline;" target="_blank" rel="noopener noreferrer">$1</a>');
    return out;
  }

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
      result.push(`<li>${formatInline(content)}</li>`);
    } else if (line.startsWith('[IMG:')) {
      if (inList) { result.push('</ul>'); inList = false; }
      const match = line.match(/\[IMG:([^|]+)\|([^\]]+)\]/);
      if (match) {
        result.push(`<figure style="margin: 2rem 0;"><img src="${match[1]}" alt="${match[2]}" style="width:100%; border-radius:12px; object-fit:cover; max-height:420px;" /><figcaption style="text-align:center; font-size:0.85rem; color:#6b7280; margin-top:0.5rem; font-style:italic;">${match[2]}</figcaption></figure>`);
      }
    } else if (line.startsWith('[TABLE]')) {
      // skip table marker
    } else if (line.startsWith('|')) {
      // table handling with proper state
      if (!inTable) {
        result.push('<table style="width:100%; border-collapse:collapse; margin:1.5rem 0; font-size:0.95rem;"><thead>');
        inTable = true;
        tableHasBody = false;
      }
      const cells = line.split('|').filter(c => c.trim());
      if (cells.every(c => /^[\s\-:]+$/.test(c))) {
        // separator row — switch from thead to tbody
        result.push('</thead><tbody>');
        tableHasBody = true;
      } else if (!tableHasBody) {
        // header row
        const row = cells.map(c => `<th style="text-align:left; padding:0.75rem; border-bottom:2px solid #047857; font-weight:700; color:#111827;">${formatInline(c.trim())}</th>`).join('');
        result.push(`<tr>${row}</tr>`);
      } else {
        // body row
        const row = cells.map(c => `<td style="padding:0.75rem; border-bottom:1px solid #e5e7eb;">${formatInline(c.trim())}</td>`).join('');
        result.push(`<tr>${row}</tr>`);
      }
    } else if (line.startsWith('[/TABLE]')) {
      if (inTable) {
        result.push('</tbody></table>');
        inTable = false;
        tableHasBody = false;
      }
    } else if (line.startsWith('[CALLOUT]')) {
      if (inList) { result.push('</ul>'); inList = false; }
      const text = line.replace('[CALLOUT]', '').trim();
      result.push(`<div style="background:linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%); border-left:4px solid #047857; padding:1.25rem 1.5rem; border-radius:0 12px 12px 0; margin:1.5rem 0;"><p style="margin:0; font-weight:600; color:#065f46; font-size:1rem; line-height:1.7;">${text}</p></div>`);
    } else {
      if (inList) { result.push('</ul>'); inList = false; }
      result.push(`<p>${formatInline(line)}</p>`);
    }
  }

  if (inList) {
    result.push('</ul>');
  }

  return result.join('\n');
}

async function main() {
  console.log("=== Seeding Türkiye EV Market Leadership Article ===");

  const category = await prisma.category.findUnique({
    where: { slug: 'elektrikli-araclar' }
  });

  if (!category) {
    console.error("Required category 'elektrikli-araclar' is missing.");
    return;
  }

  const articleData = {
    title: "Türkiye, Avrupa'nın En Büyük 4. Elektrikli Araç Pazarı Oldu: İşte 2026 Küresel Raporlarının Çarpıcı Sonuçları",
    slug: "turkiye-avrupanin-en-buyuk-4-elektrikli-arac-pazari-oldu-iea-2026",
    summary: "Uluslararası Enerji Ajansı (IEA) ve Our World in Data verilerine göre Türkiye, 2025 yılında 240.000 adede ulaşan elektrikli araç satışı ve %22'lik pazar payıyla Avrupa'nın en büyük 4. pazarı oldu. İşte Togg, BYD ve diğer ülkelerle karşılaştırmalı tüm veriler.",
    imageUrl: "/images/articles/turkiye_ev_pazari_lider.png",
    categoryId: category.id,
    content: `Elektrikli araç dünyasında kartlar yeniden karılıyor ve Türkiye, bu dönüşümün en parlak aktörlerinden biri olarak sahne alıyor. 

Uluslararası Enerji Ajansı'nın (IEA) yayınladığı **Global EV Outlook 2026** raporu ile **Our World in Data (OWID)** küresel elektrikli araç veritabanından derlenen en güncel istatistikler, Türkiye'nin elektrikli mobilitede küresel bir süperstar haline geldiğini kanıtlıyor. 2025 yılı sonu itibarıyla Türkiye, ulaştığı satış adetleri ve pazar payı ile Avrupa'nın devlerini geride bırakarak tarihi bir zirveye ulaştı.

---

## 1. Türkiye Avrupa'nın Zirvesine Oynuyor: En Büyük 4. Pazar!

IEA ve OWID verilerine göre, Türkiye'deki elektrikli otomobil satışları 2025 yılında tarihi bir rekor kırarak **yaklaşık 240.000 adede** ulaştı. Bu rakam, 2024 yılındaki 108.000 adetlik satışın iki katından fazladır.

Bu muazzam büyüme ile birlikte Türkiye; **Almanya, Birleşik Krallık ve Fransa'nın ardından Avrupa'nın en büyük 4. elektrikli araç pazarı** konumuna yükselmiştir. İtalya, İspanya, Hollanda ve İsveç gibi geleneksel olarak güçlü otomotiv pazarları Türkiye'nin gerisinde kalmıştır.

[CALLOUT]Türkiye'de 2025 yılında satılan her 100 yeni otomobilden 22'si tamamen elektrikli veya şarj edilebilir hibrit (PHEV) modellerden oluştu. 2022 yılında bu oranın sadece %1 seviyesinde olduğu düşünülürse, 3 yıl gibi kısa bir sürede gerçekleşen bu sıçrama dünya otomotiv tarihinin en hızlı geçişlerinden biridir.

---

## 2. Gelişmekte Olan Ülkeler Arasında Lideriz

Our World in Data verileri üzerinden yapılan karşılaştırmalar, Türkiye'nin kendi gelir grubundaki ve gelişmekte olan diğer büyük ekonomiler (EMDEs) arasındaki farkı ne kadar açtığını net bir şekilde ortaya koyuyor. 

2025 yılı elektrikli araç pazar payları karşılaştırıldığında ortaya çıkan tablo şu şekildedir:

[TABLE]
| Ülke | Yeni Satışlarda EV Pazar Payı (%) | 2025 Toplam Satış Adedi (Yaklaşık) |
| --- | --- | --- |
| **Türkiye** | **%22** | **240.000** |
| Brezilya | %9 | 180.000 |
| Meksika | %7 | 95.000 |
| Hindistan | %4 | 165.000 |
| Güney Afrika | <%1 | <5.000 |
[/TABLE]

Tablodan da anlaşılacağı üzere Türkiye, pazar payı bakımından Hindistan'ı 5.5'e, Brezilya'yı ise 2.5'e katlamış durumdadır.

---

## 3. Türkiye'nin Farkı: BEV (Tam Elektrikli) Odaklılık

Türkiye'nin elektrikli araç pazarını diğer gelişmekte olan ülkelerden ayıran en büyük fark batarya teknolojisi tercihinde yatıyor. 

Örneğin Brezilya ve Meksika gibi ülkelerde satılan elektrikli araçların neredeyse yarısını şarj edilebilir hibrit (PHEV) modeller oluştururken, **Türkiye'de satılan elektrikli araçların %80'inden fazlası tamamen elektrikli (BEV)** modellerden oluşmaktadır. Yerli otomobilimiz Togg'un T10X modeli ve Tesla Model Y gibi popüler tam elektrikli araçlar bu tercihin ana sürükleyicileridir.

Bu durum, Türkiye'nin kamuya açık hızlı şarj istasyonlarına (DC) olan bağımlılığını ve şarj altyapısı yatırımlarının önemini diğer ülkelere kıyasla çok daha kritik hale getirmektedir.

---

## 4. Togg ve BYD Rekabeti Kızışıyor

Raporlar, Türkiye'deki yerli üretim gücünün ve pazar rekabetinin dinamiklerini de gösteriyor:
* **Togg'un Büyümesi:** Türkiye'nin yerli elektrikli otomobil üreticisi Togg, 2025 yılında satışlarını bir önceki yıla göre %30 oranında artırmayı başarmıştır.
* **Pazarın Çeşitlenmesi:** 2024 yılında Türkiye EV pazarının yaklaşık %30'unu elinde tutan Togg, pazara giren güçlü ithal markalar (özellikle BYD, Tesla ve diğer Çinli üreticiler) sebebiyle 2025'te pazar payı olarak %15 seviyelerine dengelenmiştir. Bu durum pazarın tekelleşmekten çıkıp sağlıklı bir rekabet yapısına kavuştuğunun göstergesidir.
* **Teşvikler ve ÖTV Dinamikleri:** Türkiye'de 2023 yılında %10 olan elektrikli araç ÖTV matrah limitleri, 2025 Temmuz ayında yapılan güncellemeyle belirli fiyat dilimleri için %25 seviyesine çıkarılmıştır. Bu vergi ayarlaması pazarda geçici bir dalgalanma yaratsa da, Aralık 2025'teki satışlar yeniden aylık 30.000 adetlik rekor seviyelere ulaşarak talebin kalıcı olduğunu göstermiştir.

---

## 5. Şarj Altyapısında Dünya Standartlarının Üzerindeyiz

Roland Berger tarafından hazırlanan **EV Charging Index 2025** raporunda Türkiye, şarj altyapısı kurulum hızı ve kullanıcı memnuniyeti açısından **dünyanın en hızlı gelişen pazarlarından biri** olarak tescillenmiştir. 

Türkiye genelinde istasyon başına düşen araç oranı dengelidir ve kullanıcı memnuniyeti (şarj istasyonu bulma kolaylığı ve ödeme yöntemleri) %90'ın üzerinde seyretmektedir. Ancak raporda, yollardaki tam elektrikli araç stoğunun hızla artması nedeniyle özellikle şehirlerarası otoyollarda 150 kW ve üzeri ultra-hızlı (DC) şarj noktalarının sayısının 2026 boyunca ikiye katlanması gerektiği vurgulanmaktadır.

---

## Referanslar ve Kaynak Bilgisi

Bu makaledeki veriler aşağıdaki resmi ve bağımsız kurumların 2025-2026 raporlarından derlenmiştir:
* **Uluslararası Enerji Ajansı (IEA):** [Global EV Outlook 2026 Report](https://www.iea.org/reports/global-ev-outlook-2026)
* **Our World in Data (OWID):** [Tracking Global Data on Electric Vehicles by Hannah Ritchie (Last Updated June 2026)](https://ourworldindata.org/electric-car-sales)
* **BloombergNEF (BNEF):** [Electric Vehicle Outlook 2026 Executive Summary](https://about.bnef.com/electric-vehicle-outlook/)
* **Roland Berger:** [Global EV Charging Index - Edition 6 (2025 Study)](https://www.rolandberger.com/en/Insights/Publications/EV-Charging-Index-Steady-progress.html)
`
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
          isFeatured: false,
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
          isFeatured: false,
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
