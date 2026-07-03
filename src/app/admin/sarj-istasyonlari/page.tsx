import { db } from '@/lib/db';
import { createStationAction, deleteStationAction } from '@/app/actions/stations';
import { MapPin, PlusCircle, Trash2, Zap } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminStationsPage() {
  let stations: any[] = [];
  try {
    stations = await db.chargingStation.findMany({
      orderBy: [{ city: 'asc' }, { name: 'asc' }],
    });
  } catch (e) {
    console.error('Error fetching stations: ', e);
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight flex items-center">
          <Zap className="h-6 w-6 text-emerald-600 mr-2" />
          Şarj İstasyonları Yönetimi
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Şarj rehberinde gösterilecek istasyonları ekleyin veya kaldırın.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Add Form */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-150 rounded-2xl p-6 shadow-sm space-y-5 sticky top-6">
            <h2 className="text-md font-extrabold text-gray-950 flex items-center">
              <PlusCircle className="h-5 w-5 text-emerald-600 mr-2" />
              Yeni İstasyon Ekle
            </h2>
            <form action={async (formData: FormData) => { "use server"; await createStationAction(formData); }} className="space-y-3">
              <input name="name" type="text" required placeholder="İstasyon Adı *"
                className="block w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              <input name="provider" type="text" required placeholder="Sağlayıcı (ZES, Trugo...) *"
                className="block w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              <div className="grid grid-cols-2 gap-3">
                <input name="city" type="text" required placeholder="Şehir *"
                  className="block w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                <input name="district" type="text" required placeholder="İlçe *"
                  className="block w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
              <input name="address" type="text" required placeholder="Adres *"
                className="block w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              <div className="grid grid-cols-2 gap-3">
                <select name="chargerType" className="block w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
                  <option value="AC/DC">AC/DC</option>
                  <option value="DC">DC Hızlı</option>
                  <option value="AC">AC Normal</option>
                </select>
                <input name="powerKw" type="number" defaultValue={50} min={3} placeholder="Güç (kW)"
                  className="block w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
              <button type="submit"
                className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2.5 rounded-xl text-sm transition-colors cursor-pointer">
                İstasyon Ekle
              </button>
            </form>
          </div>
        </div>

        {/* Listing */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-md font-extrabold text-gray-950">Kayıtlı İstasyonlar ({stations.length})</h2>
          {stations.length > 0 ? (
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 text-left text-sm text-gray-800">
                  <thead className="bg-gray-50 text-xs uppercase font-extrabold tracking-wider text-gray-500">
                    <tr>
                      <th className="px-5 py-3.5">İstasyon</th>
                      <th className="px-5 py-3.5">Konum</th>
                      <th className="px-5 py-3.5">Tip / Güç</th>
                      <th className="px-5 py-3.5 text-right">İşlem</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {stations.map((s) => (
                      <tr key={s.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-5 py-3.5">
                          <div className="font-extrabold text-gray-900">{s.name}</div>
                          <span className="text-xs font-bold text-emerald-700">{s.provider}</span>
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-start space-x-1.5 text-xs text-gray-500">
                            <MapPin className="h-3.5 w-3.5 text-gray-400 shrink-0 mt-0.5" />
                            <span>{s.district}, {s.city}</span>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 whitespace-nowrap">
                          <span className="text-xs font-bold bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">{s.chargerType}</span>
                          <span className="text-xs font-bold text-gray-800 ml-2">{s.powerKw} kW</span>
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <form action={async () => { "use server"; await deleteStationAction(s.id); }}>
                            <button type="submit"
                              className="bg-white hover:bg-red-50 text-red-600 font-bold px-2.5 py-1 rounded-lg text-xs border border-gray-200 hover:border-red-100 transition-colors cursor-pointer flex items-center ml-auto">
                              <Trash2 className="h-3 w-3 mr-1" /> Sil
                            </button>
                          </form>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 border border-gray-150 rounded-2xl p-8 text-center text-gray-500 italic">
              Henüz şarj istasyonu kaydı bulunmuyor.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
