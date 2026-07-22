"use client";

import { useState, useMemo } from 'react';
import { Zap, Clock, BatteryCharging, ShieldAlert, Sparkles, DollarSign, ArrowRight, HelpCircle } from 'lucide-react';

interface EVPreset {
  name: string;
  batteryKwh: number;
  maxAcKw: number;
  maxDcKw: number;
}

const POPULAR_EVS: EVPreset[] = [
  { name: 'Togg T10X (Uzun Menzil)', batteryKwh: 88.5, maxAcKw: 11, maxDcKw: 180 },
  { name: 'Togg T10X (Standart Menzil)', batteryKwh: 52.4, maxAcKw: 11, maxDcKw: 180 },
  { name: 'Tesla Model Y Long Range', batteryKwh: 75.0, maxAcKw: 11, maxDcKw: 250 },
  { name: 'Tesla Model Y Rear-Wheel Drive', batteryKwh: 60.0, maxAcKw: 11, maxDcKw: 170 },
  { name: 'BYD Atto 3', batteryKwh: 60.4, maxAcKw: 11, maxDcKw: 88 },
  { name: 'BYD Seal', batteryKwh: 82.5, maxAcKw: 11, maxDcKw: 150 },
  { name: 'Hyundai Ioniq 5', batteryKwh: 77.4, maxAcKw: 11, maxDcKw: 240 },
  { name: 'Kia EV6', batteryKwh: 77.4, maxAcKw: 11, maxDcKw: 240 },
  { name: 'BMW i4 eDrive40', batteryKwh: 80.7, maxAcKw: 11, maxDcKw: 205 },
  { name: 'Renault Megane E-Tech', batteryKwh: 60.0, maxAcKw: 22, maxDcKw: 130 },
  { name: 'MG4 Electric', batteryKwh: 64.0, maxAcKw: 11, maxDcKw: 135 },
  { name: 'Özel / Diğer Araç', batteryKwh: 65.0, maxAcKw: 11, maxDcKw: 150 },
];

const CHARGER_TYPES = [
  { id: 'ac_home', name: 'Ev Prizi (Ev AC)', kw: 2.3, type: 'AC', desc: 'Standart 220V ev prizi' },
  { id: 'ac_wallbox_7', name: 'Ev Wallbox AC', kw: 7.4, type: 'AC', desc: 'Monofaze ev tipi şarj cihazı' },
  { id: 'ac_wallbox_11', name: 'Trifaze Wallbox AC', kw: 11, type: 'AC', desc: 'Sitede / İşyerinde 11 kW AC' },
  { id: 'ac_wallbox_22', name: 'Sanayi Wallbox AC', kw: 22, type: 'AC', desc: 'Halka açık 22 kW AC istasyon' },
  { id: 'dc_fast_50', name: 'Hızlı Şarj DC (50 kW)', kw: 50, type: 'DC', desc: 'Şehir içi DC istasyonlar' },
  { id: 'dc_hpc_180', name: 'Yüksek Hızlı DC (180 kW)', kw: 180, type: 'DC', desc: 'Trugo / ZES / Eşarj Otoban DC' },
  { id: 'dc_hpc_300', name: 'Ultra Hızlı DC (300 kW+)', kw: 300, type: 'DC', desc: 'Supercharger / Ultra DC' },
];

