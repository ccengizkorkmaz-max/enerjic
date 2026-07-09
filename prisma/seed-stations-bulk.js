const { PrismaClient } = require('@prisma/client');
const db = new PrismaClient();

async function seed() {
  // Check existing count first
  const existing = await db.chargingStation.count({ where: { isActive: true } });
  if (existing >= 100) {
    console.log(`Already have ${existing} stations. Skipping bulk seed.`);
    await db.$disconnect();
    return;
  }

  const stations = [
    // === İSTANBUL (Avrupa) ===
    { name: 'Zorlu Center AVM', provider: 'ZES', city: 'İstanbul', district: 'Beşiktaş', address: 'Levazım Mah. Koru Sok. No:2', chargerType: 'DC', powerKw: 180 },
    { name: 'Akasya AVM', provider: 'ZES', city: 'İstanbul', district: 'Üsküdar', address: 'Acıbadem Mah. Çeçen Sok. No:25', chargerType: 'DC', powerKw: 150 },
    { name: 'Mall of İstanbul', provider: 'Eşarj', city: 'İstanbul', district: 'Başakşehir', address: 'Ziya Gökalp Mah. Süleyman Demirel Blv.', chargerType: 'DC', powerKw: 120 },
    { name: 'Kanyon AVM', provider: 'ZES', city: 'İstanbul', district: 'Levent', address: 'Büyükdere Cad. No:185', chargerType: 'DC', powerKw: 180 },
    { name: 'Viaport Marina', provider: 'Trugo', city: 'İstanbul', district: 'Tuzla', address: 'Evliya Çelebi Mah. Balıkçı Yolu Sok.', chargerType: 'DC', powerKw: 300 },
    { name: 'İstanbul Havalimanı P1', provider: 'Trugo', city: 'İstanbul', district: 'Arnavutköy', address: 'İstanbul Havalimanı P1 Otopark', chargerType: 'DC', powerKw: 300 },
    { name: 'İstanbul Havalimanı P5', provider: 'ZES', city: 'İstanbul', district: 'Arnavutköy', address: 'İstanbul Havalimanı P5 Otopark', chargerType: 'DC', powerKw: 180 },
    { name: 'Cevahir AVM', provider: 'Eşarj', city: 'İstanbul', district: 'Şişli', address: 'Büyükdere Cad. No:22', chargerType: 'DC', powerKw: 120 },
    { name: 'Emaar Square Mall', provider: 'Trugo', city: 'İstanbul', district: 'Üsküdar', address: 'Libadiye Cad. No:82', chargerType: 'DC', powerKw: 240 },
    { name: 'Vadistanbul AVM', provider: 'ZES', city: 'İstanbul', district: 'Sarıyer', address: 'Ayazağa Mah. Cendere Cad. No:109', chargerType: 'DC', powerKw: 150 },
    { name: 'Capacity AVM', provider: 'Eşarj', city: 'İstanbul', district: 'Bakırköy', address: 'Osmaniye Mah. Çobançeşme Koşuyolu Blv.', chargerType: 'AC/DC', powerKw: 90 },
    { name: 'Sabiha Gökçen Havalimanı', provider: 'Trugo', city: 'İstanbul', district: 'Pendik', address: 'Sabiha Gökçen Havalimanı Otopark', chargerType: 'DC', powerKw: 300 },
    { name: 'ÖzdilekPark İstanbul', provider: 'ZES', city: 'İstanbul', district: 'Beylikdüzü', address: 'Barış Mah. Beykent Blv. No:72', chargerType: 'DC', powerKw: 120 },
    { name: 'Meydan AVM Ümraniye', provider: 'Sharz.net', city: 'İstanbul', district: 'Ümraniye', address: 'Atatürk Mah. Alemdağ Cad. No:77', chargerType: 'AC/DC', powerKw: 60 },
    { name: 'TEM Otoyolu Bolu Yönü', provider: 'Trugo', city: 'İstanbul', district: 'Çatalca', address: 'TEM Otoyolu Habibler Mevkii', chargerType: 'DC', powerKw: 300 },
    { name: 'Torium AVM', provider: 'Voltrun', city: 'İstanbul', district: 'Esenyurt', address: 'Haramidere Beylikdüzü Cad.', chargerType: 'DC', powerKw: 60 },

    // === ANKARA ===
    { name: 'Ankamall AVM', provider: 'ZES', city: 'Ankara', district: 'Yenimahalle', address: 'Mevlana Blv. No:2', chargerType: 'DC', powerKw: 180 },
    { name: 'Next Level AVM', provider: 'Trugo', city: 'Ankara', district: 'Yenimahalle', address: 'Anadolu Blv. No:5', chargerType: 'DC', powerKw: 300 },
    { name: 'Kentpark AVM', provider: 'Eşarj', city: 'Ankara', district: 'Çankaya', address: 'Mustafa Kemal Mah. Eskişehir Yolu', chargerType: 'DC', powerKw: 120 },
    { name: 'Esenboğa Havalimanı', provider: 'ZES', city: 'Ankara', district: 'Çubuk', address: 'Esenboğa Havalimanı Terminal 2', chargerType: 'DC', powerKw: 150 },
    { name: 'Panora AVM', provider: 'ZES', city: 'Ankara', district: 'Çankaya', address: 'Turan Güneş Blv. No:182', chargerType: 'DC', powerKw: 120 },
    { name: 'Gordion AVM', provider: 'Trugo', city: 'Ankara', district: 'Yenimahalle', address: 'İstanbul Yolu 6. Km', chargerType: 'DC', powerKw: 240 },
    { name: 'ODTÜ Teknokent', provider: 'Eşarj', city: 'Ankara', district: 'Çankaya', address: 'ODTÜ Kampüsü Teknokent Binası', chargerType: 'AC', powerKw: 22 },
    { name: 'Cepa AVM', provider: 'Sharz.net', city: 'Ankara', district: 'Çankaya', address: 'Eskişehir Yolu No:119', chargerType: 'AC/DC', powerKw: 60 },

    // === İZMİR ===
    { name: 'Optimum İzmir AVM', provider: 'ZES', city: 'İzmir', district: 'Gaziemir', address: 'Akçay Cad. No:122', chargerType: 'DC', powerKw: 150 },
    { name: 'Mavibahçe AVM', provider: 'Trugo', city: 'İzmir', district: 'Karşıyaka', address: 'Girne Blv. No:20', chargerType: 'DC', powerKw: 240 },
    { name: 'Forum Bornova', provider: 'Eşarj', city: 'İzmir', district: 'Bornova', address: 'Kazım Dirik Mah. 372 Sok.', chargerType: 'DC', powerKw: 120 },
    { name: 'Agora AVM', provider: 'ZES', city: 'İzmir', district: 'Balçova', address: 'Caher Dudayev Blv. No:8', chargerType: 'DC', powerKw: 120 },
    { name: 'İzmir Adnan Menderes Havalimanı', provider: 'Trugo', city: 'İzmir', district: 'Gaziemir', address: 'Adnan Menderes Havalimanı Otopark', chargerType: 'DC', powerKw: 300 },
    { name: 'Hilltown AVM', provider: 'Sharz.net', city: 'İzmir', district: 'Karşıyaka', address: 'Şemikler Mah. Cahar Dudayev Blv.', chargerType: 'AC/DC', powerKw: 60 },
    { name: 'Alaçatı Çeşme Merkez', provider: 'ZES', city: 'İzmir', district: 'Çeşme', address: 'Alaçatı Mah. 18012 Sok.', chargerType: 'AC/DC', powerKw: 90 },

    // === ANTALYA ===
    { name: 'MarkAntalya AVM', provider: 'ZES', city: 'Antalya', district: 'Konyaaltı', address: 'Arapsuyu Mah. Atatürk Blv.', chargerType: 'DC', powerKw: 150 },
    { name: 'TerraCity AVM', provider: 'Trugo', city: 'Antalya', district: 'Muratpaşa', address: 'Fener Mah. Tekelioglu Cad. No:55', chargerType: 'DC', powerKw: 240 },
    { name: 'Antalya Havalimanı', provider: 'Trugo', city: 'Antalya', district: 'Muratpaşa', address: 'Antalya Havalimanı Otopark', chargerType: 'DC', powerKw: 300 },
    { name: 'Deepo Outlet Center', provider: 'Eşarj', city: 'Antalya', district: 'Kepez', address: 'Altınova Sinan Mah. Aspendos Blv.', chargerType: 'DC', powerKw: 120 },
    { name: 'Alanya Cleopatra Sahil', provider: 'Sharz.net', city: 'Antalya', district: 'Alanya', address: 'Saray Mah. Atatürk Cad.', chargerType: 'AC', powerKw: 22 },
    { name: 'Kemer Marina', provider: 'ZES', city: 'Antalya', district: 'Kemer', address: 'Kemer Marina Yolu', chargerType: 'AC/DC', powerKw: 60 },

    // === BURSA ===
    { name: 'Togg Gemlik Fabrikası', provider: 'Trugo', city: 'Bursa', district: 'Gemlik', address: 'Togg Teknoloji Kampüsü', chargerType: 'DC', powerKw: 300 },
    { name: 'Korupark AVM', provider: 'ZES', city: 'Bursa', district: 'Nilüfer', address: 'Beşevler Mah. Odunluk Cad.', chargerType: 'DC', powerKw: 150 },
    { name: 'Susurluk Dinlenme Tesisi', provider: 'Trugo', city: 'Bursa', district: 'Karacabey', address: 'Bursa-İzmir Otoyolu', chargerType: 'DC', powerKw: 300 },
    { name: 'Özdilek Bursa', provider: 'Eşarj', city: 'Bursa', district: 'Osmangazi', address: 'Ulu Çarşı Yolu', chargerType: 'DC', powerKw: 120 },
    { name: 'Nilüfer Park AVM', provider: 'Voltrun', city: 'Bursa', district: 'Nilüfer', address: 'Beşevler Mah. Çetin Cad. No:8', chargerType: 'DC', powerKw: 60 },

    // === MERSİN ===
    { name: 'Forum Mersin', provider: 'ZES', city: 'Mersin', district: 'Yenişehir', address: 'Çiftlikköy Mah. Atatürk Blv.', chargerType: 'DC', powerKw: 150 },
    { name: 'Marina AVM Mersin', provider: 'Trugo', city: 'Mersin', district: 'Yenişehir', address: 'Limonluk Mah. GMK Blv.', chargerType: 'DC', powerKw: 180 },
    { name: 'Tarsus Otoyol Dinlenme', provider: 'Trugo', city: 'Mersin', district: 'Tarsus', address: 'Adana-Mersin Otoyolu', chargerType: 'DC', powerKw: 300 },

    // === ADANA ===
    { name: 'Optimum Adana AVM', provider: 'ZES', city: 'Adana', district: 'Sarıçam', address: 'Çukurova Blv.', chargerType: 'DC', powerKw: 150 },
    { name: 'M1 Adana AVM', provider: 'Eşarj', city: 'Adana', district: 'Seyhan', address: 'Turhan Cemal Beriker Blv.', chargerType: 'DC', powerKw: 120 },
    { name: 'Adana Şakirpaşa Havalimanı', provider: 'Trugo', city: 'Adana', district: 'Seyhan', address: 'Şakirpaşa Havalimanı Otopark', chargerType: 'DC', powerKw: 240 },

    // === KONYA ===
    { name: 'Kent Plaza AVM', provider: 'ZES', city: 'Konya', district: 'Selçuklu', address: 'Akademi Mah. Yeni İstanbul Cad.', chargerType: 'DC', powerKw: 150 },
    { name: 'Novada Outlet', provider: 'Trugo', city: 'Konya', district: 'Selçuklu', address: 'Ankara-Konya Otoyolu', chargerType: 'DC', powerKw: 240 },
    { name: 'Konya Park AVM', provider: 'Eşarj', city: 'Konya', district: 'Selçuklu', address: 'Horozluhan Mah. Yeni İstanbul Cad.', chargerType: 'DC', powerKw: 120 },

    // === GAZİANTEP ===
    { name: 'Sanko Park AVM', provider: 'ZES', city: 'Gaziantep', district: 'Şahinbey', address: 'İnönü Mah. Muammer Aksoy Blv.', chargerType: 'DC', powerKw: 150 },
    { name: 'Primemall Gaziantep', provider: 'Trugo', city: 'Gaziantep', district: 'Şehitkamil', address: '15 Temmuz Mah. Şahinbey Blv.', chargerType: 'DC', powerKw: 180 },

    // === KAYSERİ ===
    { name: 'Forum Kayseri', provider: 'ZES', city: 'Kayseri', district: 'Kocasinan', address: 'Yeni Mahalle Osman Kavuncu Cad.', chargerType: 'DC', powerKw: 150 },
    { name: 'Kayseri Park AVM', provider: 'Trugo', city: 'Kayseri', district: 'Melikgazi', address: 'Sivas Cad. No:160', chargerType: 'DC', powerKw: 180 },

    // === TRABZON ===
    { name: 'Forum Trabzon', provider: 'ZES', city: 'Trabzon', district: 'Yomra', address: 'Kaşüstü Mah. Devlet Sahil Yolu', chargerType: 'DC', powerKw: 120 },
    { name: 'Trabzon Havalimanı', provider: 'Trugo', city: 'Trabzon', district: 'Ortahisar', address: 'Trabzon Havalimanı Otopark', chargerType: 'DC', powerKw: 240 },

    // === ESKİŞEHİR ===
    { name: 'Espark AVM', provider: 'ZES', city: 'Eskişehir', district: 'Tepebaşı', address: 'Yunusemre Cad. No:10', chargerType: 'DC', powerKw: 150 },
    { name: 'Eskişehir Otoyol Dinlenme', provider: 'Trugo', city: 'Eskişehir', district: 'Odunpazarı', address: 'Ankara-Eskişehir Otoyolu', chargerType: 'DC', powerKw: 300 },

    // === MUĞLA ===
    { name: 'Midtown AVM Bodrum', provider: 'ZES', city: 'Muğla', district: 'Bodrum', address: 'Ortakent Mah. Bodrum-Turgutreis Yolu', chargerType: 'DC', powerKw: 120 },
    { name: 'D-Marin Göcek', provider: 'Trugo', city: 'Muğla', district: 'Fethiye', address: 'Göcek Marina', chargerType: 'DC', powerKw: 180 },
    { name: 'Marmaris İçmeler', provider: 'Sharz.net', city: 'Muğla', district: 'Marmaris', address: 'İçmeler Mah. Kayabal Cad.', chargerType: 'AC/DC', powerKw: 60 },
    { name: 'Dalaman Havalimanı', provider: 'ZES', city: 'Muğla', district: 'Dalaman', address: 'Dalaman Havalimanı Otopark', chargerType: 'DC', powerKw: 150 },

    // === SAMSUN ===
    { name: 'Piazza AVM Samsun', provider: 'ZES', city: 'Samsun', district: 'Atakum', address: 'Büyükoyumca Mah. Atatürk Blv.', chargerType: 'DC', powerKw: 120 },
    { name: 'Lovelet AVM', provider: 'Trugo', city: 'Samsun', district: 'İlkadım', address: 'Kale Mah. Atatürk Blv.', chargerType: 'DC', powerKw: 180 },

    // === DENİZLİ ===
    { name: 'Teras Park AVM', provider: 'ZES', city: 'Denizli', district: 'Merkezefendi', address: 'Sümer Mah. Hasan Gönüllü Blv.', chargerType: 'DC', powerKw: 120 },
    { name: 'Forum Çamlık', provider: 'Trugo', city: 'Denizli', district: 'Pamukkale', address: 'Çamlık Cad. No:70', chargerType: 'DC', powerKw: 180 },

    // === KOCAELİ ===
    { name: 'Symbol AVM', provider: 'ZES', city: 'Kocaeli', district: 'İzmit', address: 'Yahya Kaptan Mah. Şehit Erkan Eker Sok.', chargerType: 'DC', powerKw: 150 },
    { name: 'Gebze Center AVM', provider: 'Trugo', city: 'Kocaeli', district: 'Gebze', address: 'Güzeller OSB Mah.', chargerType: 'DC', powerKw: 240 },
    { name: 'İzmit Otoyol Dinlenme', provider: 'Trugo', city: 'Kocaeli', district: 'İzmit', address: 'İstanbul-Ankara Otoyolu', chargerType: 'DC', powerKw: 300 },

    // === TEKİRDAĞ ===
    { name: 'TekirdağPark AVM', provider: 'ZES', city: 'Tekirdağ', district: 'Süleymanpaşa', address: 'Hürriyet Mah. Turgut Özal Blv.', chargerType: 'DC', powerKw: 120 },

    // === SAKARYA ===
    { name: 'Serdivan AVM', provider: 'ZES', city: 'Sakarya', district: 'Serdivan', address: 'İstiklal Mah. Muhsin Yazıcıoğlu Cad.', chargerType: 'DC', powerKw: 120 },
    { name: 'Bolu Dağı Dinlenme Tesisi', provider: 'Trugo', city: 'Sakarya', district: 'Geyve', address: 'İstanbul-Ankara Otoyolu Bolu Dağı', chargerType: 'DC', powerKw: 300 },

    // === DİYARBAKIR ===
    { name: 'Forum Diyarbakır', provider: 'ZES', city: 'Diyarbakır', district: 'Kayapınar', address: 'Peyas Mah. Şanlıurfa Blv.', chargerType: 'DC', powerKw: 120 },
    { name: 'Ninova Park AVM', provider: 'Trugo', city: 'Diyarbakır', district: 'Bağlar', address: 'Kooperatifler Mah. Elazığ Yolu', chargerType: 'DC', powerKw: 180 },

    // === ERZURUM ===
    { name: 'Palerium AVM', provider: 'ZES', city: 'Erzurum', district: 'Yakutiye', address: 'Yenişehir Mah. Cumhuriyet Cad.', chargerType: 'DC', powerKw: 120 },

    // === MALATYA ===
    { name: 'Malatya Park AVM', provider: 'ZES', city: 'Malatya', district: 'Yeşilyurt', address: 'İnönü Üniversitesi Yolu', chargerType: 'DC', powerKw: 120 },

    // === VAN ===
    { name: 'Van AVM', provider: 'ZES', city: 'Van', district: 'İpekyolu', address: 'Şemsibey Mah. Cumhuriyet Cad.', chargerType: 'DC', powerKw: 120 },

    // === AYDIN ===
    { name: 'Forum Aydın', provider: 'ZES', city: 'Aydın', district: 'Efeler', address: 'Zafer Mah. İzmir Blv.', chargerType: 'DC', powerKw: 120 },
    { name: 'Kuşadası Marina', provider: 'Sharz.net', city: 'Aydın', district: 'Kuşadası', address: 'Türkmen Mah. Atatürk Blv.', chargerType: 'AC/DC', powerKw: 60 },

    // === BALIKESİR ===
    { name: 'Edremit Akçay Sahil', provider: 'ZES', city: 'Balıkesir', district: 'Edremit', address: 'Akçay Mah. Sahil Cad.', chargerType: 'AC/DC', powerKw: 60 },
    { name: 'Bandırma Port', provider: 'Trugo', city: 'Balıkesir', district: 'Bandırma', address: 'Liman Mah. İstasyon Cad.', chargerType: 'DC', powerKw: 180 },

    // === ÇANAKKALE ===
    { name: 'Çanakkale 1915 Köprüsü Gişe', provider: 'Trugo', city: 'Çanakkale', district: 'Lapseki', address: '1915 Çanakkale Köprüsü Gişeleri', chargerType: 'DC', powerKw: 300 },

    // === HATAY ===
    { name: 'Palladium Antakya', provider: 'ZES', city: 'Hatay', district: 'Antakya', address: 'Haraparası Mah. Antakya Organize', chargerType: 'DC', powerKw: 120 },
    { name: 'İskenderun Sahil', provider: 'Sharz.net', city: 'Hatay', district: 'İskenderun', address: 'Sahil Mah. Atatürk Blv.', chargerType: 'AC', powerKw: 22 },

    // === OTOYOL DİNLENME TESİSLERİ ===
    { name: 'Bolu Otoyol Dinlenme (İstanbul Yönü)', provider: 'Trugo', city: 'Bolu', district: 'Merkez', address: 'İstanbul-Ankara Otoyolu Bolu', chargerType: 'DC', powerKw: 300 },
    { name: 'Bolu Otoyol Dinlenme (Ankara Yönü)', provider: 'ZES', city: 'Bolu', district: 'Merkez', address: 'İstanbul-Ankara Otoyolu Bolu', chargerType: 'DC', powerKw: 180 },
    { name: 'Düzce Otoyol Dinlenme', provider: 'Trugo', city: 'Düzce', district: 'Merkez', address: 'İstanbul-Ankara Otoyolu Düzce', chargerType: 'DC', powerKw: 300 },
    { name: 'Afyon Otoyol Kavşak', provider: 'Trugo', city: 'Afyonkarahisar', district: 'Merkez', address: 'İzmir-Ankara Otoyolu Afyon', chargerType: 'DC', powerKw: 300 },
    { name: 'Osmancık Otoyol Dinlenme', provider: 'ZES', city: 'Çorum', district: 'Osmancık', address: 'Ankara-Samsun Otoyolu', chargerType: 'DC', powerKw: 150 },
    { name: 'Pozantı Otoyol Dinlenme', provider: 'Trugo', city: 'Adana', district: 'Pozantı', address: 'Ankara-Adana Otoyolu Pozantı', chargerType: 'DC', powerKw: 300 },
    { name: 'Menemen Otoyol Dinlenme', provider: 'Trugo', city: 'İzmir', district: 'Menemen', address: 'İstanbul-İzmir Otoyolu', chargerType: 'DC', powerKw: 300 },
    { name: 'Yalova Feribot İskelesi', provider: 'ZES', city: 'Yalova', district: 'Merkez', address: 'Feribot İskelesi Otopark', chargerType: 'DC', powerKw: 150 },
    { name: 'Bilecik Otoyol Dinlenme', provider: 'Trugo', city: 'Bilecik', district: 'Bozüyük', address: 'Eskişehir-Bursa Otoyolu', chargerType: 'DC', powerKw: 240 },

    // === ANADOLU ŞEHİRLERİ ===
    { name: 'Park Afyon AVM', provider: 'ZES', city: 'Afyonkarahisar', district: 'Merkez', address: 'Dumlupınar Mah. Afyon-Ankara Yolu', chargerType: 'DC', powerKw: 120 },
    { name: 'Piazza AVM Şanlıurfa', provider: 'ZES', city: 'Şanlıurfa', district: 'Karaköprü', address: 'Akçakale Yolu', chargerType: 'DC', powerKw: 120 },
    { name: 'Forum Kapadokya', provider: 'Trugo', city: 'Nevşehir', district: 'Merkez', address: 'Aksaray Yolu', chargerType: 'DC', powerKw: 180 },
    { name: 'Göreme Merkez', provider: 'Sharz.net', city: 'Nevşehir', district: 'Göreme', address: 'Müze Cad.', chargerType: 'AC', powerKw: 22 },
    { name: 'Novada AVM Edirne', provider: 'ZES', city: 'Edirne', district: 'Merkez', address: 'Talatpaşa Mah. E-5 Yolu', chargerType: 'DC', powerKw: 120 },
    { name: 'Piazza AVM Yozgat', provider: 'ZES', city: 'Yozgat', district: 'Merkez', address: 'Ankara-Sivas Yolu', chargerType: 'DC', powerKw: 120 },
    { name: 'Park AVM Tokat', provider: 'ZES', city: 'Tokat', district: 'Merkez', address: 'İstiklal Mah. Gaziosmanpaşa Blv.', chargerType: 'AC/DC', powerKw: 60 },
    { name: 'Piazza AVM Sivas', provider: 'ZES', city: 'Sivas', district: 'Merkez', address: 'Kılavuz Mah. Atatürk Cad.', chargerType: 'DC', powerKw: 120 },
    { name: 'Elazığ Park AVM', provider: 'ZES', city: 'Elazığ', district: 'Merkez', address: 'Üniversite Mah. Zübeyde Hanım Cad.', chargerType: 'DC', powerKw: 120 },
    { name: 'Piazza AVM Kahramanmaraş', provider: 'ZES', city: 'Kahramanmaraş', district: 'Onikişubat', address: 'Karacasu Mah.', chargerType: 'DC', powerKw: 120 },
    { name: 'Park AVM Ordu', provider: 'ZES', city: 'Ordu', district: 'Altınordu', address: 'Bucak Mah. Devlet Sahil Yolu', chargerType: 'AC/DC', powerKw: 60 },
    { name: 'Giresun Sahil Şarj', provider: 'Sharz.net', city: 'Giresun', district: 'Merkez', address: 'Sahil Yolu Cad.', chargerType: 'AC', powerKw: 22 },
    { name: 'Rize Park AVM', provider: 'ZES', city: 'Rize', district: 'Merkez', address: 'İslampaşa Mah. Menderes Blv.', chargerType: 'AC/DC', powerKw: 60 },
    { name: 'Artvin Çoruh Marina', provider: 'Sharz.net', city: 'Artvin', district: 'Merkez', address: 'Çarşı Mah. İnönü Cad.', chargerType: 'AC', powerKw: 22 },
    { name: 'Iğdır Merkez', provider: 'ZES', city: 'Iğdır', district: 'Merkez', address: 'Karaağaç Mah. Atatürk Blv.', chargerType: 'AC/DC', powerKw: 60 },
    { name: 'Kars Merkez', provider: 'ZES', city: 'Kars', district: 'Merkez', address: 'Yusufpaşa Mah. Faikbey Cad.', chargerType: 'AC/DC', powerKw: 60 },
    { name: 'Ağrı Merkez', provider: 'ZES', city: 'Ağrı', district: 'Merkez', address: 'Erzurum Cad.', chargerType: 'AC/DC', powerKw: 60 },
    { name: 'Mardin Park AVM', provider: 'ZES', city: 'Mardin', district: 'Artuklu', address: 'Nur Mah. Yeni Mardin Yolu', chargerType: 'DC', powerKw: 120 },
    { name: 'Batman Merkez', provider: 'ZES', city: 'Batman', district: 'Merkez', address: 'İluh Mah. Turgut Özal Blv.', chargerType: 'AC/DC', powerKw: 60 },
    { name: 'Siirt Park AVM', provider: 'ZES', city: 'Siirt', district: 'Merkez', address: 'Kooperatifler Mah. Cizre Yolu', chargerType: 'AC/DC', powerKw: 60 },
    { name: 'Muş Merkez', provider: 'ZES', city: 'Muş', district: 'Merkez', address: 'Bitlis Cad.', chargerType: 'AC', powerKw: 22 },
    { name: 'Bitlis Merkez', provider: 'ZES', city: 'Bitlis', district: 'Merkez', address: 'Beş Minare Mah. Atatürk Cad.', chargerType: 'AC', powerKw: 22 },
    { name: 'Hakkari Merkez', provider: 'ZES', city: 'Hakkari', district: 'Merkez', address: 'Bulak Mah. Cengiz Topel Cad.', chargerType: 'AC', powerKw: 22 },
    { name: 'Şırnak Merkez', provider: 'ZES', city: 'Şırnak', district: 'Merkez', address: 'Cumhuriyet Mah. Namık Kemal Cad.', chargerType: 'AC', powerKw: 22 },
    { name: 'Tunceli Merkez', provider: 'ZES', city: 'Tunceli', district: 'Merkez', address: 'Moğultay Mah. Atatürk Cad.', chargerType: 'AC', powerKw: 22 },
    { name: 'Bingöl Merkez', provider: 'ZES', city: 'Bingöl', district: 'Merkez', address: 'Kültür Mah. Genç Cad.', chargerType: 'AC', powerKw: 22 },
    { name: 'Kastamonu Merkez', provider: 'ZES', city: 'Kastamonu', district: 'Merkez', address: 'Kuzeykent Mah. Mehmet Akif Ersoy Cad.', chargerType: 'AC/DC', powerKw: 60 },
    { name: 'Sinop Merkez', provider: 'Sharz.net', city: 'Sinop', district: 'Merkez', address: 'Meydankapı Mah. Atatürk Cad.', chargerType: 'AC', powerKw: 22 },
    { name: 'Amasya Merkez', provider: 'ZES', city: 'Amasya', district: 'Merkez', address: 'Dere Mah. Atatürk Cad.', chargerType: 'AC/DC', powerKw: 60 },
    { name: 'Çankırı Merkez', provider: 'ZES', city: 'Çankırı', district: 'Merkez', address: 'Cumhuriyet Mah.', chargerType: 'AC', powerKw: 22 },
    { name: 'Bartın Merkez', provider: 'Sharz.net', city: 'Bartın', district: 'Merkez', address: 'Hürriyet Mah. Kanlıdere Cad.', chargerType: 'AC', powerKw: 22 },
    { name: 'Karabük Safranbolu', provider: 'ZES', city: 'Karabük', district: 'Safranbolu', address: 'Bağlarbaşı Mah.', chargerType: 'AC/DC', powerKw: 60 },
    { name: 'Zonguldak Merkez', provider: 'ZES', city: 'Zonguldak', district: 'Merkez', address: 'Gazipaşa Cad.', chargerType: 'AC/DC', powerKw: 60 },
    { name: 'Burdur Merkez', provider: 'ZES', city: 'Burdur', district: 'Merkez', address: 'Gazi Mah. İstiklal Cad.', chargerType: 'AC', powerKw: 22 },
    { name: 'Isparta Merkez', provider: 'ZES', city: 'Isparta', district: 'Merkez', address: 'Çünür Mah. Süleyman Demirel Blv.', chargerType: 'AC/DC', powerKw: 60 },
    { name: 'Aksaray Merkez', provider: 'ZES', city: 'Aksaray', district: 'Merkez', address: 'Zafer Mah. Nevşehir Cad.', chargerType: 'DC', powerKw: 120 },
    { name: 'Kırşehir Merkez', provider: 'ZES', city: 'Kırşehir', district: 'Merkez', address: 'Ankara Cad.', chargerType: 'AC/DC', powerKw: 60 },
    { name: 'Niğde Merkez', provider: 'ZES', city: 'Niğde', district: 'Merkez', address: 'Dışarı Mah. Adana Yolu', chargerType: 'AC/DC', powerKw: 60 },
    { name: 'Karaman Merkez', provider: 'ZES', city: 'Karaman', district: 'Merkez', address: 'İstiklal Mah. İsmet Paşa Cad.', chargerType: 'AC/DC', powerKw: 60 },
    { name: 'Kırıkkale Merkez', provider: 'ZES', city: 'Kırıkkale', district: 'Merkez', address: 'Fabrikalar Mah. Ankara Cad.', chargerType: 'AC/DC', powerKw: 60 },
    { name: 'Kırklareli Merkez', provider: 'ZES', city: 'Kırklareli', district: 'Merkez', address: 'Karacaibrahim Mah. İstanbul Cad.', chargerType: 'AC/DC', powerKw: 60 },
    { name: 'Uşak Merkez', provider: 'ZES', city: 'Uşak', district: 'Merkez', address: 'İsmetpaşa Mah.', chargerType: 'AC/DC', powerKw: 60 },
    { name: 'Kütahya Merkez', provider: 'ZES', city: 'Kütahya', district: 'Merkez', address: 'Lala Hüseyin Paşa Mah.', chargerType: 'AC/DC', powerKw: 60 },
    { name: 'Manisa Merkez', provider: 'ZES', city: 'Manisa', district: 'Yunusemre', address: 'Laleli Mah. İzmir Yolu', chargerType: 'DC', powerKw: 120 },
    { name: 'Çanakkale Merkez', provider: 'ZES', city: 'Çanakkale', district: 'Merkez', address: 'Barbaros Mah. Atatürk Cad.', chargerType: 'AC/DC', powerKw: 60 },
    { name: 'Tokat Merkez', provider: 'ZES', city: 'Tokat', district: 'Merkez', address: 'Behzat Mah. Gaziosmanpaşa Blv.', chargerType: 'AC/DC', powerKw: 60 },
    { name: 'Osmaniye Merkez', provider: 'ZES', city: 'Osmaniye', district: 'Merkez', address: 'Rızaiye Mah. İstiklal Cad.', chargerType: 'AC/DC', powerKw: 60 },
    { name: 'Adıyaman Merkez', provider: 'ZES', city: 'Adıyaman', district: 'Merkez', address: 'Altınşehir Mah. Atatürk Blv.', chargerType: 'AC/DC', powerKw: 60 },
    { name: 'Düzce Merkez', provider: 'ZES', city: 'Düzce', district: 'Merkez', address: 'Aziziye Mah. İstanbul Cad.', chargerType: 'DC', powerKw: 120 },
    { name: 'Yalova Merkez', provider: 'Trugo', city: 'Yalova', district: 'Merkez', address: 'Süleymanbey Mah. İstanbul Cad.', chargerType: 'DC', powerKw: 180 },
  ];

  let added = 0;
  for (const s of stations) {
    try {
      const exists = await db.chargingStation.findFirst({
        where: { name: s.name, city: s.city }
      });
      if (!exists) {
        await db.chargingStation.create({ data: s });
        added++;
      }
    } catch (e) {
      // skip duplicates silently
    }
  }
  console.log(`Seeded ${added} new stations (${stations.length} total in script, ${existing} existed).`);
  await db.$disconnect();
}

seed().catch(console.error);
