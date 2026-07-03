"use client";

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { CompareProvider, useCompare } from './CompareBar';
import { Car, Search, Battery, Zap, Gauge, TrendingUp, Filter, GitCompareArrows, ChevronDown, Sparkles } from 'lucide-react';

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
  acceleration0100: number | null;
  priceStartTl: number | null;
  priceStartEur: number | null;
  curbWeightKg: number | null;
  trunkLiters: number | null;
  driveType: string | null;
  availableInTurkey: boolean;
  specialFeatures: string | null;
  maxDcChargingKw: number | null;
  imageUrl: string | null;
}

interface EvCatalogClientProps {
  vehicles: Vehicle[];
  brands: string[];
  segments: string[];
  totalVehicles: number;
  totalBrands: number;
  maxRange: number;
}

export default function EvCatalogClient({
  vehicles,
  brands,
  segments,
  totalVehicles,
  totalBrands,
  maxRange,
}: EvCatalogClientProps) {
  return (
    <CompareProvider>
      <CatalogContent
        vehicles={vehicles}
        brands={brands}
        segments={segments}
        totalVehicles={totalVehicles}
        totalBrands={totalBrands}
        maxRange={maxRange}
      />
    </CompareProvider>
  );
}

function CatalogContent({
  vehicles,
  brands,
  segments,
  totalVehicles,
  totalBrands,
  maxRange,
}: EvCatalogClientProps) {
  const { toggle, isSelected, selected } = useCompare();
  const [query, setQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedSegment, setSelectedSegment] = useState('');
  const [onlyTurkey, setOnlyTurkey] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  // Advanced Filters State
  const [maxPrice, setMaxPrice] = useState(150000);
  const [minRange, setMinRange] = useState(0);
  const [minBattery, setMinBattery] = useState(0);
  const [maxAcc, setMaxAcc] = useState(15);
  const [minDc, setMinDc] = useState(0);
  const [maxWeight, setMaxWeight] = useState(3500);
  const [minCargo, setMinCargo] = useState(0);
  const [minYear, setMinYear] = useState(2010);
  const [driveType, setDriveType] = useState('');
  const [availability, setAvailability] = useState('all'); // 'all', 'active', 'discontinued'

  const handleImageError = (id: string) => {
    setImageErrors(prev => ({ ...prev, [id]: true }));
  };

  const resetFilters = () => {
    setQuery('');
    setSelectedBrand('');
    setSelectedSegment('');
    setOnlyTurkey(false);
    setMaxPrice(150000);
    setMinRange(0);
    setMinBattery(0);
    setMaxAcc(15);
    setMinDc(0);
    setMaxWeight(3500);
    setMinCargo(0);
    setMinYear(2010);
    setDriveType('');
    setAvailability('all');
  };

  const filtered = useMemo(() => {
    return vehicles.filter((v) => {
      const q = query.toLowerCase().trim();
      const matchesQuery = !q || `${v.brand} ${v.model} ${v.variant || ''}`.toLowerCase().includes(q);
      
      const matchesBrand = !selectedBrand || v.brand === selectedBrand;
      const matchesSegment = !selectedSegment || v.segment === selectedSegment;
      const matchesTurkey = !onlyTurkey || v.availableInTurkey;
      
      const matchesDrive = !driveType || (v.driveType && v.driveType.toUpperCase() === driveType.toUpperCase());
      
      const features: string[] = v.specialFeatures ? (() => { try { return JSON.parse(v.specialFeatures); } catch { return []; } })() : [];
      const isDiscontinued = features.includes('discontinued');
      const matchesAvailability = 
        availability === 'all' ? true :
        availability === 'active' ? !isDiscontinued :
        isDiscontinued;

      const price = v.priceStartEur || 0;
      const matchesPrice = !price || price <= maxPrice;

      const range = v.rangeKm || 0;
      const matchesRange = range >= minRange;

      const battery = v.batteryCapacityKwh || 0;
      const matchesBattery = battery >= minBattery;

      const acc = v.acceleration0100 || 20;
      const matchesAcc = acc <= maxAcc;

      const dc = v.maxDcChargingKw || 0;
      const matchesDc = dc >= minDc;

      const weight = v.curbWeightKg || 0;
      const matchesWeight = !weight || weight <= maxWeight;

      const cargo = v.trunkLiters || 0;
      const matchesCargo = cargo >= minCargo;

      const year = v.year || 2024;
      const matchesYear = year >= minYear;

      return matchesQuery && matchesBrand && matchesSegment && matchesTurkey && 
             matchesDrive && matchesAvailability && matchesPrice && matchesRange && 
             matchesBattery && matchesAcc && matchesDc && matchesWeight && 
             matchesCargo && matchesYear;
    });
  }, [
    vehicles, query, selectedBrand, selectedSegment, onlyTurkey,
    driveType, availability, maxPrice, minRange, minBattery,
    maxAcc, minDc, maxWeight, minCargo, minYear
  ]);

  const fmt = (n: number | null) => (n ? n.toLocaleString('tr-TR') : '—');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 pb-24">
      {/* Hero */}
      <div className="text-center mb-10 space-y-3">
        <div className="inline-flex items-center bg-emerald-50 text-emerald-700 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
          <Car className="h-3.5 w-3.5 mr-1.5" />
          EV Veritabanı
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
          Elektrikli Araç <span className="text-emerald-700">Kataloğu</span>
        </h1>
        <p className="text-gray-500 text-base max-w-2xl mx-auto">
          Piyasadaki tüm elektrikli araçların teknik özelliklerini keşfedin, filtreleyin ve karşılaştırın.
        </p>
        <div className="flex flex-wrap justify-center gap-3 mt-3">
          <Link
            href="/elektrikli-araclar/oneri"
            className="inline-flex items-center bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-all shadow-sm"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Sana Uygun Aracı Bul
          </Link>
          <Link
            href="/elektrikli-araclar/liderlik-tablolari"
            className="inline-flex items-center bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 font-bold px-6 py-2.5 rounded-xl text-sm transition-all shadow-sm"
          >
            <TrendingUp className="h-4 w-4 mr-2 text-emerald-600" />
            Liderlik Tabloları
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white border border-gray-150 rounded-2xl p-4 text-center shadow-sm">
          <p className="text-2xl font-extrabold text-gray-900">{totalVehicles}</p>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mt-1">Araç Modeli</p>
        </div>
        <div className="bg-white border border-gray-150 rounded-2xl p-4 text-center shadow-sm">
          <p className="text-2xl font-extrabold text-emerald-700">{totalBrands}</p>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mt-1">Marka</p>
        </div>
        <div className="bg-white border border-gray-150 rounded-2xl p-4 text-center shadow-sm">
          <p className="text-2xl font-extrabold text-violet-700">{maxRange} km</p>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mt-1">Maks Menzil</p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white border border-gray-150 rounded-2xl p-5 mb-6 shadow-sm space-y-4">
        <div className="flex gap-3">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Marka veya model ara... (ör. Tesla Model Y)"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-800"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`inline-flex items-center px-4 py-2.5 rounded-xl text-sm font-bold border transition-colors cursor-pointer shrink-0 ${
              showFilters ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Filter className="h-4 w-4 mr-1.5" />
            Gelişmiş Filtreler
            <ChevronDown className={`h-3.5 w-3.5 ml-1 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {showFilters && (
          <div className="pt-4 border-t border-gray-100 space-y-5">
            {/* Primary Dropdowns */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-800"
              >
                <option value="">Tüm Markalar (Make)</option>
                {brands.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
              <select
                value={selectedSegment}
                onChange={(e) => setSelectedSegment(e.target.value)}
                className="bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-800"
              >
                <option value="">Tüm Segmentler</option>
                {segments.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <select
                value={driveType}
                onChange={(e) => setDriveType(e.target.value)}
                className="bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-800"
              >
                <option value="">Tüm Çekerler (Drive)</option>
                <option value="FWD">FWD (Önden İtiş)</option>
                <option value="RWD">RWD (Arkadan İtiş)</option>
                <option value="AWD">AWD (Dört Çeker)</option>
              </select>
              <select
                value={availability}
                onChange={(e) => setAvailability(e.target.value)}
                className="bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-800"
              >
                <option value="all">Tüm Araç Durumları</option>
                <option value="active">Aktif / Satışta Olanlar</option>
                <option value="discontinued">Üretimden Kalkanlar</option>
              </select>
            </div>

            {/* Sliders Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
              {/* Slider 1: Fiyat */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold text-gray-500">
                  <span>Maksimum Fiyat</span>
                  <span className="text-emerald-700">{maxPrice >= 150000 ? 'Limitsiz' : `${maxPrice.toLocaleString('tr-TR')} €`}</span>
                </div>
                <input
                  type="range"
                  min="20000"
                  max="150000"
                  step="5000"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
              </div>

              {/* Slider 2: Menzil */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold text-gray-500">
                  <span>Minimum Menzil</span>
                  <span className="text-emerald-700">{minRange === 0 ? 'Tümü' : `${minRange} km+`}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="800"
                  step="50"
                  value={minRange}
                  onChange={(e) => setMinRange(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
              </div>

              {/* Slider 3: Batarya */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold text-gray-500">
                  <span>Min Batarya Kapasitesi</span>
                  <span className="text-emerald-700">{minBattery === 0 ? 'Tümü' : `${minBattery} kWh+`}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="140"
                  step="10"
                  value={minBattery}
                  onChange={(e) => setMinBattery(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
              </div>

              {/* Slider 4: Hızlanma */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold text-gray-500">
                  <span>Maks Hızlanma (0-100)</span>
                  <span className="text-emerald-700">{maxAcc === 15 ? 'Yavaş / Tümü' : `${maxAcc} sn`}</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="15"
                  step="0.5"
                  value={maxAcc}
                  onChange={(e) => setMaxAcc(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
              </div>

              {/* Slider 5: DC Şarj */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold text-gray-500">
                  <span>Minimum DC Şarj Hızı</span>
                  <span className="text-emerald-700">{minDc === 0 ? 'Tümü' : `${minDc} kW+`}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="350"
                  step="25"
                  value={minDc}
                  onChange={(e) => setMinDc(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
              </div>

              {/* Slider 6: Ağırlık */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold text-gray-500">
                  <span>Maksimum Ağırlık</span>
                  <span className="text-emerald-700">{maxWeight === 3500 ? 'Tümü' : `${maxWeight} kg`}</span>
                </div>
                <input
                  type="range"
                  min="1000"
                  max="3500"
                  step="100"
                  value={maxWeight}
                  onChange={(e) => setMaxWeight(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
              </div>

              {/* Slider 7: Bagaj Hacmi */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold text-gray-500">
                  <span>Minimum Bagaj Hacmi</span>
                  <span className="text-emerald-700">{minCargo === 0 ? 'Tümü' : `${minCargo} L+`}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="800"
                  step="50"
                  value={minCargo}
                  onChange={(e) => setMinCargo(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
              </div>

              {/* Slider 8: Lansman Yılı */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold text-gray-500">
                  <span>Minimum Model Yılı</span>
                  <span className="text-emerald-700">{minYear} sonrası</span>
                </div>
                <input
                  type="range"
                  min="2010"
                  max="2026"
                  step="1"
                  value={minYear}
                  onChange={(e) => setMinYear(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
              </div>

              {/* Toggles & Resets */}
              <div className="flex items-center justify-between gap-4 pt-2.5">
                <label className="flex items-center space-x-2 bg-gray-50 border border-gray-150 rounded-xl py-2 px-3.5 cursor-pointer flex-grow justify-center">
                  <input
                    type="checkbox"
                    checked={onlyTurkey}
                    onChange={(e) => setOnlyTurkey(e.target.checked)}
                    className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                  />
                  <span className="text-xs font-bold text-gray-700">Türkiye&apos;de Satışta</span>
                </label>

                <button
                  onClick={resetFilters}
                  className="text-xs font-extrabold text-gray-500 hover:text-emerald-700 underline cursor-pointer px-2 py-2"
                >
                  Filtreleri Sıfırla
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Results count */}
      <p className="text-sm text-gray-500 mb-4 font-medium">
        <span className="font-bold text-gray-800">{filtered.length}</span> araç listeleniyor.
        {selected.length > 0 && (
          <span className="ml-2 text-violet-600 font-bold">({selected.length}/3 seçili)</span>
        )}
      </p>

      {/* Vehicle Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((v) => {
            const isComp = isSelected(v.id);
            const features: string[] = v.specialFeatures ? (() => { try { return JSON.parse(v.specialFeatures); } catch { return []; } })() : [];

            return (
              <div
                key={v.id}
                className={`bg-white border rounded-2xl p-5 hover:shadow-md transition-all duration-200 space-y-3 ${
                  isComp ? 'border-emerald-300 ring-2 ring-emerald-100' : 'border-gray-100 hover:border-emerald-100'
                }`}
              >
                {/* Image */}
                <Link href={`/elektrikli-araclar/${v.id}`} className="block relative aspect-[16/10] bg-gray-50 rounded-xl overflow-hidden border border-gray-100 group">
                  {v.imageUrl && !imageErrors[v.id] ? (
                    <img
                      src={v.imageUrl}
                      alt={`${v.brand} ${v.model}`}
                      referrerPolicy="no-referrer"
                      onError={() => handleImageError(v.id)}
                      className="w-full h-full object-contain p-2 transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-emerald-50 via-teal-50 to-indigo-50 flex flex-col items-center justify-center p-4 text-center">
                      <div className="p-2 bg-white rounded-xl shadow-sm border border-emerald-100/50 text-emerald-700 mb-1">
                        <Car className="h-5 w-5" />
                      </div>
                      <p className="text-[10px] font-black text-gray-900 tracking-wide mt-1 truncate max-w-full">{v.brand} {v.model}</p>
                      <span className="text-[8px] text-gray-400 font-bold uppercase tracking-wider bg-white/80 px-2 py-0.5 rounded-full mt-1">Konsept</span>
                    </div>
                  )}
                </Link>

                <div className="flex items-start justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">{v.brand}</p>
                    <h3 className="font-extrabold text-gray-900 text-sm truncate">
                      <Link href={`/elektrikli-araclar/${v.id}`} className="hover:text-emerald-700 transition-colors">
                        {v.model}
                        {v.variant && <span className="text-gray-400 font-bold text-xs ml-1">({v.variant})</span>}
                      </Link>
                    </h3>
                  </div>
                  <span className="text-[10px] font-bold bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full shrink-0 ml-2">{v.year}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center space-x-1.5 text-gray-600">
                    <Battery className="h-3.5 w-3.5 text-emerald-600" />
                    <span className="font-bold">{v.rangeKm ? `${v.rangeKm} km` : '—'}</span>
                  </div>
                  <div className="flex items-center space-x-1.5 text-gray-600">
                    <Zap className="h-3.5 w-3.5 text-amber-500" />
                    <span className="font-bold">{v.powerHp ? `${v.powerHp} HP` : '—'}</span>
                  </div>
                  <div className="flex items-center space-x-1.5 text-gray-600">
                    <Gauge className="h-3.5 w-3.5 text-violet-500" />
                    <span className="font-bold">{v.acceleration0100 ? `${v.acceleration0100}s` : '—'}</span>
                  </div>
                  <div className="flex items-center space-x-1.5 text-gray-600">
                    <TrendingUp className="h-3.5 w-3.5 text-blue-500" />
                    <span className="font-bold">{v.maxDcChargingKw ? `${v.maxDcChargingKw} kW DC` : '—'}</span>
                  </div>
                </div>

                {features.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {features.slice(0, 3).map((f, i) => (
                      <span key={i} className="text-[10px] font-bold bg-violet-50 text-violet-700 px-2 py-0.5 rounded-full">
                        {f}
                      </span>
                    ))}
                    {features.length > 3 && (
                      <span className="text-[10px] font-bold bg-gray-50 text-gray-400 px-2 py-0.5 rounded-full">
                        +{features.length - 3}
                      </span>
                    )}
                  </div>
                )}

                <div className="flex items-center justify-between pt-2 border-t border-gray-50">
                  <span className="text-sm font-extrabold text-gray-900">
                    {v.priceStartTl ? `${fmt(v.priceStartTl)} ₺` : '—'}
                  </span>
                  <button
                    onClick={() => toggle({ id: v.id, brand: v.brand, model: v.model, variant: v.variant })}
                    disabled={!isComp && selected.length >= 3}
                    className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed ${
                      isComp
                        ? 'bg-emerald-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-emerald-50 hover:text-emerald-700'
                    }`}
                  >
                    <GitCompareArrows className="h-3 w-3 mr-1" />
                    {isComp ? 'Seçildi' : 'Karşılaştır'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-gray-50 border border-dashed border-gray-200 rounded-2xl p-12 text-center">
          <p className="text-gray-400 text-sm">Arama kriterlerinize uygun araç bulunamadı.</p>
        </div>
      )}
    </div>
  );
}