export default function ChargingCalculator() {
  const [selectedEvIndex, setSelectedEvIndex] = useState(0);
  const [customBatteryKwh, setCustomBatteryKwh] = useState(65);
  const [startPercent, setStartPercent] = useState(20);
  const [targetPercent, setTargetPercent] = useState(80);
  const [selectedChargerId, setSelectedChargerId] = useState('dc_hpc_180');

  // Custom Electricity Rates (TL / kWh)
  const [homeTariff, setHomeTariff] = useState(2.6); // TL per kWh for home
  const [stationTariff, setStationTariff] = useState(9.8); // TL per kWh for public DC

  const ev = POPULAR_EVS[selectedEvIndex];
  const isCustomEv = ev.name.includes('Özel');
  const batteryCapacity = isCustomEv ? customBatteryKwh : ev.batteryKwh;

  const charger = useMemo(() => {
    return CHARGER_TYPES.find((c) => c.id === selectedChargerId) || CHARGER_TYPES[5];
  }, [selectedChargerId]);

  // Effective charging speed considering vehicle limitations
  const effectiveKw = useMemo(() => {
    if (charger.type === 'AC') {
      return Math.min(charger.kw, ev.maxAcKw);
    } else {
      return Math.min(charger.kw, ev.maxDcKw);
    }
  }, [charger, ev]);

  // Energy needed in kWh
  const percentDiff = Math.max(0, targetPercent - startPercent);
  const neededKwh = (batteryCapacity * percentDiff) / 100;

  // Charging time calculation with realistic charging curve loss (90% average efficiency factor)
  const durationHours = effectiveKw > 0 ? (neededKwh / (effectiveKw * 0.9)) : 0;
  const hours = Math.floor(durationHours);
  const minutes = Math.round((durationHours - hours) * 60);

  // Cost calculation
  const homeCost = neededKwh * homeTariff;
  const stationCost = neededKwh * stationTariff;
  const savings = stationCost - homeCost;

  return (
    <div className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-sm space-y-8">
      {/* Header Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-6">
        <div>
          <div className="flex items-center space-x-2 text-emerald-700 font-bold text-xs uppercase tracking-wider mb-1">
            <Zap className="w-4 h-4 text-emerald-600 fill-emerald-600 animate-pulse" />
            <span>İnteraktif Hesaplama Aracı</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Şarj Süresi ve Maliyet Hesaplayıcı
          </h2>
        </div>
        <div className="bg-emerald-50 text-emerald-900 border border-emerald-100 text-xs font-semibold px-3 py-1.5 rounded-full self-start sm:self-auto">
          2026 Güncel Tarifelerle Uyumlu
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Controls Section */}
        <div className="lg:col-span-7 space-y-6">
          {/* 1. EV Selector */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide">
              1. Araç Modelini Seçin
            </label>
            <select
              value={selectedEvIndex}
              onChange={(e) => setSelectedEvIndex(Number(e.target.value))}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50/50 cursor-pointer"
            >
              {POPULAR_EVS.map((item, idx) => (
                <option key={idx} value={idx}>
                  {item.name} ({item.batteryKwh} kWh)
                </option>
              ))}
            </select>
          </div>

          {/* Custom Capacity slider if custom EV selected */}
          {isCustomEv && (
            <div className="bg-emerald-50/50 border border-emerald-100 p-4 rounded-xl space-y-2">
              <div className="flex justify-between text-xs font-bold text-emerald-900">
                <span>Batarya Kapasitesi (kWh)</span>
                <span className="font-mono text-emerald-700">{customBatteryKwh} kWh</span>
              </div>
              <input
                type="range"
                min="20"
                max="150"
                step="1"
                value={customBatteryKwh}
                onChange={(e) => setCustomBatteryKwh(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
            </div>
          )}

          {/* 2. Battery Percentage Range Sliders */}
          <div className="space-y-4 bg-gray-50/70 border border-gray-100 p-5 rounded-2xl">
            <div className="flex justify-between items-center text-xs font-bold text-gray-700 uppercase tracking-wide">
              <span>2. Şarj Yüzdesi Aralığı (%{startPercent} ➔ %{targetPercent})</span>
              <span className="text-emerald-700 font-mono text-sm font-extrabold bg-emerald-100/70 px-2.5 py-0.5 rounded-lg">
                +{percentDiff}% ({neededKwh.toFixed(1)} kWh)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-gray-500 font-semibold">
                  <span>Başlangıç Yüzdesi</span>
                  <span className="font-mono font-bold text-gray-800">%{startPercent}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={targetPercent - 5}
                  step="5"
                  value={startPercent}
                  onChange={(e) => setStartPercent(Number(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs text-gray-500 font-semibold">
                  <span>Hedef Şarj Yüzdesi</span>
                  <span className="font-mono font-bold text-gray-800">%{targetPercent}</span>
                </div>
                <input
                  type="range"
                  min={startPercent + 5}
                  max="100"
                  step="5"
                  value={targetPercent}
                  onChange={(e) => setTargetPercent(Number(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* 3. Charger Type Selector */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide">
              3. Şarj İstasyonu / Cihaz Tipi
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {CHARGER_TYPES.map((c) => {
                const isSelected = selectedChargerId === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setSelectedChargerId(c.id)}
                    className={`p-3.5 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-500/20 shadow-sm'
                        : 'border-gray-200 bg-white hover:border-emerald-200 hover:bg-gray-50/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-xs text-gray-900">{c.name}</span>
                      <span
                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                          c.type === 'DC'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {c.kw} kW
                      </span>
                    </div>
                    <span className="text-[11px] text-gray-400 mt-1 block line-clamp-1">{c.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Tariff Customizer Accordion */}
          <div className="border border-gray-150 rounded-2xl p-4 bg-gray-50/40 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-gray-700">
              <span className="flex items-center">
                <DollarSign className="w-3.5 h-3.5 text-emerald-600 mr-1" />
                Birım Fiyat Tarifeleri (₺ / kWh)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-gray-500 mb-1">Ev Elektrik Birim Fiyatı (TL/kWh)</label>
                <input
                  type="number"
                  step="0.1"
                  min="0.5"
                  max="20"
                  value={homeTariff}
                  onChange={(e) => setHomeTariff(Number(e.target.value))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-gray-800 font-mono font-bold bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-500 mb-1">İstasyon Hızlı Şarj Birim Fiyatı (TL/kWh)</label>
                <input
                  type="number"
                  step="0.1"
                  min="1"
                  max="30"
                  value={stationTariff}
                  onChange={(e) => setStationTariff(Number(e.target.value))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-gray-800 font-mono font-bold bg-white"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Results Panel Section */}
        <div className="lg:col-span-5 flex flex-col space-y-6">
          {/* Main Card */}
          <div className="bg-gradient-to-br from-emerald-900 via-emerald-950 to-gray-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-6 flex-1 flex flex-col justify-between border border-emerald-800">
            <div>
              <div className="flex items-center justify-between border-b border-emerald-800/80 pb-4 mb-6">
                <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold flex items-center">
                  <BatteryCharging className="w-4 h-4 mr-1.5 text-emerald-400" />
                  Hesaplama Sonuçları
                </span>
                <span className="bg-emerald-800/50 text-emerald-300 text-[10px] font-bold px-2.5 py-1 rounded-full border border-emerald-700">
                  {effectiveKw} kW Aktif Güç
                </span>
              </div>

              {/* Charging Time Display */}
              <div className="space-y-1 mb-8">
                <span className="text-xs font-semibold text-emerald-200/80 block">Tahmini Şarj Süresi</span>
                <div className="flex items-baseline space-x-2">
                  <span className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight font-mono">
                    {hours > 0 ? `${hours}s ` : ''}{minutes} dk
                  </span>
                </div>
                <p className="text-[11px] text-emerald-300/60 mt-1">
                  Araç maksimum {charger.type === 'AC' ? ev.maxAcKw : ev.maxDcKw} kW desteklemektedir.
                </p>
              </div>

              {/* Cost Summary Grid */}
              <div className="grid grid-cols-2 gap-4 border-t border-emerald-800/80 pt-6">
                <div className="space-y-1">
                  <span className="text-xs text-emerald-200/70 block">Doldurulan Güç</span>
                  <span className="text-xl font-bold font-mono text-white">{neededKwh.toFixed(1)} kWh</span>
                </div>

                <div className="space-y-1">
                  <span className="text-xs text-emerald-200/70 block">Şarj Verimliliği</span>
                  <span className="text-xl font-bold font-mono text-emerald-400">%90 (Kayıpsız)</span>
                </div>

                <div className="space-y-1 pt-2">
                  <span className="text-xs text-emerald-200/70 block">Evde Şarj Maliyeti</span>
                  <span className="text-2xl font-extrabold font-mono text-emerald-300">
                    {homeCost.toFixed(1)} ₺
                  </span>
                </div>

                <div className="space-y-1 pt-2">
                  <span className="text-xs text-emerald-200/70 block">İstasyonda Şarj Maliyeti</span>
                  <span className="text-2xl font-extrabold font-mono text-amber-300">
                    {stationCost.toFixed(1)} ₺
                  </span>
                </div>
              </div>
            </div>

            {/* Savings Callout */}
            <div className="bg-emerald-900/60 border border-emerald-700/60 rounded-2xl p-4 mt-6 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-200 flex items-center">
                  <Sparkles className="w-4 h-4 text-emerald-400 mr-1.5" />
                  Ev Şarj Avantajı
                </span>
                <span className="text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded">
                  {savings > 0 ? `${savings.toFixed(1)} ₺ Tasarruf` : 'Fark yok'}
                </span>
              </div>
              <p className="text-[11px] text-emerald-100/70 leading-normal">
                Bu şarjı istasyon yerine evde gerçekleştirirseniz yaklaşık <strong>{savings.toFixed(0)} ₺</strong> tasarruf edersiniz.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
