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
    } else if (line.startsWith('[IMG:')) {
      // Custom image tag: [IMG:url|alt]
      if (inList) { result.push('</ul>'); inList = false; }
      const match = line.match(/\[IMG:([^|]+)\|([^\]]+)\]/);
      if (match) {
        result.push(`<figure style="margin: 2rem 0;"><img src="${match[1]}" alt="${match[2]}" style="width:100%; border-radius:12px; object-fit:cover; max-height:420px;" /><figcaption style="text-align:center; font-size:0.85rem; color:#6b7280; margin-top:0.5rem; font-style:italic;">${match[2]}</figcaption></figure>`);
      }
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
  console.log("=== Seeding Battery Geopolitics Article ===");

  const category = await prisma.category.findUnique({
    where: { slug: 'trend-teknolojiler' }
  });

  if (!category) {
    console.error("Required category 'trend-teknolojiler' is missing.");
    return;
  }

  const articleData = {
    title: "Yeni Soğuk Savaşın Kimyası: Variller Gitti, Hücreler Geldi",
    slug: "yeni-soguk-savasin-kimyasi-variller-gitti-hucreler-geldi",
    summary: "Petrol savaşlarından pil savaşlarına geçişin jeopolitik haritası: Lityum Üçgeni, Çin hegemonyası, yeşil milliyetçilik ve döngüsel ekonominin küresel güç dengelerine etkisini The Ken tarzı analitik bir bakışla inceliyoruz.",
    imageUrl: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=800&q=80",
    isFeatured: false,
    categoryId: category.id,
    content: `20. yüzyılın en büyük jeopolitik anlatısı basitti: Toprağın altından çıkan siyah sıvıyı kontrol eden, küresel ekonominin direksiyonuna geçerdi. Süveyş Krizi, Körfez Savaşları, OPEC ambargoları… Hepsi tek bir meta etrafında dönen kanlı ve pahalı oyunlardı: Petrol.

Ancak bugün, küresel güç dengelerinin ağırlık merkezi petrol kuyularından sessizce başka bir yere kayıyor. Artık vizörümüzde petrol rafineleri değil, binlerce hassas robotun steril odalarda lityum ve kobalt atomlarını dizdiği "Gigafactory"ler (Devasa Batarya Fabrikaları) var.

Dünya, petrol savaşlarının vahşi dönemini kapatırken, çok daha stratejik, sessiz ve teknolojik bir cephe açıyor: **Pil Savaşları.**

[IMG:https://images.unsplash.com/photo-1518709766631-a6a7f45921c3?auto=format&fit=crop&w=1200&q=80|Petrol rafinerileri çağından batarya fabrikalarına: Küresel enerji dönüşümünün sembolü]

## "Beyaz Petrol" Çağının Şafağı

Geleneksel enerji düzeninde güç, vananın başında durmaktı. Yeni düzende ise güç, periyodik tablonun sol üst köşesine hükmetmekten geçiyor. Elektrikli araçların, yenilenebilir enerji şebekelerinin ve ceplerimizdeki yapay zeka çiplerinin kalbi olan lityum-iyon piller, bugünün yeni "ham petrolü". Ancak burada oyunun kuralları çok daha karmaşık.

Bir varil petrolü çıkarıp yakarsınız ve biter. Bir pil hücresi ise rafine edilmiş lityum, nikel, manganez ve kobaltın mükemmel bir mühendislikle bir araya getirilmesini gerektirir. Bu durum, jeopolitik rekabeti sadece "kaynağa sahip olma" savaşı olmaktan çıkarıp, **"teknolojik tedarik zincirini domine etme"** savaşına dönüştürüyor.

**Kritik Denklem:** Bugün bir ülke petrol rezervine sahip olmasa da enerji ithal ederek ayakta kalabilir. Ancak yarının dünyasında batarya ekosisteminin dışında kalan bir ülke, endüstriyel olarak tamamen "felç" olma riskiyle karşı karşıya.

[IMG:https://images.unsplash.com/photo-1558618666-fcd25c85f82e?auto=format&fit=crop&w=1200&q=80|Lityum-iyon pil hücreleri: 21. yüzyılın yeni "ham petrolü"]

## Yeni Harita: Lityum Üçgeni ve Çin Hegemonyası

Eski dünyanın haritasında Orta Doğu neyse, yeni dünyanın haritasında da **"Lityum Üçgeni"** (Şili, Arjantin, Bolivya) ve Kongo Demokratik Cumhuriyeti odur. Dünyanın kobalt ihtiyacının %70'inden fazlasını Kongo karşılarken, bilinen lityum rezervlerinin yarıya yakını Güney Amerika'nın bu çorak tuz düzlüklerinde yatıyor.

Ancak bu madenlerin sadece topraktan çıkarılması yetmiyor. İşte tam bu noktada, sahneye yeni dönemin enerji süper gücü çıkıyor: **Çin.**

[IMG:https://images.unsplash.com/photo-1504893524553-b855bce32c67?auto=format&fit=crop&w=1200&q=80|Güney Amerika'nın tuz düzlükleri: Dünyanın lityum rezervlerinin yarıya yakınına ev sahipliği yapıyor]

Çin, son yirmi yıldır Batı dünyasının fark edemediği bir vizyonla hareket etti. Madenlerin nerede çıkarıldığından ziyade, nerede işlendiğine odaklandı. Bugün ham lityumun %60'ından fazlası, kobaltın ise %70'e yakını Çin'deki tesislerde rafine ediliyor. Dünyanın en büyük batarya üreticisi olan CATL tek başına küresel pazarın üçte birini kontrol ediyor. Bu, 1970'lerdeki OPEC'in gücünden çok daha konsantre bir tekel gücü demek.

## Yeşil Milliyetçilik ve "OMEC" Riski

Batı dünyası bu tehlikeyi oldukça geç fark etti. ABD'nin milyarlarca dolarlık Enflasyonu Düşürme Yasası (IRA) ve Avrupa Birliği'nin yeşil dönüşüm fonları aslında çevre sevgisinden ziyade birer **"Çin'den Kaçış"** stratejisidir. Kendi batarya fabrikalarını kurmak için milyarlarca dolar teşvik dağıtan Washington ve Brüksel, tedarik zincirini millileştirmeye çalışıyor.

Bu durum yeni bir kavramı doğurdu: **Yeşil Milliyetçilik.**

[IMG:https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?auto=format&fit=crop&w=1200&q=80|Endüstriyel üretim hatları: Batı dünyası batarya tedarik zincirini millileştirme yarışında]

Maden zengini ülkeler artık sadece topraklarının yağmalanmasını istemiyor. Şili lityum sektörünü devletleştirmeyi tartışırken, Endonezya ham nikel ihracatını tamamen yasaklayarak küresel devleri ülkesinde fabrika açmaya zorluyor. Gelecekte bir **OMEC** (Maden İhraç Eden Ülkeler Örgütü) kurulması ve tıpkı 1973 petrol krizinde olduğu gibi batı dünyasına bir gecede "metal ambargosu" uygulanması artık sadece bir distopya senaryosu değil.

## Umut Işığı: Döngüsel Jeopolitik

Ancak petrol savaşları ile pil savaşları arasında insanlık adına hayati bir fark var: **Geri dönüşüm.**

Petrol yandığında karbondioksite dönüşür ve yok olur; bağımlılık kalıcıdır. Piller ise içerisindeki metallerin %95'inden fazlasının geri kazandırılabildiği teknolojik kutulardır. Bu durum, ilk 15-20 yıllık "maden kapma" savaşından sonra, dünyada yeterli pil stoğu oluştuğunda jeopolitik gerilimlerin azalabileceğini gösteriyor. Geleceğin süper gücü, belki de en çok madeni çıkaran değil, elindeki eski pilleri en verimli şekilde geri dönüştürebilen ülke olacak.

[IMG:https://images.unsplash.com/photo-1532601224476-15c79f2f7a51?auto=format&fit=crop&w=1200&q=80|Geri dönüşüm tesisleri: Pil savaşlarının petrol savaşlarından en büyük farkı, metallerin %95'inin geri kazanılabilmesi]

## Son Söz: Tanklar Değişti, Hedef Aynı

Dün petrol hatlarını korumak için okyanuslara donanma gönderen süper güçler, bugün lityum rafinelerinin siber güvenliğini sağlamak ve kobalt madenlerinin imtiyaz sözleşmelerini kapmak için diplomatik koridorlarda savaşıyor.

Savaşın kimyası değişti; karbon moleküllerinin yerini lityum iyonları aldı. Ancak insanoğlunun enerjiyi ve onu depolayan gücü kontrol etme arzusu, tarihin en eski ve en değişmez kuralı olarak kalmaya devam ediyor.`
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
          publishedAt: new Date()
        }
      });
      console.log(`Created database article: ${articleData.title}`);
    }
  } catch (e) {
    console.error("Failed to seed battery geopolitics article:", e.message);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch(console.error);
