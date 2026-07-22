import { db } from '@/lib/db';
import { getSEOMetadata } from '@/lib/seo';
import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, GitCompareArrows, Trophy, Sparkles, Battery, Zap, Gauge, Ruler, CreditCard, BatteryCharging } from 'lucide-react';

export const metadata: Metadata = getSEOMetadata({
  title: 'Elektrikli Araç Karşılaştırma',
  description: 'Elektrikli araçları detaylı teknik özellikler tablosuyla karşılaştırın.',
  slug: 'elektrikli-araclar/karsilastir',
});

export const dynamic = 'force-dynamic';

interface PageProps {
  searchParams: Promise<{ ids?: string }>;
}

// Comparison spec rows definition
const SPEC_SECTIONS = [
  {
    title: 'Performans',
    icon: '⚡',
    specs: [
      { key: 'powerHp', label: 'Güç (HP)', unit: ' HP', best: 'max' },
      { key: 'powerKw', label: 'Güç (kW)', unit: ' kW', best: 'max' },
      { key: 'torqueNm', label: 'Tork', unit: ' Nm', best: 'max' },
      { key: 'acceleration0100', label: '0-100 km/h', unit: ' sn', best: 'min' },
      { key: 'topSpeedKmh', label: 'Maksimum Hız', unit: ' km/h', best: 'max' },
      { key: 'driveType', label: 'Çekiş Tipi', unit: '', best: null },
    ],
  },
  {
    title: 'Batarya & Menzil',
    icon: '🔋',
    specs: [
      { key: 'batteryCapacityKwh', label: 'Batarya Kapasitesi', unit: ' kWh', best: 'max' },
      { key: 'rangeKm', label: 'Menzil (WLTP)', unit: ' km', best: 'max' },
    ],
  },
  {
    title: 'Şarj',
    icon: '🔌',
    specs: [
      { key: 'maxDcChargingKw', label: 'Maks DC Şarj', unit: ' kW', best: 'max' },
      { key: 'dcCharge10To80Min', label: 'DC 10→80% Süre', unit: ' dk', best: 'min' },
      { key: 'acChargingKw', label: 'AC Şarj Gücü', unit: ' kW', best: 'max' },
    ],
  },
  {
    title: 'Boyut & Ağırlık',
    icon: '📏',
    specs: [
      { key: 'lengthMm', label: 'Uzunluk', unit: ' mm', best: null },
      { key: 'widthMm', label: 'Genişlik', unit: ' mm', best: null },
      { key: 'heightMm', label: 'Yükseklik', unit: ' mm', best: null },
      { key: 'wheelbaseMm', label: 'Aks Mesafesi', unit: ' mm', best: 'max' },
      { key: 'curbWeightKg', label: 'Ağırlık', unit: ' kg', best: 'min' },
      { key: 'trunkLiters', label: 'Bagaj Hacmi', unit: ' L', best: 'max' },
    ],
  },
  {
    title: 'Fiyat & Pazar',
    icon: '💰',
    specs: [
      { key: 'priceStartTl', label: 'Başlangıç Fiyatı (TL)', unit: ' ₺', best: 'min', format: true },
      { key: 'priceStartEur', label: 'Başlangıç Fiyatı (EUR)', unit: ' €', best: 'min', format: true },
      { key: 'segment', label: 'Segment', unit: '', best: null },
      { key: 'year', label: 'Model Yılı', unit: '', best: 'max' },
    ],
  },
];

