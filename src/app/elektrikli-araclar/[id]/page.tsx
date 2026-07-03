import { db } from '@/lib/db';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import EvImageGallery from '@/components/EvImageGallery';
import { getSEOMetadata } from '@/lib/seo';
import { Metadata } from 'next';
import {
  Battery, Zap, Gauge, ArrowLeft, Heart, GitCompare, Share2, Shield,
  Layers, Ruler, Dumbbell, Compass, Award, Fuel, Info
} from 'lucide-react';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const vehicle = await db.electricVehicle.findUnique({ where: { id } });
  if (!vehicle) return {};

  return getSEOMetadata({
    title: `${vehicle.brand} ${vehicle.model} ${vehicle.variant || ''} (${vehicle.year}) Özellikleri & Fiyatı`,
    description: `${vehicle.brand} ${vehicle.model} modelinin gercel menzili, batarya kapasitesi, DC sarj suresi, performansi ve guncel Turkiye fiyati.`,
    slug: `elektrikli-araclar/${id}`,
  });
}

export default async function VehicleDetailPage({ params }: Props) {
  const { id } = await params;
  const vehicle = await db.electricVehicle.findUnique({ where: { id } });

  if (!vehicle) {
    notFound();
  }

  const features: string[] = vehicle.specialFeatures
    ? (() => { try { return JSON.parse(vehicle.specialFeatures); } catch { return []; } })()
    : [];

  const fmt = (n: number | null) => n ? n.toLocaleString('tr-TR') : '—';

  // Parse all image URLs
  const imageUrls: string[] = vehicle.imageUrls
    ? (() => { try { return JSON.parse(vehicle.imageUrls); } catch { return []; } })()
    : vehicle.imageUrl ? [vehicle.imageUrl] : [];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back to Catalog */}
      <div className="mb-6">
        <Link
          href="/elektrikli-araclar"
          className="inline-flex items-center text-sm font-bold text-gray-500 hover:text-emerald-700 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Kataloğa Dön
        </Link>
      </div>

      {/* Main Grid: Info & Image */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10">
        {/* Left Column: Image Gallery */}
        <div className="lg:col-span-7 space-y-4 relative">
          <EvImageGallery imageUrls={imageUrls} brand={vehicle.brand} model={vehicle.model} />
          
          {/* Tag available in Turkey */}
          {vehicle.availableInTurkey && (
            <span className="absolute top-4 left-4 bg-emerald-700 text-white text-xs font-extrabold px-3 py-1.5 rounded-full shadow-sm z-10">
              Türkiye'de Satışta
            </span>
          )}
        </div>

        {/* Right Column: Quick Stats & Title */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div>
              <p className="text-emerald-700 font-extrabold text-sm uppercase tracking-wider">{vehicle.brand}</p>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mt-1">
                {vehicle.model}
                {vehicle.variant && <span className="text-gray-400 font-bold text-xl block sm:inline sm:ml-2">({vehicle.variant})</span>}
              </h1>
              <p className="text-sm text-gray-400 font-bold mt-1">
                Model Yılı: {vehicle.year} · Segment: {vehicle.segment}
              </p>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-gray-50 rounded-2xl p-4 text-center border border-gray-100">
                <Battery className="h-5 w-5 text-emerald-600 mx-auto mb-1" />
                <p className="text-[10px] font-bold text-gray-400 uppercase">Menzil</p>
                <p className="text-base font-extrabold text-gray-800 mt-0.5">
                  {vehicle.rangeKm ? `${vehicle.rangeKm} km` : '—'}
                </p>
              </div>
              <div className="bg-gray-50 rounded-2xl p-4 text-center border border-gray-100">
                <Gauge className="h-5 w-5 text-indigo-600 mx-auto mb-1" />
                <p className="text-[10px] font-bold text-gray-400 uppercase">0-100 km/h</p>
                <p className="text-base font-extrabold text-gray-800 mt-0.5">
                  {vehicle.acceleration0100 ? `${vehicle.acceleration0100}s` : '—'}
                </p>
              </div>
              <div className="bg-gray-50 rounded-2xl p-4 text-center border border-gray-100">
                <Zap className="h-5 w-5 text-amber-500 mx-auto mb-1" />
                <p className="text-[10px] font-bold text-gray-400 uppercase">Hızlı Şarj</p>
                <p className="text-base font-extrabold text-gray-800 mt-0.5">
                  {vehicle.maxDcChargingKw ? `${vehicle.maxDcChargingKw} kW` : '—'}
                </p>
              </div>
            </div>

            {/* Special Features Badges */}
            {features.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-2">
                {features.map((f, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] sm:text-xs font-bold bg-violet-50 text-violet-700 px-2.5 py-1 rounded-full"
                  >
                    {f}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Pricing Box */}
          <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 space-y-3">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase">Başlangıç Fiyatı</p>
              <p className="text-3xl font-black text-gray-900 tracking-tight mt-1">
                {vehicle.priceStartTl ? `${fmt(vehicle.priceStartTl)} ₺` : vehicle.priceStartEur ? `${fmt(vehicle.priceStartEur)} €` : '—'}
              </p>
              {vehicle.priceStartEur && vehicle.priceStartTl && (
                <p className="text-xs text-gray-400 font-bold mt-1">
                  Yurtdışı Fiyatı: {fmt(vehicle.priceStartEur)} €
                </p>
              )}
            </div>

            <div className="flex gap-2">
              <Link
                href={`/elektrikli-araclar/karsilastir?ids=${vehicle.id}`}
                className="flex-1 inline-flex items-center justify-center bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2.5 px-4 rounded-xl text-xs sm:text-sm transition-colors shadow-sm"
              >
                <GitCompare className="h-4 w-4 mr-2" />
                Karşılaştır
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Detail Specs Sheets (ev-database.org Style) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Batarya & Şarj */}
        <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-extrabold text-gray-900 flex items-center border-b border-gray-50 pb-3">
            <Battery className="h-5 w-5 text-emerald-600 mr-2" />
            Batarya & Şarj Özellikleri
          </h2>
          <table className="w-full text-sm">
            <tbody>
              <tr className="border-b border-gray-50">
                <td className="py-2.5 text-gray-500 font-medium">Batarya Kapasitesi</td>
                <td className="py-2.5 text-right font-bold text-gray-800">{vehicle.batteryCapacityKwh ? `${vehicle.batteryCapacityKwh} kWh` : '—'}</td>
              </tr>
              <tr className="border-b border-gray-50">
                <td className="py-2.5 text-gray-500 font-medium">Maksimum DC Şarj Gücü</td>
                <td className="py-2.5 text-right font-bold text-gray-800">{vehicle.maxDcChargingKw ? `${vehicle.maxDcChargingKw} kW` : '—'}</td>
              </tr>
              <tr className="border-b border-gray-50">
                <td className="py-2.5 text-gray-500 font-medium">%10 - %80 DC Şarj Süresi</td>
                <td className="py-2.5 text-right font-bold text-gray-800">{vehicle.dcCharge10To80Min ? `${vehicle.dcCharge10To80Min} dk` : '—'}</td>
              </tr>
              <tr>
                <td className="py-2.5 text-gray-500 font-medium">Maksimum AC Şarj Gücü</td>
                <td className="py-2.5 text-right font-bold text-gray-800">{vehicle.acChargingKw ? `${vehicle.acChargingKw} kW` : '—'}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Motor & Performans */}
        <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-extrabold text-gray-900 flex items-center border-b border-gray-50 pb-3">
            <Gauge className="h-5 w-5 text-indigo-600 mr-2" />
            Motor & Performans
          </h2>
          <table className="w-full text-sm">
            <tbody>
              <tr className="border-b border-gray-50">
                <td className="py-2.5 text-gray-500 font-medium">Motor Gücü (Beygir)</td>
                <td className="py-2.5 text-right font-bold text-gray-800">{vehicle.powerHp ? `${vehicle.powerHp} HP` : '—'}</td>
              </tr>
              <tr className="border-b border-gray-50">
                <td className="py-2.5 text-gray-500 font-medium">Motor Gücü (Kilovat)</td>
                <td className="py-2.5 text-right font-bold text-gray-800">{vehicle.powerKw ? `${vehicle.powerKw} kW` : '—'}</td>
              </tr>
              <tr className="border-b border-gray-50">
                <td className="py-2.5 text-gray-500 font-medium">Maksimum Tork</td>
                <td className="py-2.5 text-right font-bold text-gray-800">{vehicle.torqueNm ? `${vehicle.torqueNm} Nm` : '—'}</td>
              </tr>
              <tr className="border-b border-gray-50">
                <td className="py-2.5 text-gray-500 font-medium">0 - 100 km/h Hızlanma</td>
                <td className="py-2.5 text-right font-bold text-gray-800">{vehicle.acceleration0100 ? `${vehicle.acceleration0100} saniye` : '—'}</td>
              </tr>
              <tr className="border-b border-gray-50">
                <td className="py-2.5 text-gray-500 font-medium">Maksimum Hız</td>
                <td className="py-2.5 text-right font-bold text-gray-800">{vehicle.topSpeedKmh ? `${vehicle.topSpeedKmh} km/h` : '—'}</td>
              </tr>
              <tr>
                <td className="py-2.5 text-gray-500 font-medium">Çekiş Tipi</td>
                <td className="py-2.5 text-right font-bold text-gray-800">{vehicle.driveType || '—'}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Boyutlar & Hacim */}
        <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-extrabold text-gray-900 flex items-center border-b border-gray-50 pb-3">
            <Ruler className="h-5 w-5 text-amber-600 mr-2" />
            Boyutlar & Bagaj Hacmi
          </h2>
          <table className="w-full text-sm">
            <tbody>
              <tr className="border-b border-gray-50">
                <td className="py-2.5 text-gray-500 font-medium">Uzunluk</td>
                <td className="py-2.5 text-right font-bold text-gray-800">{vehicle.lengthMm ? `${vehicle.lengthMm} mm` : '—'}</td>
              </tr>
              <tr className="border-b border-gray-50">
                <td className="py-2.5 text-gray-500 font-medium">Genişlik</td>
                <td className="py-2.5 text-right font-bold text-gray-800">{vehicle.widthMm ? `${vehicle.widthMm} mm` : '—'}</td>
              </tr>
              <tr className="border-b border-gray-50">
                <td className="py-2.5 text-gray-500 font-medium">Yükseklik</td>
                <td className="py-2.5 text-right font-bold text-gray-800">{vehicle.heightMm ? `${vehicle.heightMm} mm` : '—'}</td>
              </tr>
              <tr className="border-b border-gray-50">
                <td className="py-2.5 text-gray-500 font-medium">Aks Mesafesi (Wheelbase)</td>
                <td className="py-2.5 text-right font-bold text-gray-800">{vehicle.wheelbaseMm ? `${vehicle.wheelbaseMm} mm` : '—'}</td>
              </tr>
              <tr className="border-b border-gray-50">
                <td className="py-2.5 text-gray-500 font-medium">Boş Ağırlık (Curb Weight)</td>
                <td className="py-2.5 text-right font-bold text-gray-800">{vehicle.curbWeightKg ? `${vehicle.curbWeightKg} kg` : '—'}</td>
              </tr>
              <tr>
                <td className="py-2.5 text-gray-500 font-medium">Bagaj Hacmi</td>
                <td className="py-2.5 text-right font-bold text-gray-800">{vehicle.trunkLiters ? `${vehicle.trunkLiters} Litre` : '—'}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Enerji Tüketimi & Verimlilik */}
        <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-extrabold text-gray-900 flex items-center border-b border-gray-50 pb-3">
            <Layers className="h-5 w-5 text-blue-600 mr-2" />
            Enerji Tüketimi & Verimlilik
          </h2>
          <table className="w-full text-sm">
            <tbody>
              <tr className="border-b border-gray-50">
                <td className="py-2.5 text-gray-500 font-medium">Batarya Kimyası</td>
                <td className="py-2.5 text-right font-bold text-gray-800">Lityum-İyon</td>
              </tr>
              <tr className="border-b border-gray-50">
                <td className="py-2.5 text-gray-500 font-medium">Ortalama Tüketim (Hesaplanan)</td>
                <td className="py-2.5 text-right font-bold text-gray-800">
                  {vehicle.batteryCapacityKwh && vehicle.rangeKm
                    ? `${((vehicle.batteryCapacityKwh / vehicle.rangeKm) * 100).toFixed(1)} kWh / 100 km`
                    : '—'}
                </td>
              </tr>
              <tr className="border-b border-gray-50">
                <td className="py-2.5 text-gray-500 font-medium">CO2 Emisyonu</td>
                <td className="py-2.5 text-right font-bold text-emerald-700">0 g/km (Sıfır Emisyon)</td>
              </tr>
              <tr>
                <td className="py-2.5 text-gray-500 font-medium">Çevre Dostu Sıralaması</td>
                <td className="py-2.5 text-right font-bold text-emerald-700">A+++ 🏆</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
