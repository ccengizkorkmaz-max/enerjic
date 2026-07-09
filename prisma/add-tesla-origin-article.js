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
      formatted = formatted.replace(/\"([^"]+)\"/g, '<em>"$1"</em>');
      result.push(`<p>${formatted}</p>`);
    }
  }
  if (inList) result.push('</ul>');
  return result.join('\n');
}

async function main() {
  console.log("=== Seeding Tesla Origin Story Article ===");

  const category = await prisma.category.findUnique({
    where: { slug: 'girisimcilik-saas' }
  });

  if (!category) {
    console.error("Required category 'girisimcilik-saas' is missing.");
    return;
  }

  const articleData = {
    title: "Tesla Efsanesinin Arkasındaki Kodlar: GM'in İntiharı, İki Mühendisin İnadı ve Bir Master Plan",
    slug: "tesla-efsanesinin-arkasindaki-kodlar-gmin-intihari-iki-muhendisin-inadi",
    summary: "Tesla'nın kuruluş hikayesi, popüler kültürün anlattığından çok daha derin. GM'in EV1'i ezme kararından, Eberhard ve Tarpenning'in vizyonuna, Musk'ın 'Gizli Master Plan' stratejisine kadar otomotiv tarihini değiştiren kırılma noktalarının analizi.",
    imageUrl: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=800&q=80",
    isFeatured: false,
    categoryId: category.id,
    content: `Bugün piyasa değeriyle küresel otomotiv endüstrisini sarsan, Berlin'den Şanghay'a uzanan Gigafactory zincirleriyle batarya ekosistemini domine eden bir Tesla gerçeği var. Ancak popüler kültürün parlak ışıkları altında kaybolan devasa bir tarihsel yanılgı mevcut: Tesla, Elon Musk'ın zihninde bir gecede çakan anlık bir şimşekle kurulmadı. Bu efsane; Silikon Vadisi'nin derinliklerindeki iki dahi mühendisin vizyonunun, küresel bir otomotiv devinin yaptığı en büyük stratejik intiharın ve bir fizikçinin çocukluk saplantısının kusursuz bir kesişim kümesidir.

[IMG:https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=1200&q=80|Tesla'nın küresel fabrika ağı: Silikon Vadisi'nden dünyaya yayılan bir efsanenin başlangıcı]

## 1. Perde: GM'in Öldeki Cinayeti ve EV1 Trajedisi

Hikayenin gerçek kıvılcımı 1990'ların sonunda, Detroit'in kalbinde çaktı. General Motors (GM), otomotiv tarihini değiştirebilecek radikal bir adıma imza atarak tamamen elektrikli ilk seri üretim aracı olan EV1'i piyasaya sürdü. Araç satılmıyor, Kaliforniya ve Arizona'da sadece özel bir kitleye kiralanıyordu (lease). EV1'i deneyimleyen aktörler, mühendisler ve teknoloji meraklıları arabaya adeta aşık oldu. Sessizdi, fütüristikti ve hepsinden önemlisi petrole ihtiyaç duymuyordu.

Ancak bu devrim, Detroit'in yerleşik düzenini korkuttu. Petrol lobilerinin yoğun baskısı, distribütör ağlarının periyodik bakım ve yedek parça gelirlerinden mahrum kalma endişesi GM yönetimini felç etti. 2003 yılında GM, tarihin en anlaşılmaz kararlarından birini vererek projeyi sonlandırdı. Şirket, yollardaki tüm EV1'leri kullanıcıların feryadlarına ve satın alma taleplerine kulak tıkayarak zorla geri topladı. Kaliforniya çöllerinde devasa kırıcılarla ezilen EV1'lerin görüntüleri, Silikon Vadisi'nde büyük bir infiale ve öfkeye yol açtı.

**Geleneksel otomotiv endüstrisi, elektrikli geleceği kendi elleriyle boğmuştu.**

[CALLOUT]Editörün Notu: GM'in EV1 projesini öldeki ezerek yok etmesi, Silikon Vadisi mühendisleri için bir "teknolojik şehitlik" anıydı. Büyük devlerin bu geleceği bilerek öldürdüğünü gören vizyonerler, değişimin dışarıdan gelmesi gerektiğini anladılar.

[IMG:https://images.unsplash.com/photo-1611605698335-8b1569810432?auto=format&fit=crop&w=1200&q=80|Detroit'in geleneksel otomotiv devleri, elektrikli geleceği kendi elleriyle boğarken farkında değillerdi]

## 2. Perde: Silikon Vadisi'nde İki İnatçı Mühendis

Tam da EV1'in öldeki ezildiği o günlerde, e-kitap okuyucu üreten şirketlerini yeni satmış iki mühendis, Martin Eberhard ve Marc Tarpenning, orta yaş krizlerine çözüm arıyorlardı. Eberhard, çevreye zarar vermeyen ama sürüş keyfinden de ödün vermeyen spor bir araba almak istiyordu. Pazara baktığında gördüğü tek şey hantal, çirkin ve golf arabasından hallice elektrikli araç prototipleriydi.

İkili, tüketici elektroniği sayesinde lityum-iyon pillerin maliyet ve yoğunluk grafiklerinin her yıl daha iyiye gittiğini fark etti. Ortaya koydukları tez radikal ve endüstriyi kökten sarsacak nitelikteydi:

[CALLOUT]"Elektrikli arabayı çevreci olduğu için değil; benzinli bir spor arabadan çok daha hızlı, sessiz ve havalı olabileceğini kanıtlamak için üretmeliyiz."

2003 yılında, alternatif akımın ve modern elektrik dünyasının babası Nikola Tesla'ya atıfta bulunarak şirketi kurdular: **Tesla Motors.**

[IMG:https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80|Silikon Vadisi'nin girişimci ruhu: İki mühendisin garajdan başlayan vizyonu otomotiv tarihini değiştirdi]

## 3. Perde: Sarı Bir Prototip ve Yolları Kesişen Kader

Aynı dönemde Güney Afrikalı genç bir milyarder olan Elon Musk, PayPal'ın satışından elde ettiği servetle SpaceX'i kurmuş, insanlığı çok gezegenli bir türe dönüştürmenin planlarını yapıyordu. Ancak Musk'ın Pennsylvania Üniversitesi'ndeki fizik yıllarından beri taşıdığı bir diğer saplantı **"sürdürülebilir enerji"** idi.

O günlerde AC Propulsion adlı butik bir mühendislik firması, lityum-iyon pillerle çalışan T-Zero adında sarı, el yapımı bir elektrikli spor araba prototipi üzerinde çalışıyordu. Musk bu aracı test ettiğinde hayatının dönüm noktalarından birini yaşadı. Araç, sıfırdan yüze Porsche ve Ferrari modellerine kafa tutacak bir ivmeyle hızlanıyordu. Musk, firmaya bunu seri üretime geçirmesi için yalvardı ve finansman teklif etti ancak butik kalmak isteyen ekip bu yükün altına girmeyi reddetti. Bunun yerine Musk'a şu cümleyi kurdular:

[CALLOUT]"Bizimle aynı fikirde olan ve lityum-iyon pillerle spor araba tasarlayan iki çılgın daha var. Onlarla tanışmalısın."

[IMG:https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=1200&q=80|Elektrikli spor araçlar: Sıfırdan yüze Ferrari'ye kafa tutan performans, Tesla'nın doğuş vizyonuydu]

| Yıl | Olay / Kırılma Noktası | Endüstriyel Etkisi |
| --- | --- | --- |
| 2003 | GM EV1 projesini iptal etti ve araçları hurdaya ayırdı | Elektrikli araç vizyonu geleneksel devler tarafından askıya alındı |
| 2003 | Eberhard ve Tarpenning Tesla Motors'u kurdu | Lityum-iyon pillerin spor araçlarda kullanımı için ilk resmi adım atıldı |
| 2004 | Elon Musk 6.5 milyon dolarlık yatırımla Tesla'ya katıldı | Şirket finansal güce ve agresif küresel büyüme vizyonuna kavuştu |
| 2006 | "Gizli Master Plan" kamuoyuna açıklandı | Otomotiv tarihinin en başarılı kademeli ürün stratejisi uygulanmaya başladı |

## 4. Perde: "Gizli Master Plan" ve Küresel Hegemonya

2004 yılında Elon Musk, Tesla'nın A Serisi yatırım turuna tek başına 6.5 milyon dolar koyarak yönetim kurulu başkanı ve en büyük hissedarı oldu. Musk'ın buradaki dehası, sadece mühendislik vizyonu değil, fizik prensiplerine dayalı acımasız ve kusursuz ticari stratejisiydi. Sektörün imkansız dediği o günlerde, tarihe geçecek **"Gizli Master Plan"ı** kaleme aldı. Strateji basitti ama hata payı yoktu:

**İlk adımda,** çok zengin niş bir kitleye hitap eden, az sayıda ve yüksek fiyatlı bir spor araba (Roadster) üretilecek; bu araba elektrikli araçların çirkin imajını yerle bir edecekti.

**İkinci adımda,** Roadster'dan elde edilen kâr ve teknolojik birikimle, premium segmente hitap eden ama daha geniş kitlelerin alabileceği bir lüks sedan (Model S) pazara sunulacaktı.

**Üçüncü adımda** ise bu lüks sedandan akan devasa nakit ve ölçek ekonomisiyle, tüm dünyanın satın alabileceği, uygun fiyatlı, kitlesel bir aile arabası (Model 3) banttan indirilecekti.

[IMG:https://images.unsplash.com/photo-1617886903355-9354f4351882?auto=format&fit=crop&w=1200&q=80|Tesla Gigafactory: "Gizli Master Plan" stratejisinin somutlaştığı devasa üretim üsleri]

Plan milimi milimine işledi. Bugün Tesla sadece bir otomobil üreticisi değil; enerjiyi üreten (SolarCity/Tesla Solar), depolayan (Megapack/Powerwall) ve onu yollarda tüketen entegre bir temiz enerji ekosistemidir.

## Son Söz

Detroit'in kibirli devleri EV1'i öldeki ezerken kendi sonlarını hazırladıklarının farkında değillerdi. Silikon Vadisi'nin inadı ve Elon Musk'ın vizyonu, petrol çağının tabutuna ilk çiviyi çakarak insanlığı geri dönülemez bir **batarya çağına** taşıdı.`
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
          categoryId: articleData.categoryId
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
    console.error("Failed to seed Tesla origin story article:", e.message);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch(console.error);