export default async function ComparePage({ searchParams }: PageProps) {
  const { ids = '' } = await searchParams;
  const idList = ids.split(',').filter(Boolean).slice(0, 3);

  if (idList.length < 2) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <GitCompareArrows className="h-12 w-12 text-gray-300 mx-auto" />
        <h1 className="text-2xl font-extrabold text-gray-900">Karşılaştırma</h1>
        <p className="text-gray-500 text-sm">En az 2 araç seçmelisiniz. Katalog sayfasından araç seçin.</p>
        <Link href="/elektrikli-araclar" className="inline-flex items-center text-emerald-700 font-bold text-sm hover:text-emerald-800">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Kataloğa Dön
        </Link>
      </div>
    );
  }

  let vehicles: any[] = [];
  try {
    vehicles = await db.electricVehicle.findMany({
      where: { id: { in: idList } },
    });
    // Maintain original order
    vehicles = idList.map((id) => vehicles.find((v) => v.id === id)).filter(Boolean);
  } catch (e) {
    console.error('Error fetching EVs for comparison:', e);
  }

  // Parse special features
  const vehicleFeatures = vehicles.map((v) => {
    try { return JSON.parse(v.specialFeatures || '[]'); } catch { return []; }
  });

  // Collect ALL unique features
  const allFeatures = [...new Set(vehicleFeatures.flat())].sort() as string[];

  // Find best value per spec
  const getBestIdx = (key: string, direction: string | null) => {
    if (!direction) return -1;
    const values = vehicles.map((v: any) => v[key]).filter((val: any) => val != null);
    if (values.length === 0) return -1;
    const best = direction === 'max' ? Math.max(...values) : Math.min(...values);
    return vehicles.findIndex((v: any) => v[key] === best);
  };

  const fmt = (n: number) => n.toLocaleString('tr-TR');

  const colWidth = vehicles.length === 2 ? 'w-1/2' : 'w-1/3';

  const rangeWinnerIdx = getBestIdx('rangeKm', 'max');
  const powerWinnerIdx = getBestIdx('powerHp', 'max');
  const chargingWinnerIdx = getBestIdx('maxDcChargingKw', 'max');
  const priceWinnerIdx = getBestIdx('priceStartTl', 'min');

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <Link href="/elektrikli-araclar" className="text-gray-400 hover:text-gray-700 p-1">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight flex items-center">
              <GitCompareArrows className="h-6 w-6 text-emerald-600 mr-2" />
              Araç Karşılaştırma
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">{vehicles.length} araç karşılaştırılıyor</p>
          </div>
        </div>
      </div>

      {/* AI Decision Support Assistant Card */}
      <div className="bg-gradient-to-br from-emerald-950 via-emerald-900 to-gray-900 text-white rounded-3xl p-6 sm:p-8 mb-8 border border-emerald-800 shadow-xl space-y-4">
        <div className="flex items-center space-x-2 border-b border-emerald-800/80 pb-4">
          <Sparkles className="h-5 w-5 text-emerald-400 fill-emerald-400 animate-pulse" />
          <h2 className="text-lg font-extrabold text-white">Yapay Zeka Karar Destek Özeti</h2>
          <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border border-emerald-500/40">
            Otomatik Analiz
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          {rangeWinnerIdx !== -1 && (
            <div className="bg-emerald-900/50 border border-emerald-700/60 rounded-2xl p-4 space-y-1">
              <div className="flex items-center text-xs font-bold text-emerald-300 uppercase tracking-wider">
                <Battery className="w-4 h-4 text-emerald-400 mr-1.5" />
                Menzil Şampiyonu
              </div>
              <p className="font-extrabold text-base text-white">
                {vehicles[rangeWinnerIdx].brand} {vehicles[rangeWinnerIdx].model}
              </p>
              <p className="text-xs text-emerald-200/80 leading-snug">
                <strong>{vehicles[rangeWinnerIdx].rangeKm} km</strong> WLTP menzili ile uzun yolculuklarda en az duraklama ihtiyacı sunuyor.
              </p>
            </div>
          )}

          {powerWinnerIdx !== -1 && (
            <div className="bg-emerald-900/50 border border-emerald-700/60 rounded-2xl p-4 space-y-1">
              <div className="flex items-center text-xs font-bold text-emerald-300 uppercase tracking-wider">
                <Zap className="w-4 h-4 text-amber-400 mr-1.5" />
                Performans Şampiyonu
              </div>
              <p className="font-extrabold text-base text-white">
                {vehicles[powerWinnerIdx].brand} {vehicles[powerWinnerIdx].model}
              </p>
              <p className="text-xs text-emerald-200/80 leading-snug">
                <strong>{vehicles[powerWinnerIdx].powerHp} HP</strong> gücü ve {vehicles[powerWinnerIdx].acceleration0100 ? `${vehicles[powerWinnerIdx].acceleration0100} sn` : 'yüksek'} 0-100 hızlanması ile en dinamik sürüşü sağlıyor.
              </p>
            </div>
          )}

          {chargingWinnerIdx !== -1 && (
            <div className="bg-emerald-900/50 border border-emerald-700/60 rounded-2xl p-4 space-y-1">
              <div className="flex items-center text-xs font-bold text-emerald-300 uppercase tracking-wider">
                <BatteryCharging className="w-4 h-4 text-emerald-400 mr-1.5" />
                Şarj Hızı Lideri
              </div>
              <p className="font-extrabold text-base text-white">
                {vehicles[chargingWinnerIdx].brand} {vehicles[chargingWinnerIdx].model}
              </p>
              <p className="text-xs text-emerald-200/80 leading-snug">
                <strong>{vehicles[chargingWinnerIdx].maxDcChargingKw} kW</strong> maksimum DC şarj desteği ile istasyonda en az bekleme süresi vadediyor.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Vehicle Headers */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden mb-8">
        <div className="bg-gradient-to-r from-emerald-700 to-emerald-900 p-6">
          <div className={`grid gap-6`} style={{ gridTemplateColumns: `repeat(${vehicles.length}, 1fr)` }}>
            {vehicles.map((v, idx) => (
              <div key={v.id} className="text-center text-white space-y-1">
                <p className="text-xs font-bold text-emerald-300 uppercase tracking-wider">{v.brand}</p>
                <h2 className="text-xl font-extrabold">{v.model}</h2>
                {v.variant && <p className="text-sm text-emerald-200">{v.variant}</p>}
                <p className="text-xs text-emerald-300">{v.year} · {v.segment}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats Row */}
        <div className="bg-emerald-50 border-b border-emerald-100 p-4">
          <div className={`grid gap-4`} style={{ gridTemplateColumns: `repeat(${vehicles.length}, 1fr)` }}>
            {vehicles.map((v) => (
              <div key={v.id} className="flex justify-center gap-4 text-xs">
                <span className="font-bold text-emerald-800">{v.rangeKm || '—'} km</span>
                <span className="text-gray-400">|</span>
                <span className="font-bold text-gray-700">{v.powerHp || '—'} HP</span>
                <span className="text-gray-400">|</span>
                <span className="font-bold text-violet-700">{v.acceleration0100 ? `${v.acceleration0100}s` : '—'}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Spec Sections */}
        {SPEC_SECTIONS.map((section) => (
          <div key={section.title}>
            <div className="bg-gray-50 px-6 py-3 border-b border-gray-100">
              <h3 className="text-sm font-extrabold text-gray-800">
                {section.icon} {section.title}
              </h3>
            </div>
            {section.specs.map((spec: any) => {
              const bestIdx = getBestIdx(spec.key, spec.best);
              return (
                <div key={spec.key} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <div className={`grid`} style={{ gridTemplateColumns: `180px repeat(${vehicles.length}, 1fr)` }}>
                    <div className="px-6 py-3 text-xs font-bold text-gray-500 flex items-center">
                      {spec.label}
                    </div>
                    {vehicles.map((v: any, idx: number) => {
                      const value = v[spec.key];
                      const isBest = bestIdx === idx && value != null;
                      let display = '—';
                      if (value != null) {
                        display = spec.format ? fmt(value) + spec.unit : value + spec.unit;
                      }
                      return (
                        <div
                          key={v.id}
                          className={`px-6 py-3 text-sm font-bold text-center ${
                            isBest ? 'text-emerald-700 bg-emerald-50/50' : 'text-gray-800'
                          }`}
                        >
                          {isBest && <Trophy className="h-3 w-3 text-emerald-500 inline mr-1" />}
                          {display}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Special Features Comparison */}
      {allFeatures.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="bg-violet-50 px-6 py-4 border-b border-violet-100">
            <h3 className="text-sm font-extrabold text-violet-900 flex items-center">
              <Sparkles className="h-4 w-4 text-violet-600 mr-2" />
              Öne Çıkan Özellikler Karşılaştırması
            </h3>
          </div>
          {allFeatures.map((feature) => (
            <div key={feature} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
              <div className={`grid`} style={{ gridTemplateColumns: `180px repeat(${vehicles.length}, 1fr)` }}>
                <div className="px-6 py-2.5 text-xs font-bold text-gray-600 flex items-center">
                  {feature}
                </div>
                {vehicleFeatures.map((features, idx) => (
                  <div key={idx} className="px-6 py-2.5 text-center">
                    {features.includes(feature) ? (
                      <span className="text-emerald-600 font-bold text-sm">✓</span>
                    ) : (
                      <span className="text-gray-300 text-sm">✗</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
