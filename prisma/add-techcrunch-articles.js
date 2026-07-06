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
  console.log("=== Seeding 3 New TechCrunch-Inspired Organic Articles ===");

  // Fetch category IDs
  const categories = await prisma.category.findMany();
  const categoryMap = {};
  categories.forEach(cat => {
    categoryMap[cat.slug] = cat.id;
  });

  const techCrunchArticles = [
    {
      title: "Yapay Zeka ve Sürdürülebilirlik Çıkmazı: Yapay Zekanın Karbon Bedeli Nedir?",
      slug: "yapay-zeka-ve-surdurulebilirlik-cikmazi-karbon-bedeli",
      summary: "Yapay zeka modellerinin yaygınlaşmasıyla birlikte teknoloji devlerinin karbon emisyonları hızla artıyor. Google ve Amazon gibi şirketlerin net-zero hedeflerini sarsan bu enerji krizini ele alıyoruz.",
      imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
      isFeatured: false,
      categoryId: categoryMap['trend-teknolojiler'],
      content: `## Veri Merkezlerinin Görünmeyen Karbon Ayak İzi

Yapay zeka teknolojileri günlük hayatımızın ve iş modellerimizin merkezine yerleşirken, arka planda çalışan devasa bilgi işlem altyapısının çevresel maliyetleri giderek daha görünür hale geliyor. Üretken yapay zeka modellerini eğitmek ve her saniye milyonlarca sorguyu yanıtlamak, geleneksel internet aramalarına kıyasla kat kat daha fazla işlem gücü, dolayısıyla devasa bir elektrik enerjisi gerektiriyor. TechCrunch tarafından paylaşılan güncel veriler, Google'ın karbon emisyonlarının son dönemde yüzde 25, Amazon'un ise yüzde 16 oranında arttığını gösteriyor. Bu tablo, teknoloji devlerinin uzun yıllardır taahhüt ettiği karbon nötr (net-zero) hedeflerinin yapay zeka devrimiyle büyük bir çıkmaza girdiğini açıkça ortaya koyuyor.

## Yapay Zeka Sorgularının Enerji İştahı

Standart bir yapay zeka arama motoruna sorulan tek bir sorunun, basit bir Google arama sorgusuna göre yaklaşık on kat daha fazla elektrik tükettiği tahmin ediliyor. Bu durum, veri merkezlerinin soğutma sistemlerinden işlemci ünitelerine kadar olan tüm aşamalarda enerji talebinin geometrik olarak artmasına yol açıyor. 

Birçok teknoloji firması enerji ihtiyaçlarını rüzgar ve güneş enerjisi gibi temiz kaynaklardan karşılamak için milyarlarca dolarlık anlaşmalar yapsa da, yenilenebilir enerjinin süreksizliği ve veri merkezlerinin 24 saat kesintisiz çalışma zorunluluğu, şebekeyi kömür ve doğalgaz gibi fosil kaynakları kullanmaya mecbur bırakıyor. Bu durum, teknoloji yatırımlarının artmasıyla birlikte küresel ölçekte fosil yakıt tüketiminin de dolaylı olarak tetiklenmesi anlamına geliyor.

## Türkiye ve Küresel Şebeke Altyapıları İçin Çözüm Arayışları

Yapay zekanın bu enerji iştahı, sadece küresel devleri değil, Türkiye gibi gelişmekte olan ülkelerdeki yerel veri merkezlerini ve enerji şebekelerini de doğrudan etkileme potansiyeline sahip. Gelecekte kurulacak yerli yapay zeka altyapılarının şebekeye getireceği yükü dengelemek için veri merkezlerinin doğrudan yenilenebilir enerji santralleriyle entegre edilmesi gerekiyor. 

Aynı zamanda donanım seviyesinde daha az enerji harcayan yeni nesil çip mimarileri ve yazılımsal optimizasyonlar üzerinde çalışan girişimler, iklim teknolojileri pazarının en değerli oyuncuları haline geliyor. Yapay zeka devriminin kalıcı olabilmesi, onun ne kadar akıllı olduğundan ziyade, ne kadar sürdürülebilir enerjiyle beslenebildiğine bağlı olacaktır.`
    },
    {
      title: "İklim Uyumu (Climate Adaptation) Teknolojileri: Girişimciler İçin Yeni Milyar Dolarlık Yatırım Sınıfı",
      slug: "iklim-uyumu-teknolojileri-girisimcilik-firsatlari",
      summary: "2026 yılında risk sermayesi (VC) dünyasında yükselen yeni bir trend var: İklim Uyumu. Küresel ısınmanın kaçınılmaz etkilerine karşı direnç oluşturan yapay zeka ve altyapı girişimlerini inceliyoruz.",
      imageUrl: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80",
      isFeatured: false,
      categoryId: categoryMap['girisimcilik-saas'],
      content: `## Sadece Azaltım Değil Uyum Zamanı

İklim teknolojileri yatırımları uzun bir süre boyunca sadece karbon emisyonlarını azaltmaya, yani güneş panelleri kurmaya veya elektrikli araçlar üretmeye odaklandı. Ancak küresel ısınmanın etkilerinin artık teorik bir gelecek olmaktan çıkıp orman yangınları, kuraklık ve ani sel felaketleri gibi somut krizlerle günlük hayatımıza girmesiyle birlikte VC (girişim sermayesi) dünyasında yeni bir yatırım sınıfı doğdu: İklim Uyumu (Climate Adaptation) teknolojileri. TechCrunch analizlerine göre, iklim değişikliğinin kaçınılmaz sonuçlarına karşı binaları, tarım alanlarını ve şehirleri daha dirençli hale getiren girişimlere yapılan yatırımlar 2026 yılı itibarıyla yüzde 64 oranında artış gösterdi.

## Yapay Zeka ile Afet ve Kuraklık Tahminleme

İklim uyumu girişimlerinin merkezinde, büyük veri ve yapay zeka modelleri yer alıyor. Gelişmiş makine öğrenimi algoritmaları kullanan yeni nesil yazılım şirketleri, uydu görüntüleri ve sensör verilerini analiz ederek tarım arazilerindeki nem oranlarını metre bazında tahmin edebiliyor. 

Bu sayede su kaynakları çok daha tasarruflu kullanılırken, kuraklık dönemlerinde rekolte kayıplarının önüne geçiliyor. Benzer şekilde, orman yangınlarının yayılma yönünü rüzgar ve bitki örtüsü analizleriyle önceden öngören akıllı yazılımlar, acil durum ekiplerinin doğru noktalara yönlendirilmesini sağlayarak milyarlarca dolarlık zararı ve can kayıplarını engelliyor.

## Akdeniz Havzasındaki Türkiye İçin Fırsatlar ve Çözümler

Akdeniz iklim kuşağında yer alan ve kuraklık, su stresi gibi krizlerle karşı karşıya olan Türkiye için iklim uyumu teknolojileri hayati bir öneme sahip. Akıllı tarım yazılımları, deniz suyunu arıtan düşük enerjili desalinasyon sistemleri ve afet yönetim platformları gibi alanlarda faaliyet gösteren yerli girişimler, sadece ülkemizin geleceğini güvence altına almakla kalmayıp küresel pazarlara da ihraç edilebilecek çözümler üretebilir. Sürdürülebilir girişimciliğin yeni dalgası, artık sadece karbon salınımını engellemeyi değil, değişen dünyanın yeni normaline ne kadar hızlı adapte olabileceğimizi tasarlamayı hedefliyor.`
    },
    {
      title: "Laboratuvardan Ticari Yol Haritalarına: Nükleer Füzyon Enerjisi Gerçek Oluyor",
      slug: "nukleer-fuzyon-enerjisi-ticari-yol-haritalari",
      summary: "Yıldızların enerji kaynağı olan nükleer füzyon, 2026 yılında laboratuvar ortamından çıkarak enerji şirketlerinin ticari yol haritalarına girdi. Bu temiz ve sınırsız enerji teknolojisinin geleceğine bakıyoruz.",
      imageUrl: "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=800&q=80",
      isFeatured: false,
      categoryId: categoryMap['trend-teknolojiler'],
      content: `## Sınırsız ve Temiz Enerji Arayışında Yeni Dönem

Güneş ve rüzgar enerjisi temiz bir dünya için en büyük silahlarımız olsa da, hava koşullarına bağlı süreksiz yapıları nedeniyle endüstrinin ihtiyaç duyduğu kesintisiz baz yük ihtiyacını tek başlarına karşılamakta zorlanıyorlar. Bu durum, insanlığı onlarca yıldır hayalini kurduğu nihai enerji kaynağına yönlendiriyor: Nükleer Füzyon. Hidrojen atomlarının birleşerek helyuma dönüşmesi sırasında ortaya çıkan ve güneşe enerjisini veren bu süreç, radyoaktif atık üretmemesi ve sınırsız bir yakıt kaynağına sahip olması nedeniyle temiz enerjinin kutsal kasesi kabul ediliyor. 2026 yılı, nükleer füzyonun sadece bilim insanlarının laboratuvar deneyi olmaktan çıkıp büyük enerji şirketlerinin resmi ticari yol haritalarına dahil olduğu tarihi bir dönüm noktası olarak kayıtlara geçiyor.

## Yatırımların Profesyonelleşmesi ve Enerji Anlaşmaları

Geçtiğimiz yıllarda laboratuvarlarda elde edilen net enerji kazanımı (harcanan enerjiden daha fazlasını üretme) başarılarının ardından, Helion Energy, Commonwealth Fusion Systems ve TAE Technologies gibi girişimler milyarlarca dolarlık yatırımlarla ilk ticari reaktör prototiplerini inşa etmeye başladı. 

Hatta Microsoft gibi teknoloji devleri, yapay zeka veri merkezlerinin devasa elektrik ihtiyacını karşılamak üzere bu füzyon girişimleriyle geleceğe yönelik resmi elektrik satın alma anlaşmaları imzalıyor. Bu durum, finans dünyasının ve büyük teknoloji şirketlerinin füzyon enerjisinin ticari olarak hayata geçebileceğine olan inancını ve bu alandaki sermaye akışını ciddi oranda hızlandırıyor.

## Küresel Enerji Sepeti ve Füzyonun Rolü

Nükleer füzyon enerjisinin ticari şebekelere entegre olması, rüzgar ve güneş gibi yenilenebilir kaynakların tamamlayıcısı olarak küresel enerji dengelerini tamamen değiştirecektir. Fosil yakıtlı termik santrallerin ve geleneksel fisyon (bölünme) prensibiyle çalışan tehlikeli nükleer reaktörlerin yerini alacak olan füzyon, dünyanın en ücra köşelerinde bile sıfır karbon salınımıyla kesintisiz elektrik üretilmesini sağlayacaktır. Henüz yolun başında olsak da, laboratuvardan sanayiye geçiş sürecinin başlamış olması, insanlığın enerji bağımsızlığına ve temiz bir geleceğe her zamankinden daha yakın olduğunu gösteriyor.`
    }
  ];

  console.log(`Inserting ${techCrunchArticles.length} TechCrunch articles...`);

  let count = 0;
  for (const art of techCrunchArticles) {
    try {
      const htmlContent = mdToHtml(art.content);
      
      const existing = await prisma.article.findUnique({
        where: { slug: art.slug }
      });

      if (existing) {
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
        console.log(`Updated TC article: ${art.title}`);
      } else {
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
        console.log(`Created TC article: ${art.title}`);
      }
      count++;
    } catch (e) {
      console.error(`Failed to insert article "${art.title}":`, e.message);
    }
  }

  console.log(`=== Successfully processed ${count} TechCrunch articles ===`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
