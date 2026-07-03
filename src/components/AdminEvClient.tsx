"use client";

import { useState, useTransition } from 'react';
import { scanEvDatabaseAction, deleteEvAction } from '@/app/actions/ev-database';
import { RefreshCw, Trash2, Car, Zap, Battery, Search, Loader2, CheckCircle, AlertTriangle } from 'lucide-react';

interface Vehicle {
  id: string;
  brand: string;
  model: string;
  variant: string | null;
  year: number;
  segment: string;
  rangeKm: number | null;
  powerHp: number | null;
  batteryCapacityKwh: number | null;
  priceStartTl: number | null;
  availableInTurkey: boolean;
}

interface AdminEvClientProps {
  vehicles: Vehicle[];
  totalCount: number;
}

export default function AdminEvClient({ vehicles, totalCount }: AdminEvClientProps) {
  const [scanResult, setScanResult] = useState<{ added: number; updated: number } | null>(null);
  const [scanError, setScanError] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleScan = async () => {
    setIsScanning(true);
    setScanResult(null);
    setScanError('');

    const res = await scanEvDatabaseAction();

    if (res.success) {
      setScanResult({ added: res.added, updated: res.updated });
      // Refresh page to show new data
      window.location.reload();
    } else {
      setScanError(res.error || 'Bilinmeyen hata');
    }
    setIsScanning(false);
  };

  const handleDelete = (id: string) => {
    startTransition(async () => {
      await deleteEvAction(id);
      window.location.reload();
    });
  };

  const fmt = (n: number | null) => n ? n.toLocaleString('tr-TR') : '—';

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight flex items-center">
            <Car className="h-6 w-6 text-emerald-600 mr-2" />
            EV Kataloğu Yönetimi
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Veritabanında <span className="font-bold text-gray-800">{totalCount}</span> elektrikli araç kaydı var.
          </p>
        </div>
        <button
          onClick={handleScan}
          disabled={isScanning}
          className="inline-flex items-center bg-violet-600 hover:bg-violet-700 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-colors cursor-pointer disabled:opacity-50 shrink-0 shadow-sm"
        >
          {isScanning ? (
            <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Gemini Tarıyor... (2-3 dk)</>
          ) : (
            <><RefreshCw className="h-4 w-4 mr-2" />Veritabanını Güncelle</>
          )}
        </button>
      </div>

      {scanResult && (
        <div className="flex items-center space-x-2 bg-emerald-50 border border-emerald-100 text-emerald-800 px-4 py-3 rounded-xl text-sm font-bold">
          <CheckCircle className="h-4 w-4 text-emerald-600" />
          <span>Tarama tamamlandı: {scanResult.added} yeni eklendi, {scanResult.updated} güncellendi.</span>
        </div>
      )}

      {scanError && (
        <div className="flex items-center space-x-2 bg-red-50 border border-red-100 text-red-700 px-4 py-3 rounded-xl text-sm font-bold">
          <AlertTriangle className="h-4 w-4" />
          <span>{scanError}</span>
        </div>
      )}

      {vehicles.length > 0 ? (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-left text-sm text-gray-800">
              <thead className="bg-gray-50 text-xs uppercase font-extrabold tracking-wider text-gray-500">
                <tr>
                  <th className="px-5 py-3.5">Marka / Model</th>
                  <th className="px-5 py-3.5">Yıl</th>
                  <th className="px-5 py-3.5">Segment</th>
                  <th className="px-5 py-3.5">Menzil</th>
                  <th className="px-5 py-3.5">Güç</th>
                  <th className="px-5 py-3.5">Batarya</th>
                  <th className="px-5 py-3.5">Fiyat (TL)</th>
                  <th className="px-5 py-3.5">TR</th>
                  <th className="px-5 py-3.5 text-right">İşlem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {vehicles.map((v) => (
                  <tr key={v.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-3">
                      <div className="font-extrabold text-gray-900">{v.brand} {v.model}</div>
                      {v.variant && <span className="text-xs text-gray-500">{v.variant}</span>}
                    </td>
                    <td className="px-5 py-3 text-xs font-bold">{v.year}</td>
                    <td className="px-5 py-3">
                      <span className="text-xs font-bold bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">{v.segment}</span>
                    </td>
                    <td className="px-5 py-3 text-xs font-bold text-emerald-700">{v.rangeKm ? `${v.rangeKm} km` : '—'}</td>
                    <td className="px-5 py-3 text-xs font-bold">{v.powerHp ? `${v.powerHp} HP` : '—'}</td>
                    <td className="px-5 py-3 text-xs font-bold">{v.batteryCapacityKwh ? `${v.batteryCapacityKwh} kWh` : '—'}</td>
                    <td className="px-5 py-3 text-xs font-bold">{v.priceStartTl ? `${fmt(v.priceStartTl)} ₺` : '—'}</td>
                    <td className="px-5 py-3">
                      {v.availableInTurkey ? (
                        <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded-full">✓</span>
                      ) : (
                        <span className="text-[10px] font-bold bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded-full">✗</span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <button
                        onClick={() => handleDelete(v.id)}
                        disabled={isPending}
                        className="bg-white hover:bg-red-50 text-red-600 font-bold px-2.5 py-1 rounded-lg text-xs border border-gray-200 hover:border-red-100 transition-colors cursor-pointer inline-flex items-center disabled:opacity-50"
                      >
                        <Trash2 className="h-3 w-3 mr-1" /> Sil
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-gray-50 border border-dashed border-gray-200 rounded-2xl p-12 text-center space-y-3">
          <Car className="h-10 w-10 text-gray-300 mx-auto" />
          <p className="text-gray-500 text-sm font-semibold">Henüz araç kaydı yok.</p>
          <p className="text-gray-400 text-xs">Yukarıdaki &quot;Veritabanını Güncelle&quot; butonuyla Gemini taraması başlatın.</p>
        </div>
      )}
    </div>
  );
}
