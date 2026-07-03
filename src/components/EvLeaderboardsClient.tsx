"use client";

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Car, Search, Battery, Zap, Gauge, 
  TrendingUp, ArrowLeft, Award, Sparkles, ZapOff
} from 'lucide-react';

interface Vehicle {
  id: string;
  brand: string;
  model: string;
  variant: string | null;
  imageUrl: string | null;
  rangeKm: number | null;
  acceleration0100: number | null;
  topSpeedKmh: number | null;
  batteryCapacityKwh: number | null;
  maxDcChargingKw: number | null;
  availableInTurkey: boolean;
}

interface EvLeaderboardsClientProps {
  vehicles: Vehicle[];
}

type TabType = 'range' | 'acceleration' | 'topspeed' | 'battery' | 'charging';

export default function EvLeaderboardsClient({ vehicles }: EvLeaderboardsClientProps) {
  const [activeTab, setActiveTab] = useState<TabType>('range');
  const [searchQuery, setSearchQuery] = useState('');
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const handleImageError = (id: string) => {
    setImageErrors(prev => ({ ...prev, [id]: true }));
  };

  // Find max values in database for scaling the bar graphs
  const limits = useMemo(() => {
    return {
      maxRange: vehicles.reduce((max, v) => Math.max(max, v.rangeKm || 0), 1),
      maxTopSpeed: vehicles.reduce((max, v) => Math.max(max, v.topSpeedKmh || 0), 1),
      maxBattery: vehicles.reduce((max, v) => Math.max(max, v.batteryCapacityKwh || 0), 1),
      maxDc: vehicles.reduce((max, v) => Math.max(max, v.maxDcChargingKw || 0), 1),
      // For acceleration, we want to scale where a lower value (e.g. 2.0s) gets a longer bar.
      // We will set the range from 12s (minimum bar) to 1.5s (maximum bar).
      minAcc: 1.5,
      maxAcc: 12.0
    };
  }, [vehicles]);

  // Sort and filter vehicles based on the active tab
  const sortedAndFilteredVehicles = useMemo(() => {
    let list = [...vehicles];

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(v => 
        `${v.brand} ${v.model} ${v.variant || ''}`.toLowerCase().includes(q)
      );
    }

    // Sort based on active tab
    switch (activeTab) {
      case 'range':
        list = list.filter(v => v.rangeKm !== null);
        list.sort((a, b) => (b.rangeKm || 0) - (a.rangeKm || 0));
        break;
      case 'acceleration':
        list = list.filter(v => v.acceleration0100 !== null);
        // Ascending sort: lower acceleration time is better!
        list.sort((a, b) => (a.acceleration0100 || 0) - (b.acceleration0100 || 0));
        break;
      case 'topspeed':
        list = list.filter(v => v.topSpeedKmh !== null);
        list.sort((a, b) => (b.topSpeedKmh || 0) - (a.topSpeedKmh || 0));
        break;
      case 'battery':
        list = list.filter(v => v.batteryCapacityKwh !== null);
        list.sort((a, b) => (b.batteryCapacityKwh || 0) - (a.batteryCapacityKwh || 0));
        break;
      case 'charging':
        list = list.filter(v => v.maxDcChargingKw !== null);
        list.sort((a, b) => (b.maxDcChargingKw || 0) - (a.maxDcChargingKw || 0));
        break;
    }

    return list;
  }, [vehicles, activeTab, searchQuery]);

  // Tab configurations
  const tabs = [
    { id: 'range', name: 'Menzil', icon: Gauge, color: 'text-emerald-600', bg: 'bg-emerald-500' },
    { id: 'acceleration', name: 'Hızlanma', icon: Sparkles, color: 'text-violet-600', bg: 'bg-violet-500' },
    { id: 'topspeed', name: 'Maks Hız', icon: TrendingUp, color: 'text-red-600', bg: 'bg-red-500' },
    { id: 'battery', name: 'Batarya', icon: Battery, color: 'text-blue-600', bg: 'bg-blue-500' },
    { id: 'charging', name: 'Hızlı Şarj', icon: Zap, color: 'text-amber-600', bg: 'bg-amber-500' },
  ] as const;

  // Render spec values helper
  const getSpecValue = (v: Vehicle) => {
    switch (activeTab) {
      case 'range':
        return `${v.rangeKm} km`;
      case 'acceleration':
        return `${v.acceleration0100} sn`;
      case 'topspeed':
        return `${v.topSpeedKmh} km/s`;
      case 'battery':
        return `${v.batteryCapacityKwh} kWh`;
      case 'charging':
        return `${v.maxDcChargingKw} kW`;
    }
  };

  // Calculate percentage length of progress bar
  const getBarPercentage = (v: Vehicle) => {
    switch (activeTab) {
      case 'range':
        return ((v.rangeKm || 0) / limits.maxRange) * 100;
      case 'acceleration': {
        const val = v.acceleration0100 || 10;
        // Invert so lower time is a longer bar
        const pct = ((limits.maxAcc - val) / (limits.maxAcc - limits.minAcc)) * 100;
        return Math.max(5, Math.min(100, pct));
      }
      case 'topspeed':
        return ((v.topSpeedKmh || 0) / limits.maxTopSpeed) * 100;
      case 'battery':
        return ((v.batteryCapacityKwh || 0) / limits.maxBattery) * 100;
      case 'charging':
        return ((v.maxDcChargingKw || 0) / limits.maxDc) * 100;
    }
  };

  // Get bar gradient classes based on tab
  const getBarGradient = () => {
    switch (activeTab) {
      case 'range':
        return 'bg-gradient-to-r from-emerald-500 to-teal-400';
      case 'acceleration':
        return 'bg-gradient-to-r from-violet-500 to-indigo-500';
      case 'topspeed':
        return 'bg-gradient-to-r from-red-500 to-orange-500';
      case 'battery':
        return 'bg-gradient-to-r from-blue-500 to-cyan-400';
      case 'charging':
        return 'bg-gradient-to-r from-amber-500 to-yellow-400';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 pb-24">
      {/* Back to Catalog Link */}
      <div className="mb-6">
        <Link
          href="/elektrikli-araclar"
          className="inline-flex items-center text-sm font-bold text-gray-500 hover:text-emerald-700 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-1.5" />
          Araç Kataloğuna Dön
        </Link>
      </div>

      {/* Hero Header */}
      <div className="text-center mb-10 space-y-3">
        <div className="inline-flex items-center bg-emerald-50 text-emerald-700 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
          <Award className="h-3.5 w-3.5 mr-1.5" />
          Liderlik Tabloları
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
          Elektrikli Araç <span className="text-emerald-700">Cheatsheets</span>
        </h1>
        <p className="text-gray-500 text-base max-w-2xl mx-auto">
          Menzil, hızlanma, batarya kapasitesi ve şarj hızı kriterlerine göre en performanslı elektrikli araçları sıralayın ve karşılaştırın.
        </p>
      </div>

      {/* Tab Navigation Menu */}
      <div className="flex overflow-x-auto pb-3 mb-6 scrollbar-none gap-2 border-b border-gray-100">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-5 py-3 rounded-xl font-bold text-sm transition-all shrink-0 cursor-pointer ${
                isActive 
                  ? `${tab.bg} text-white shadow-md shadow-${tab.id}/20 scale-[1.02]`
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              <Icon className="h-4.5 w-4.5" />
              <span>{tab.name}</span>
            </button>
          );
        })}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-gray-150 rounded-2xl p-5 mb-6 shadow-sm flex items-center">
        <div className="relative flex-grow">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Araç veya marka adı ile filtrele..."
            className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-800"
          />
        </div>
      </div>

      {/* Leaderboard Rankings List */}
      <div className="bg-white border border-gray-150 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-150 text-xs font-bold text-gray-500 uppercase tracking-wider">
                <th className="py-4 px-6 text-center w-16">Sıra</th>
                <th className="py-4 px-6">Araç Modeli</th>
                <th className="py-4 px-6 w-1/2 hidden md:table-cell">Karşılaştırma Çubuğu</th>
                <th className="py-4 px-6 text-right w-32">Değer</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {sortedAndFilteredVehicles.length > 0 ? (
                sortedAndFilteredVehicles.map((v, idx) => {
                  const hasErr = imageErrors[v.id] || !v.imageUrl;
                  const rank = idx + 1;
                  const valueStr = getSpecValue(v);
                  const percentage = getBarPercentage(v);

                  return (
                    <tr 
                      key={v.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      {/* Rank Column */}
                      <td className="py-4 px-6 text-center">
                        <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-black ${
                          rank === 1 ? 'bg-yellow-100 text-yellow-800' :
                          rank === 2 ? 'bg-gray-100 text-gray-800' :
                          rank === 3 ? 'bg-orange-100 text-orange-850' :
                          'text-gray-500'
                        }`}>
                          {rank}
                        </span>
                      </td>

                      {/* Vehicle Column */}
                      <td className="py-4 px-6">
                        <Link 
                          href={`/elektrikli-araclar/${v.id}`}
                          className="flex items-center space-x-3.5 group"
                        >
                          {/* Image */}
                          <div className="relative w-12 h-8 rounded-lg overflow-hidden bg-gray-50 border border-gray-150 shrink-0">
                            {hasErr ? (
                              <div className="w-full h-full flex items-center justify-center text-gray-400">
                                <Car className="h-5 w-5" />
                              </div>
                            ) : (
                              <img
                                src={v.imageUrl || ''}
                                alt={`${v.brand} ${v.model}`}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                onError={() => handleImageError(v.id)}
                              />
                            )}
                          </div>
                          
                          {/* Title & Brand */}
                          <div>
                            <p className="text-sm font-bold text-gray-900 group-hover:text-emerald-700 transition-colors">
                              {v.brand} {v.model}
                            </p>
                            <p className="text-xs font-semibold text-gray-400 mt-0.5">
                              {v.variant || 'Standart'}
                            </p>
                          </div>
                        </Link>
                      </td>

                      {/* Bar Column */}
                      <td className="py-4 px-6 hidden md:table-cell">
                        <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${getBarGradient()} transition-all duration-500`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </td>

                      {/* Value Column */}
                      <td className="py-4 px-6 text-right">
                        <span className="text-sm font-extrabold text-gray-900 font-mono">
                          {valueStr}
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={4} className="py-16 text-center">
                    <ZapOff className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 font-bold">Kriterlere uygun araç bulunamadı.</p>
                    <p className="text-gray-400 text-sm mt-1">Arama kelimenizi değiştirmeyi deneyebilirsiniz.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
