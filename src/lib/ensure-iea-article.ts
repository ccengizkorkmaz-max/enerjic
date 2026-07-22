import { db } from '@/lib/db';

export async function ensureIEAArticle() {
  try {
    const slug = 'iea-2026-kuresel-batarya-uretimi-ve-ticaret-raporu';
    const existing = await db.article.findUnique({
      where: { slug },
    });

    if (existing) return;

    let category = await db.category.findFirst({
      where: { slug: 'temiz-enerji' },
    });

    if (!category) {
      category = await db.category.findFirst();
    }

    if (!category) return;

    const title = 'IEA 2026 Küresel Batarya Raporu: Üretim Kapasitesi 4 TWh’a Ulaştı, Çin Hakimiyeti Sürecek mi?';
    const summary = "Uluslararası Enerji Ajansı'nın (IEA) Global EV Outlook 2026 raporuna göre küresel lityum-iyon batarya üretim kapasitesi 4 TWh seviyesini aştı. Prizmatik hücrelerden tedarik zincirindeki jeopolitik risklere kadar 2026 batarya piyasasının öne çıkan tüm detayları.";
    const imageUrl = 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?q=80&w=1200&auto=format&fit=crop';

    const content = `
<p class="lead font-medium text-xl text-gray-700 mb-6">
  Uluslararası Enerji Ajansı (IEA) tarafından yayımlanan <strong>Global EV Outlook 2026</strong> raporu, temiz ulaşım dönüşümünün merkezinde yer alan küresel batarya endüstrisine dair kritik verileri ortaya koydu. Raporun <em>"Battery Manufacturing and Trade" (Batarya Üretimi ve Ticareti)</em> bölümü, üretim kapasitelerinden hücre mimarilerine ve tedarik zincirindeki kritik darboğazlara kadar çarpıcı tablonun altını çiziyor.
</p>

<h2 class="text-2xl font-bold text-gray-900 mt-8 mb-4">1. Küresel Üretim Kapasitesi 4 TWh Barajını Aştı</h2>
<p class="mb-4">
  2025 yılı sonu itibarıyla küresel lityum-iyon batarya nominal üretim kapasitesi bir önceki yıla göre yaklaşık <strong>%30 artarak 4 TWh (Teravatsaat)</strong> seviyesine ulaştı. 
</p>
<p class="mb-4">
  Avrupa Birliği ve Amerika Birleşik Devletleri'nde kapasite artış hızı yıllık %50 civarında gerçekleşirken, Çin'deki kapasite büyümesi %25 düzeyinde kaldı. Bununla birlikte, Asya dışındaki yükselen pazarlarda (İngiltere Sunderland Envision AESC yatırımları ve Güneydoğu Asya hamleleri ile) batarya üretim kapasitesi neredeyse iki katına çıktı.
</p>

<h2 class="text-2xl font-bold text-gray-900 mt-8 mb-4">2. Coğrafi Yoğunlaşma ve Çin’in Pazar Hakimiyeti</h2>
<p class="mb-4">
  Batı dünyasındaki yeni devasa fabrika (Gigafactory) yatırımlarına rağmen, küresel batarya üretimindeki coğrafi kümelenme aşılması zor bir görünüm sunuyor:
</p>
<ul class="list-disc list-inside space-y-2 mb-6 text-gray-700">
  <li><strong>Çin'in Payı:</strong> Dünyadaki toplam batarya üretim kapasitesinin <strong>%80'inden fazlasına</strong> Çin ev sahipliği yapıyor.</li>
  <li><strong>AB ve ABD Payı:</strong> Avrupa Birliği ve ABD'nin küresel kapasitedeki payı ise yalnızca <strong>%6 ile %7</strong> arasında seyrediyor.</li>
  <li><strong>Küresel Satışlarda Çin Liderliği:</strong> 2025 yılında küresel elektrikli araçlarda kullanılan batarya hücrelerinin <strong>%75'e yakını</strong> Çin merkezli üreticiler (CATL, BYD vb.) tarafından sağlandı. Ayrıca Avrupa'da satılan elektrikli araçların yarısından fazlasında Çin menşeli bataryalar kullanıldı.</li>
</ul>

<h2 class="text-2xl font-bold text-gray-900 mt-8 mb-4">3. Hücre Mimarilerinde Rekabet: Prizmatik, Silindirik ve Kese</h2>
<p class="mb-4">
  Sektördeki teknoloji yarışı üç temel fiziksel hücre yapısı (Form Factor) etrafında şekilleniyor:
</p>
<div class="bg-emerald-50/60 border border-emerald-100 rounded-2xl p-5 my-6 space-y-4">
  <div>
    <h3 class="font-bold text-emerald-900 text-base">🔷 Prizmatik (Prismatic) Hücreler (%60+ Pazar Payı)</h3>
    <p class="text-sm text-emerald-800 mt-1">
      Küresel pazarın açık ara lideri. Çinli üreticilerin öncülük ettiği bu format; CTP (Cell-to-Pack) ve CTC (Cell-to-Chassis) tasarımlarıyla modül aşamasını ortadan kaldırarak hacimsel enerji yoğunluğunu artırıyor. Özellikle LFP (Lityum Demir Fosfat) bataryalarda yoğun olarak tercih ediliyor.
    </p>
  </div>
  <div>
    <h3 class="font-bold text-emerald-900 text-base">🔋 Silindirik (Cylindrical) Hücreler</h3>
    <p class="text-sm text-emerald-800 mt-1">
      1991 yılında Sony ile hayatımıza giren bu form faktör, Panasonic ve Tesla ortaklığı sayesinde ABD pazarında güçlü konumunu koruyor.
    </p>
  </div>
  <div>
    <h3 class="font-bold text-emerald-900 text-base">✉️ Kese (Pouch) Hücreler</h3>
    <p class="text-sm text-emerald-800 mt-1">
      Yüksek enerji yoğunluğu ve esnek paketleme imkanı sunan kese hücreler, Koreli üreticilerin (LG Energy Solution, SK On, Samsung SDI) küresel pazardaki amiral gemisi konumunda.
    </p>
  </div>
</div>

<h2 class="text-2xl font-bold text-gray-900 mt-8 mb-4">4. Tedarik Zincirindeki Hassas Darboğazlar ve Jeopolitik Riskler</h2>
<p class="mb-4">
  Hücre montaj fabrikaları kurmak sanılanın aksine buzdağının sadece görünen kısmı. Batarya ara bileşenleri (midstream) tarafında bağımlılık oranları çok daha yüksek:
</p>
<ul class="list-disc list-inside space-y-2 mb-6 text-gray-700">
  <li><strong>Katot Öncülleri (Precursors) & Grafite Anotlar:</strong> NMC katot öncülleri, LFP bileşenleri ve sentetik/doğal grafit anot üretiminin <strong>%80-90'ı Çin'de</strong> yapılıyor.</li>
  <li><strong>İhracat Kısıtlamaları:</strong> Çin'in 2023 ve 2025 sonlarında duyurduğu ihracat kontrolleri (Export Controls); katot, anot ve üretim ekipmanı teknolojilerinin ihracatını sınırlandırarak Batılı üreticilerin tedarik güvenliği risklerini artırıyor.</li>
</ul>

<h2 class="text-2xl font-bold text-gray-900 mt-8 mb-4">5. Üretim Maliyetleri: Batı Neden %50 Daha Pahalı?</h2>
<p class="mb-4">
  Devlet sübvansiyonları hariç tutulduğunda, ABD ve Avrupa'daki batarya hücresi üretim maliyetleri Çin'e kıyasla <strong>%50'ye varan oranlarda daha yüksek</strong>. Bunun temel nedenleri:
</p>
<ol class="list-decimal list-inside space-y-2 mb-6 text-gray-700">
  <li>Çin'deki devasa üretim ölçeği ve otomasyon seviyesi,</li>
  <li>Düşük malzeme ve bileşen tedarik maliyetleri,</li>
  <li>Yeni kurulan fabrikalarda kârlı verimlilik oranına (%90+ yield) ulaşmanın <strong>5 yılı aşkın bir süre</strong> alması.</li>
</ol>

<h2 class="text-2xl font-bold text-gray-900 mt-8 mb-4">Sonuç</h2>
<p class="mb-4">
  IEA 2026 raporu, küresel elektrikli araç pazarında sürdürülebilir büyümenin sadece araç satmakla değil, uçtan uca dayanıklı ve çeşitlendirilmiş bir batarya tedarik zinciri kurmakla mümkün olacağını bir kez daha ortaya koyuyor. Önümüzdeki dönemde yerli batarya ekosistemi kurmak isteyen ülkelerin uzun vadeli kamu politikaları ve kararlı sermaye yatırımları yapması kaçınılmaz görünüyor.
</p>
`;

    await db.article.create({
      data: {
        title,
        summary,
        slug,
        content,
        imageUrl,
        categoryId: category.id,
        publishedAt: new Date(),
        isFeatured: true,
      },
    });

    console.log('IEA Global EV Outlook 2026 article auto-created successfully!');
  } catch (err) {
    console.error('Error ensuring IEA article:', err);
  }
}
