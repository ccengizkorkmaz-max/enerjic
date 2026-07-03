"use client";

import { useState } from 'react';
import { Car, Sun, Calculator, Leaf, TrendingDown, Battery, Zap } from 'lucide-react';

export default function CalculatorsPage() {
  const [activeTab, setActiveTab] = useState<'ev' | 'solar'>('ev');

  // EV Calculator state
  const [dailyKm, setDailyKm] = useState(50);
  const [fuelPrice, setFuelPrice] = useState(45);
  const [fuelConsumption, setFuelConsumption] = useState(7); // L/100km
  const [electricityPrice, setElectricityPrice] = useState(5); // TL/kWh
  const [evConsumption, setEvConsumption] = useState(18); // kWh/100km

  // Solar Calculator state
  const [roofArea, setRoofArea] = useState(30); // m²
  const [monthlyBill, setMonthlyBill] = useState(2000); // TL
  const [panelCostPerKw, setPanelCostPerKw] = useState(25000); // TL/kW

  // EV Calculations
  const monthlyKm = dailyKm * 30;
  const yearlyKm = dailyKm * 365;
  const monthlyFuelCost = (monthlyKm / 100) * fuelConsumption * fuelPrice;
  const yearlyFuelCost = (yearlyKm / 100) * fuelConsumption * fuelPrice;
  const monthlyEvCost = (monthlyKm / 100) * evConsumption * electricityPrice;
  const yearlyEvCost = (yearlyKm / 100) * evConsumption * electricityPrice;
  const monthlySavings = monthlyFuelCost - monthlyEvCost;
  const yearlySavings = yearlyFuelCost - yearlyEvCost;
  const yearlyCo2Saved = (yearlyKm / 100) * fuelConsumption * 2.31; // kg CO2

  // Solar Calculations
  const panelCapacityPerM2 = 0.2; // kW per m²
  const totalCapacity = roofArea * panelCapacityPerM2; // kW
  const yearlyGeneration = totalCapacity * 1500; // kWh (avg Turkey solar yield)
  const monthlyGeneration = yearlyGeneration / 12;
  const installationCost = totalCapacity * panelCostPerKw;
  const yearlyElectricitySaved = monthlyBill * 12;
  const paybackYears = installationCost / yearlyElectricitySaved;
  const co2SavedSolar = yearlyGeneration * 0.5; // kg CO2

  const fmt = (n: number) => Math.round(n).toLocaleString('tr-TR');

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      {/* Hero */}
      <div className="text-center mb-10 space-y-3">
        <div className="inline-flex items-center bg-emerald-50 text-emerald-700 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
          <Calculator className="h-3.5 w-3.5 mr-1.5" />
          Etkileşimli Araçlar
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
          Tasarruf <span className="text-emerald-700">Hesaplayıcılar</span>
        </h1>
        <p className="text-gray-500 text-base max-w-2xl mx-auto">
          Elektrikli araca geçişinizde veya çatınıza güneş paneli kurmanızda ne kadar tasarruf edeceğinizi hemen hesaplayın.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex justify-center mb-8">
        <div className="inline-flex bg-gray-100 rounded-2xl p-1">
          <button
            onClick={() => setActiveTab('ev')}
            className={`flex items-center px-6 py-2.5 rounded-xl text-sm font-extrabold transition-all cursor-pointer ${
              activeTab === 'ev'
                ? 'bg-white text-emerald-700 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Car className="h-4 w-4 mr-2" />
            Elektrikli Araç
          </button>
          <button
            onClick={() => setActiveTab('solar')}
            className={`flex items-center px-6 py-2.5 rounded-xl text-sm font-extrabold transition-all cursor-pointer ${
              activeTab === 'solar'
                ? 'bg-white text-emerald-700 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Sun className="h-4 w-4 mr-2" />
            Güneş Paneli
          </button>
        </div>
      </div>

      {/* EV Calculator */}
      {activeTab === 'ev' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white border border-gray-150 rounded-2xl p-6 space-y-5 shadow-sm">
            <h2 className="text-lg font-extrabold text-gray-900 flex items-center">
              <Car className="h-5 w-5 text-emerald-600 mr-2" />
              Parametreleriniz
            </h2>

            <div className="space-y-4">
              <div>
                <label className="flex justify-between text-sm font-bold text-gray-700 mb-1">
                  <span>Günlük Mesafe</span>
                  <span className="text-emerald-700">{dailyKm} km</span>
                </label>
                <input type="range" min={10} max={300} value={dailyKm} onChange={(e) => setDailyKm(+e.target.value)}
                  className="w-full accent-emerald-600" />
              </div>
              <div>
                <label className="flex justify-between text-sm font-bold text-gray-700 mb-1">
                  <span>Benzin/Dizel Fiyatı</span>
                  <span className="text-emerald-700">{fuelPrice} ₺/L</span>
                </label>
                <input type="range" min={20} max={80} value={fuelPrice} onChange={(e) => setFuelPrice(+e.target.value)}
                  className="w-full accent-emerald-600" />
              </div>
              <div>
                <label className="flex justify-between text-sm font-bold text-gray-700 mb-1">
                  <span>Yakıt Tüketimi</span>
                  <span className="text-emerald-700">{fuelConsumption} L/100km</span>
                </label>
                <input type="range" min={3} max={15} step={0.5} value={fuelConsumption} onChange={(e) => setFuelConsumption(+e.target.value)}
                  className="w-full accent-emerald-600" />
              </div>
              <div>
                <label className="flex justify-between text-sm font-bold text-gray-700 mb-1">
                  <span>Elektrik Fiyatı</span>
                  <span className="text-emerald-700">{electricityPrice} ₺/kWh</span>
                </label>
                <input type="range" min={1} max={15} step={0.5} value={electricityPrice} onChange={(e) => setElectricityPrice(+e.target.value)}
                  className="w-full accent-emerald-600" />
              </div>
              <div>
                <label className="flex justify-between text-sm font-bold text-gray-700 mb-1">
                  <span>EV Tüketimi</span>
                  <span className="text-emerald-700">{evConsumption} kWh/100km</span>
                </label>
                <input type="range" min={10} max={30} value={evConsumption} onChange={(e) => setEvConsumption(+e.target.value)}
                  className="w-full accent-emerald-600" />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-2xl p-6 text-white space-y-1">
              <p className="text-sm font-bold text-emerald-200 uppercase tracking-wider">Aylık Tasarruf</p>
              <p className="text-4xl font-extrabold">{fmt(monthlySavings)} ₺</p>
            </div>
            <div className="bg-white border border-gray-150 rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500 font-medium">Yıllık Tasarruf</span>
                <span className="text-lg font-extrabold text-emerald-700">{fmt(yearlySavings)} ₺</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500 font-medium">Aylık Benzin Maliyeti</span>
                <span className="text-sm font-bold text-red-500">{fmt(monthlyFuelCost)} ₺</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500 font-medium">Aylık Elektrik Maliyeti</span>
                <span className="text-sm font-bold text-emerald-600">{fmt(monthlyEvCost)} ₺</span>
              </div>
              <hr className="border-gray-100" />
              <div className="flex items-center space-x-2 text-sm">
                <Leaf className="h-4 w-4 text-emerald-600" />
                <span className="text-gray-600">Yıllık <span className="font-bold text-emerald-700">{fmt(yearlyCo2Saved)} kg</span> CO₂ emisyonu azaltılır.</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Solar Calculator */}
      {activeTab === 'solar' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white border border-gray-150 rounded-2xl p-6 space-y-5 shadow-sm">
            <h2 className="text-lg font-extrabold text-gray-900 flex items-center">
              <Sun className="h-5 w-5 text-amber-500 mr-2" />
              Parametreleriniz
            </h2>

            <div className="space-y-4">
              <div>
                <label className="flex justify-between text-sm font-bold text-gray-700 mb-1">
                  <span>Çatı Alanı</span>
                  <span className="text-emerald-700">{roofArea} m²</span>
                </label>
                <input type="range" min={10} max={200} value={roofArea} onChange={(e) => setRoofArea(+e.target.value)}
                  className="w-full accent-amber-500" />
              </div>
              <div>
                <label className="flex justify-between text-sm font-bold text-gray-700 mb-1">
                  <span>Aylık Elektrik Faturası</span>
                  <span className="text-emerald-700">{fmt(monthlyBill)} ₺</span>
                </label>
                <input type="range" min={200} max={10000} step={100} value={monthlyBill} onChange={(e) => setMonthlyBill(+e.target.value)}
                  className="w-full accent-amber-500" />
              </div>
              <div>
                <label className="flex justify-between text-sm font-bold text-gray-700 mb-1">
                  <span>Panel Maliyeti</span>
                  <span className="text-emerald-700">{fmt(panelCostPerKw)} ₺/kW</span>
                </label>
                <input type="range" min={10000} max={50000} step={1000} value={panelCostPerKw} onChange={(e) => setPanelCostPerKw(+e.target.value)}
                  className="w-full accent-amber-500" />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-6 text-white space-y-1">
              <p className="text-sm font-bold text-amber-100 uppercase tracking-wider">Amortisman Süresi</p>
              <p className="text-4xl font-extrabold">{paybackYears.toFixed(1)} Yıl</p>
            </div>
            <div className="bg-white border border-gray-150 rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500 font-medium">Sistem Kapasitesi</span>
                <span className="text-lg font-extrabold text-amber-600">{totalCapacity.toFixed(1)} kW</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500 font-medium">Kurulum Maliyeti</span>
                <span className="text-sm font-bold text-gray-800">{fmt(installationCost)} ₺</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500 font-medium">Yıllık Üretim</span>
                <span className="text-sm font-bold text-emerald-600">{fmt(yearlyGeneration)} kWh</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500 font-medium">Yıllık Fatura Tasarrufu</span>
                <span className="text-sm font-bold text-emerald-700">{fmt(yearlyElectricitySaved)} ₺</span>
              </div>
              <hr className="border-gray-100" />
              <div className="flex items-center space-x-2 text-sm">
                <Leaf className="h-4 w-4 text-emerald-600" />
                <span className="text-gray-600">Yıllık <span className="font-bold text-emerald-700">{fmt(co2SavedSolar)} kg</span> CO₂ emisyonu önlenir.</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
