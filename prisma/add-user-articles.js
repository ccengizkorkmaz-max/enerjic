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
  console.log("=== Seeding 4 User-Provided Organic Articles ===");

  // Fetch category IDs
  const categories = await prisma.category.findMany();
  const categoryMap = {};
  categories.forEach(cat => {
    categoryMap[cat.slug] = cat.id;
  });

  const userArticles = [
    {
      title: "Elektrikli Araç Almaktan Alıkoyan Korkular ve Gerçekler",
      slug: "elektrikli-arac-almaktan-alikoyan-korkular-ve-gercekler",
      summary: "Elektrikli araçlara yönelik menzil kaygısı, batarya ömrü ve yangın riski gibi en yaygın korkuları güncel veriler ve bilimsel gerçekler ışığında masaya yatırıyoruz.",
      imageUrl: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=800&q=80",
      isFeatured: false,
      categoryId: categoryMap['elektrikli-araclar'],
      content: `## Elektrikli Araçlara Yönelik Yaygın Endişeler ve Gerçekler

Elektrikli araçlar çevre dostu yapıları, düşük işletme maliyetleri ve teknolojik üstünlükleriyle otomotiv dünyasının geleceğini temsil ediyor. Ancak birçok potansiyel alıcı, çeşitli korkular nedeniyle bu teknolojiye geçişte tereddüt yaşıyor. Sektördeki hızlı gelişim ve bilgi kirliliği, elektrikli otomobiller hakkında bazı abartılı algıların yayılmasına yol açıyor. Güncel istatistikler ve bilimsel veriler incelendiğinde, bu korkuların büyük bir kısmının eski bilgilere veya eksik değerlendirmelere dayandığı açıkça görülüyor.

## Yolda Kalma Endişesi ve Şarj Süresi Mitleri

Elektrikli araç denildiğinde akla ilk gelen soru işareti genellikle menzil kaygısı oluyor. Sürücüler, bataryanın beklenmedik bir anda biteceği ve yolda kalacakları endişesini taşıyor. Oysa günümüz batarya teknolojisi bu kaygıyı büyük oranda geçmişte bıraktı. Yeni nesil elektrikli araçların ortalama menzilleri artık 450 ila 560 kilometre arasında değişiyor. Günlük şehir içi sürüşlerin çok büyük bir kısmının 120 kilometrenin altında olduğu düşünüldüğünde, ev tipi şarj üniteleriyle geceden sabaha yapılan dolumlar günlük ihtiyacı fazlasıyla karşılıyor. Sürücüler, elektrikli araç kullanmaya başladıktan kısa bir süre sonra menzil konusunun aslında bir problem olmaktan çıktığını bizzat deneyimliyor.

Şarj süresi ve istasyon bulamama endişesi de benzer şekilde teknolojik gelişmelerle aşılıyor. Benzin istasyonunda harcanan 5 dakikalık süreyle kıyaslama yapıldığında şarj işlemi uzun görünse de, DC hızlı şarj istasyonlarının gücü sayesinde bataryalar 15 ila 30 dakika arasında yüzde 80 doluluğa ulaşıyor. Şehirlerarası yollardaki hızlı şarj altyapısının her geçen gün genişlemesi ve akıllı rota planlama yazılımlarının sürücüyü en uygun istasyona yönlendirmesi, uzun yolculukları sorunsuz hale getiriyor.

## Maliyetler, Batarya Ömrü ve Güvenlik Standartları

Yüksek ilk satın alma maliyeti bir diğer tereddüt noktasıdır. Elektrikli araçlar ilk etapta benzinli muadillerine göre daha pahalı görünse de, işletme ve bakım maliyetleri hesaba katıldığında bu durum hızla değişiyor. Rutin motor yağı değişimleri, şanzıman bakımları ve filtre masraflarının olmaması, ayrıca elektrik birim fiyatlarının akaryakıta kıyasla çok daha ekonomik olması, 5-7 yıllık toplam sahiplik maliyetinde elektrikli araçları çok daha karlı kılıyor.

En çok merak edilen konulardan biri de bataryaların ömrüdür. Bataryanın kısa sürede eskiyeceği ve çok pahalı değişim maliyetleri çıkaracağı korkusu yaygındır. Ancak modern lityum-iyon bataryalar son derece dayanıklı yapıda üretiliyor. Yıllık kapasite kaybı ortalama yüzde 2 civarında seyrediyor ve 8-10 yıl sonunda bile bataryalar orijinal kapasitelerinin yüzde 80'inden fazlasını koruyor. Üreticilerin sunduğu 8 yıl veya 160.000 kilometre gibi uzun süreli batarya garantileri de bu güveni destekliyor.

Güvenlik ve yangın riskleri konusundaki algı ise genellikle medyadaki abartılı haberlerden besleniyor. İstatistiksel çalışmalar, içten yanmalı motorlu araçların elektrikli araçlara kıyasla yaklaşık 20 kat daha fazla yangın riski taşıdığını gösteriyor. Gelişmiş termal yönetim sistemleri ve darbelere karşı ekstra güçlendirilmiş şasi korumaları, elektrikli araçları en az geleneksel otomobiller kadar güvenli kılıyor.

Kış aylarında yaşanan soğuk hava performans kaybı da yavaş yavaş kontrol altına alınıyor. Soğuk havalarda batarya verimliliği nedeniyle menzilde yaşanan düşüşler, araç içi ön ısıtma sistemleri ve yeni nesil ısı pompaları sayesinde minimuma indiriliyor. Norveç gibi dondurucu soğuklara sahip ülkelerde elektrikli araçların pazar payının yüzde 90'ları aşması, bu teknolojinin zorlu kış şartlarında bile ne kadar kararlı çalışabildiğinin en somut kanıtıdır.

Geleceğin dünyasında elektrikli araçlar sadece bir tercih değil, sürdürülebilir yaşamın vazgeçilmez bir parçası haline geliyor. Yaşam döngüsü analizleri, elektrikli araçların üretimden geri dönüşüme kadar olan tüm süreçte benzinli araçlara göre yüzde 50'nin üzerinde daha az karbon salınımı yaptığını ortaya koyuyor. Korkuları ve kulaktan dolma bilgileri bilimsel gerçeklerle değiştirdiğimizde, elektrikli araçların hem çevre hem de bütçe için en mantıklı yatırım olduğu açıkça görülüyor.`
    },
    {
      title: "Türkiye’de Elektrikli Araç Vergi Teşvikleri (2026 Güncel Durum)",
      slug: "turkiyede-elektrikli-arac-vergi-tesvikleri-2026-guncel-durum",
      summary: "Türkiye’de elektrikli araç (EV) sahipliğini teşvik etmek için uygulanan Özel Tüketim Vergisi (ÖTV), KDV ve Motorlu Taşıtlar Vergisi (MTV) avantajlarını ve 2026 güncel matrah dilimlerini inceliyoruz.",
      imageUrl: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80",
      isFeatured: false,
      categoryId: categoryMap['elektrikli-araclar'],
      content: `## Sürdürülebilir Ulaşımda Vergi Avantajları

Türkiye’de elektrikli araç (EV) sahipliğini teşvik etmek ve karbon emisyonlarını azaltmak amacıyla devlet tarafından çeşitli vergi kolaylıkları sunuluyor. Tam bir vergi muafiyeti söz konusu olmasa da, içten yanmalı motorlu (benzinli ve dizel) araçlara kıyasla elektrikli otomobillerde uygulanan Özel Tüketim Vergisi (ÖTV), Katma Değer Vergisi (KDV) ve Motorlu Taşıtlar Vergisi (MTV) oranları oldukça cazip seviyelerde seyrediyor. Özellikle 2026 yılı itibarıyla güncellenen vergi matrahları ve motor gücü sınırları, tüketicilerin elektrikli araçlara geçiş kararını doğrudan etkileyen en önemli finansal argümanların başında geliyor.

## Kademeli ÖTV Yapısı ve Matrah Sınırları

Elektrikli binek otomobillerde uygulanan Özel Tüketim Vergisi, aracın motor gücü (kW) ve vergisiz satış bedeli (matrah) üzerinden kademeli bir şekilde hesaplanıyor. Bu yapı, özellikle motor gücü düşük ve görece daha ulaşılabilir fiyatlı modelleri korumayı hedefliyor. 

Mevcut düzenlemelere göre, motor gücü 160 kW ve altında olan, vergisiz satış bedeli ise 1.650.000 TL sınırını aşmayan otomobiller yüzde 25 ÖTV dilimine girerek en avantajlı grubu oluşturuyor. Bu sınır aşıldığında ise ÖTV oranı yüzde 55 seviyesine tırmanıyor. Motor gücü 160 kW'ın üzerinde olan performans modellerinde ise ÖTV oranları matraha bağlı olarak yüzde 65 ile yüzde 75 arasında değişiklik gösteriyor. Geleneksel benzinli veya dizel araçlarda ÖTV oranlarının yüzde 80'den başlayıp yüzde 220'lerin üzerine kadar çıkabildiği düşünüldüğünde, elektrikli araçların vergi yükü avantajı net bir şekilde ortaya çıkıyor. Bu avantajdan en çok Togg modelleri ile giriş seviyesindeki ithal elektrikli araç modelleri yararlanıyor.

## Katma Değer Vergisi ve Motorlu Taşıtlar Vergisi Yansımaları

Katma Değer Vergisi (KDV) noktasında elektrikli otomobiller için standart olarak yüzde 20 oranı uygulanmaya devam ediyor. Ancak KDV, ÖTV dahil edilmiş toplam bedel üzerinden hesaplandığı için, elektrikli araçların düşük ÖTV oranına sahip olması dolaylı olarak ödenen KDV miktarını da düşürüyor ve aracın nihai anahtar teslim fiyatını aşağıya çekiyor.

Motorlu Taşıtlar Vergisi (MTV) tarafında ise elektrikli araç sahiplerini kalıcı bir tasarruf bekliyor. Elektrikli otomobiller, içten yanmalı motorlu araçlara göre genellikle dörtte bir oranında (yaklaşık yüzde 75 indirimli) bir MTV tarifesine tabi tutuluyor. Araç yaşı ve motor gücüne göre belirlenen bu vergi, uzun vadeli kullanımda ciddi bir bütçe avantajı sağlıyor. Örneğin, 150-160 kW civarında güce sahip Togg T10X gibi popüler modeller için yıllık MTV tutarları, muadili olan benzinli SUV modellerine kıyasla son derece ekonomik seviyelerde kalıyor. Gücü çok daha yüksek olan dört tekerlekten çekişli (AWD) performans modellerinde ise MTV miktarları artsa da indirimli tarife korunmaya devam ediyor.

## Yerli Üretim Gücü ve Ek Avantajlar

Vergi teşviklerinin yanı sıra Türkiye'deki elektrikli araç pazarında yerli üretimin getirdiği bazı ek avantajlar da bulunuyor. Togg gibi yerli üretim modeller gümrük vergilerinden muaf oldukları için ithal rakiplerine göre fiyat açısından daha rekabetçi bir konum elde ediyor. Ayrıca engelli vatandaşlar için sunulan ÖTV muafiyetli araç alım hakları, yasal limitler dahilinde elektrikli araçlarda da geçerliliğini koruyor. Belediyelerin sunduğu ücretsiz veya indirimli otopark imkanları, yeşil enerji yatırımları kapsamında şarj istasyonu kurulumlarına verilen hibeler ve kurumsal alımlarda şirketler için sunulan amortisman kolaylıkları, elektrikli araç ekosistemini bütüncül olarak destekliyor.

Tüketicilerin elektrikli araç satın alırken toplam sahip olma maliyetini (TCO) hesaplamaları ve özellikle 160 kW altı ile matrah sınırı içinde kalan modelleri önceliklendirmeleri finansal açıdan en doğru yaklaşım olacaktır. Bu vergi teşvikleri, elektrikli araçları çok daha erişilebilir hale getirirken hem bireysel bütçeye hem de çevreye katkı sağlamayı kolaylaştırıyor.`
    },
    {
      title: "Elektrikli Araç Şarj Maliyetleri (Türkiye 2026 Güncel Durum)",
      slug: "elektrikli-arac-sarj-maliyetleri-turkiye-2026-guncel-durum",
      summary: "Türkiye’de elektrikli araç şarj maliyetlerini ev şarjı, iş yeri şarjı ve kamuya açık hızlı DC şarj istasyonları üzerinden 2026 fiyatlarıyla inceliyor ve fosil yakıtlarla karşılaştırıyoruz.",
      imageUrl: "https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=800&q=80",
      isFeatured: false,
      categoryId: categoryMap['elektrikli-araclar'],
      content: `## Elektrikli Ulaşımda Kilometre Başına Maliyet Analizi

Elektrikli araç sahipliği (EV) yaygınlaştıkça, potansiyel alıcıların ve mevcut sürücülerin en çok yanıt aradığı konuların başında şarj maliyetleri geliyor. İçten yanmalı motorlu araçlarla kıyaslandığında elektrikli otomobiller yakıt ekonomisi açısından devasa bir avantaj sunuyor. Ancak şarj maliyetleri, elektriğin nereden alındığına bağlı olarak ciddi değişiklikler gösterebiliyor. Evde yavaş şarj yapmak, iş yerindeki AC şarjı kullanmak veya otoyollardaki yüksek hızlı DC istasyonlarını tercih etmek, kilometre başına ödeyeceğiniz bütçeyi doğrudan belirliyor. 2026 yılı Türkiye şartlarında güncel tarifelerle elektrikli araç şarj maliyetlerinin gerçekçi rakamlarını mercek altına alıyoruz.

## Evde Gece Şarjı: Ekonomik Sürüşün Temeli

Elektrikli araç kullanmanın en karlı ve konforlu yöntemi, aracı kendi evinizde veya müstakil garajınızda kurulan 7-11 kW kapasiteli bir duvar kutusu (wallbox) ile şarj etmektir. 2026 yılı güncel mesken elektrik tarifeleri göz önüne alındığında, ev tipi elektrik birim fiyatı kilovatsaat (kWh) başına ortalama 2.5 ila 3.5 TL civarındadır. 

Standart bir elektrikli aracın 100 kilometrede ortalama 16 ila 18 kWh enerji tükettiğini varsaydığımızda, evden şarj edilen bir araçla 100 kilometre yol gitmenin maliyeti sadece 45 ila 60 TL arasında kalmaktadır. Bu rakam, ortalama 100 kilometrede 8-10 litre benzin tüketen ve kilometre başına yaklaşık 3.5 - 5 TL harcayan akaryakıtlı bir otomobille karşılaştırıldığında yaklaşık 6 ila 8 kat daha ucuz bir seyahat anlamına gelmektedir. Yıllık ortalama 15.000 kilometre yol yapan bir sürücü için ev şarjı, yıllık bütçede devasa bir yakıt tasarrufunu beraberinde getirir.

## İş Yerinde AC Şarj ve Otoyollarda Hızlı DC Şarj

Evde şarj imkanı olmayan veya günlük seyahatlerinde iş yerindeki şarj ünitelerini tercih eden sürücüler için maliyetler biraz daha farklı şekilleniyor. Kamuya açık yerlerdeki AC şarj cihazları veya iş yeri elektrik tarifeleriyle şarj edildiğinde, birim maliyet kWh başına 4 ila 6 TL bandına yükseliyor. Bu durumda 100 kilometrelik seyahat maliyeti yaklaşık 80 ila 110 TL arasında değişiyor ki bu da benzinli bir araca kıyasla halen 4-5 kat daha ekonomik bir değer sunuyor.

Uzun yolculukların vazgeçilmezi olan ve 50 kW ile 350 kW arasında yüksek güç sunan hızlı DC şarj istasyonları ise en maliyetli şarj seçeneğidir. Kamu hızlı şarj istasyonlarında 2026 yılı birim fiyatları operatör ve istasyon gücüne göre kWh başına 5 ila 8 TL arasında seyrediyor. 100 kilometrede ortalama 18-22 kWh harcayan bir aracın hızlı şarj maliyeti 110 ila 170 TL arasına denk gelse de, bu oran benzinli araçlarla kıyaslandığında halen yarı yarıyadan fazla bir tasarruf oranı sunmaktadır. Bazı şarj operatörlerinin sunduğu aylık abonelik paketleri sayesinde bu hızlı şarj maliyetlerini daha da aşağıya çekmek mümkündür.

## Şarj Verimliliğini ve Tüketimi Etkileyen Dinamikler

Elektrikli araçlarda şarj maliyetti sadece birim fiyatla sınırlı değildir. Sürüş tarzınız ve hava koşulları tüketimi doğrudan etkiler. Özellikle kış aylarında kabin ısıtması ve bataryanın optimum sıcaklıkta kalması için harcanan enerji, tüketim değerlerini yüzde 20-30 oranında artırabilir. Ayrıca şehir içi sürüşlerde rejeneratif frenleme (motorun yavaşlarken elektrik üretmesi) sistemini aktif olarak kullanmak, şarj ihtiyacını azaltarak dolaylı yoldan maliyetleri düşürür.

Şarj işlemi sırasında kablolarda ve akım dönüştürücülerde yaşanan yüzde 5 ila 15 arasındaki enerji kayıplarını da hesaba katmak gerekir. Uzun vadeli maliyet hesaplarında, evine güneş enerjisi (GES) kuran veya elektrik kullanımında üç zamanlı tarife seçerek şarjı gece saat 22:00 ile 06:00 arasına zamanlayan sürücüler, kilometre başına maliyetlerini neredeyse sıfıra yaklaştırabilmektedir. Elektrikli araçların sunduğu bu esnek şarj ve düşük işletme maliyeti, onları sadece çevreci değil, aynı zamanda günümüzün en ekonomik ulaşım alternatifi haline getirmektedir.`
    },
    {
      title: "Wallbox (Ev Tipi Şarj Cihazı) Kurulum Maliyetleri – Türkiye 2026",
      slug: "wallbox-ev-tipi-sarj-cihazi-kurulum-maliyetleri-turkiye-2026",
      summary: "Evde elektrikli araç şarj etmenin en verimli yolu olan Wallbox cihazlarının 2026 Türkiye güncel fiyatlarını, altyapı kurulum maliyetlerini ve amortisman sürelerini inceliyoruz.",
      imageUrl: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=800&q=80",
      isFeatured: false,
      categoryId: categoryMap['elektrikli-araclar'],
      content: `## Evde Güvenli ve Hızlı Şarjın Maliyeti

Elektrikli araç sahipliğinin en büyük avantajlarından biri, yakıt dolum işlemini evinizin konforunda gerçekleştirebilmektir. Bu sürecin en güvenli ve hızlı yolu ise "Wallbox" olarak adlandırılan duvar tipi şarj cihazlarının kullanılmasıdır. Standart prizlerden yapılan şarj işlemleri hem çok yavaş sürer hem de tesisat üzerinde ısınma yaratarak güvenlik riski oluşturabilir. Wallbox kurulumu ise bu süreci hem hızlandırır hem de akıllı enerji yönetimi sunar. Ev tipi şarj istasyonu kurmak isteyen sürücüler için maliyet, cihazın kendisi ve altyapı kurulumu olmak üzere iki temel kaleme ayrılıyor. 2026 yılı Türkiye piyasası verilerine göre güncel maliyetleri ve dikkat edilmesi gereken altyapı koşullarını detaylandırıyoruz.

## Cihaz Seçimi ve Fiyat Aralıkları

Ev tipi şarj cihazlarında fiyatı belirleyen en önemli unsurlar cihazın maksimum güç çıkışı (kW), akıllı yazılım desteği ve marka bilinirliğidir. 

Pazarda giriş seviyesini temsil eden 7,4 kW gücündeki temel modeller, genellikle müstakil evler veya geceden sabaha uzun süre park halinde kalan araçlar için ekonomik bir seçenek sunuyor. Mobil uygulama kontrolü, şarj zamanlama ve güneş panelleriyle entegrasyon gibi akıllı özellikler sunan 11 kW gücündeki orta seviye modeller ise günümüzde elektrikli araç sahiplerinin en çok tercih ettiği ideal segmenti oluşturuyor. Çok daha hızlı şarj imkanı sunan 22 kW gücündeki premium modeller ise genellikle daha güçlü şebeke altyapısı ve araç içi dönüştürücü desteği gerektirdiği için üst bütçe diliminde yer alıyor. Cihaz fiyatları bu özelliklere göre değişkenlik gösterirken, Vestel, Togg Wallbox, Webasto ve ABB gibi markalar Türkiye pazarında öne çıkıyor.

## Kurulum, Kablolama ve Apartman İzinleri

Cihazı satın aldıktan sonra karşılaşılan asıl değişken kalemi altyapı ve işçilik maliyetleridir. Bu maliyet, şarj istasyonunun kurulacağı garaj ile ana elektrik panosu arasındaki mesafeye, bina tipine ve mevcut elektrik tesisatının gücüne doğrudan bağlıdır. 

Ana panoya yakın, sadece birkaç metrelik kablolama gerektiren basit kurulumlar son derece ekonomik bütçelerle tamamlanabiliyor. Ancak kablo mesafesi arttıkça, panoda sigorta yenilemeleri, kaçak akım rölesi eklemeleri ve kablo kanalı inşaat işleri devreye girdiğinde kurulum maliyetleri artış gösteriyor. Apartman veya sitelerde ortak alana yapılacak kurulumlarda ise apartman yönetimi onayı alınması, kabloların daire sayaçlarına çekilmesi veya ortak sayaçtan süzme sayaç ile ayrılması gibi karmaşık süreçler işçilik maliyetini yükseltebiliyor. Ayrıca, evinizin ana elektrik panosunun trifaze (3 fazlı) ve yeterli akım gücünde olmaması durumunda panoda güç artışı yapılması ek elektrikçi maliyetleri doğuruyor.

## Yatırımın Amorti Süresi ve Doğru Tercihler

Wallbox kurulumu ilk bakışta ek bir finansal yük gibi görünse de, uzun vadede elektrikli aracın sunduğu düşük şarj maliyetinden maksimum düzeyde yararlanmayı sağlıyor. Yıllık ortalama 12.000 ila 15.000 kilometre yol kat eden bir sürücü, dışarıdaki DC hızlı şarj istasyonları yerine evden şarj etmeyi tercih ettiğinde yıllık çok ciddi bir yakıt tasarrufu elde ediyor. 

Bu tasarruf oranı göz önüne alındığında, yapılan Wallbox ve kurulum yatırımı genellikle 1 ila 2 yıl içinde kendini tamamen amorti ediyor. Yatırım yapmadan önce mevcut elektrik tesisatınızın gücünü ölçtürmek ve bir elektrik mühendisinden rapor almak en doğru adımdır. Çoğu binek elektrikli araç için 11 kW gücündeki trifaze bir şarj istasyonu kurdurmak, hem şebekeyi yormamak hem de makul sürelerde (ortalama 6-8 saatte) tam dolum elde etmek için en optimum çözümü sunmaktadır.`
    }
  ];

  console.log(`Inserting ${userArticles.length} user articles...`);

  let count = 0;
  for (const art of userArticles) {
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
        console.log(`Updated user article: ${art.title}`);
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
        console.log(`Created user article: ${art.title}`);
      }
      count++;
    } catch (e) {
      console.error(`Failed to insert user article "${art.title}":`, e.message);
    }
  }

  console.log(`=== Successfully processed ${count} user articles ===`);
  await prisma.$disconnect();
}

main().catch(console.error);
