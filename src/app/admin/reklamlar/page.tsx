import { db } from '@/lib/db';
import { updateAdPlacementAction, toggleAllAdPlacementsAction } from '@/app/actions/admin';
import { Settings, CheckCircle2, XCircle, Zap, ShieldCheck } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdPlacementsPage() {
  let placements: any[] = [];
  try {
    placements = await db.adPlacement.findMany({
      orderBy: { slotCode: 'asc' },
    });

    if (placements.length === 0) {
      const publisherId = 'ca-pub-3275598773792351';
      await db.adPlacement.createMany({
        data: [
          { slotCode: 'header_banner', adClient: publisherId, adSlot: '1234567890', minHeight: 90, isActive: true },
          { slotCode: 'sidebar_top', adClient: publisherId, adSlot: '1234567890', minHeight: 250, isActive: true },
          { slotCode: 'in_article_p3', adClient: publisherId, adSlot: '1234567890', minHeight: 90, isActive: true },
        ],
        skipDuplicates: true,
      });

      placements = await db.adPlacement.findMany({
        orderBy: { slotCode: 'asc' },
      });
    }
  } catch (e) {
    console.error('Error fetching ad placements: ', e);
  }

  const allInactive = placements.length > 0 && placements.every((p) => !p.isActive);

  const getPlacementLabel = (code: string) => {
    switch (code) {
      case 'header_banner':
        return 'Header Banner Reklamı (Tepe Reklamı)';
      case 'sidebar_top':
        return 'Sidebar Üst Reklamı (Yan Kolon Reklamı)';
      case 'in_article_p3':
        return 'Yazı İçi Paragraf-3 Reklamı';
      default:
        return code;
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
          Reklam Ayarları (Google AdSense)
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Sayfalardaki Google AdSense reklam slot kodlarını, CLS iskelet yüksekliklerini ve aktiflik durumlarını buradan güncelleyebilirsiniz.
        </p>
      </div>

      {/* Auto Ads Master Mode Switch */}
      <div className="bg-emerald-950 text-white rounded-2xl p-6 shadow-md border border-emerald-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <Zap className="h-5 w-5 text-emerald-400 fill-emerald-400" />
              <h2 className="text-base font-extrabold text-white">Google Auto Ads (Otomatik Reklam) Modu</h2>
              {allInactive ? (
                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-mono px-2.5 py-0.5 rounded-full border border-emerald-500/40">
                  AKTİF (Özel Slotlar Kapalı)
                </span>
              ) : (
                <span className="bg-amber-500/20 text-amber-300 text-[10px] font-mono px-2.5 py-0.5 rounded-full border border-amber-500/40">
                  KARMA (Manuel Slotlar Açık)
                </span>
              )}
            </div>
            <p className="text-xs text-emerald-200/80 leading-relaxed max-w-2xl">
              Google AdSense panelinde Otomatik Reklamları açtıysanız manuel slot ID girmenize gerek yoktur. Manuel alanları kapatarak tamamen Google AI yerleşimini kullanabilirsiniz.
            </p>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            {allInactive ? (
              <form
                action={async () => {
                  "use server";
                  await toggleAllAdPlacementsAction(true);
                }}
              >
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition cursor-pointer shadow"
                >
                  Manuel Slotları Aç
                </button>
              </form>
            ) : (
              <form
                action={async () => {
                  "use server";
                  await toggleAllAdPlacementsAction(false);
                }}
              >
                <button
                  type="submit"
                  className="bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 font-bold text-xs px-4 py-2.5 rounded-xl transition cursor-pointer"
                >
                  ⚡ Sadece Auto Ads Kullan (Manuel Slotları Kapat)
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 text-amber-900 text-xs leading-relaxed space-y-2">
        <div className="font-bold text-sm text-amber-950 flex items-center">
          💡 Reklamların Sitede Görünmesi İçin Kontrol Listesi:
        </div>
        <ol className="list-decimal list-inside space-y-1.5 text-amber-800">
          <li><strong>Gerçek AdSlot ID'leri:</strong> AdSense Panelinizden (<em>Reklamlar &gt; Reklam birimine göre</em>) oluşturduğunuz 10 haneli özel Slot ID'lerinizi aşağıdaki <code>adSlot</code> alanlarına yazın. (Örnek: <code>1234567890</code> varsayılan koda Google reklam sunmaz).</li>
          <li><strong>Google Taraması ve Zamanlama:</strong> AdSense hesabı yeni onaylandığında Google botlarının site içeriğini index'leyip reklam doldurmaya başlaması <strong>2 ila 24 saat</strong> sürebilmektedir.</li>
          <li><strong>Otomatik Reklamlar (Auto Ads):</strong> Özel slot ID girmeden Google'ın otomatik yerleştirmesini isterseniz, AdSense panelinden <em>Otomatik Reklamlar</em> seçeneğini açmanız yeterlidir.</li>
          <li><strong>AdBlocker / Reklam Engelleyici:</strong> Test ederken tarayıcınızdaki reklam engelleyicilerin kapalı olduğundan emin olun.</li>
        </ol>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {placements.map((placement) => (
          <div
            key={placement.id}
            className="border border-gray-150 rounded-2xl p-6 bg-gray-50/50 space-y-6 shadow-sm hover:border-emerald-100 transition-colors"
          >
            <div className="flex justify-between items-start sm:items-center gap-2 border-b border-gray-100 pb-3">
              <div>
                <h3 className="font-extrabold text-gray-900 text-lg flex items-center">
                  <Settings className="h-5 w-5 text-emerald-600 mr-2" />
                  {getPlacementLabel(placement.slotCode)}
                </h3>
                <p className="text-xs text-gray-400 font-mono mt-1">Slot Kodu: {placement.slotCode}</p>
              </div>
              <div className="flex items-center space-x-2">
                {placement.isActive ? (
                  <span className="inline-flex bg-emerald-50 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full items-center border border-emerald-100">
                    <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                    Aktif
                  </span>
                ) : (
                  <span className="inline-flex bg-red-50 text-red-800 text-xs font-bold px-3 py-1 rounded-full items-center border border-red-100">
                    <XCircle className="h-3.5 w-3.5 mr-1" />
                    Pasif
                  </span>
                )}
              </div>
            </div>

            <form
              action={async (formData: FormData) => {
                "use server";
                const isChecked = formData.get('isActive') === 'true';
                formData.set('isActive', isChecked ? 'true' : 'false');
                await updateAdPlacementAction(placement.id, formData);
              }}
              className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end"
            >
              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide">Yayıncı Kimliği (adClient)</label>
                <input
                  name="adClient"
                  type="text"
                  required
                  defaultValue={placement.adClient}
                  placeholder="ca-pub-xxxxxxxxxxxxxxxx"
                  className="block w-full border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide">Reklam Slot ID (adSlot)</label>
                <input
                  name="adSlot"
                  type="text"
                  required
                  defaultValue={placement.adSlot}
                  placeholder="1234567890"
                  className="block w-full border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide">İskelet Yüksekliği (minHeight px)</label>
                <input
                  name="minHeight"
                  type="number"
                  required
                  defaultValue={placement.minHeight}
                  placeholder="250"
                  className="block w-full border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between sm:justify-start">
                <div className="flex items-center space-x-2 py-2">
                  <input
                    id={`isActive-${placement.id}`}
                    name="isActive"
                    type="checkbox"
                    value="true"
                    defaultChecked={placement.isActive}
                    className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded cursor-pointer"
                  />
                  <label htmlFor={`isActive-${placement.id}`} className="text-sm font-semibold text-gray-700 cursor-pointer">
                    Aktif
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-4 py-2.5 rounded-xl text-sm transition-colors cursor-pointer shadow-sm ml-auto"
                >
                  Güncelle
                </button>
              </div>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}
