"use client";

import { useState } from 'react';
import { Search, MapPin, Zap, Info, ShieldAlert, Award } from 'lucide-react';

interface Station {
  id: string;
  name: string;
  provider: string;
  city: string;
  district: string;
  address: string;
  chargerType: string;
  powerKw: number;
}

interface Props {
  stations: Station[];
  cityName: string;
  districtName: string;
}

export default function DistrictStationsClient({ stations, cityName, districtName }: Props) {
  const [searchQuery, setSearchQuery] = useState('');

  const cleanSearch = (text: string) => {
    return text
      .toLowerCase()
      .replaceAll('ı', 'i')
      .replaceAll('ö', 'o')
      .replaceAll('ü', 'u')
      .replaceAll('ş', 's')
      .replaceAll('ğ', 'g')
      .replaceAll('ç', 'c');
  };

  const filteredStations = stations.filter(s =>
    cleanSearch(s.name).includes(cleanSearch(searchQuery)) ||
    cleanSearch(s.provider).includes(cleanSearch(searchQuery)) ||
    cleanSearch(s.address).includes(cleanSearch(searchQuery))
  );

  return (
    <div className="space-y-6">
      {/* Search Input Bar */}
      <div className="relative max-w-md">
        <input
          type="text"
          placeholder="İstasyon adı, sağlayıcı veya adres ara..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-gray-50 border border-gray-200 text-sm rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all text-gray-800 font-medium"
        />
        <Search className="absolute left-4 top-[14px] h-4.5 w-4.5 text-gray-400" />
      </div>

      {filteredStations.length === 0 ? (
        <div className="text-center py-12 bg-gray-50/50 rounded-2xl border border-gray-100 space-y-2">
          <ShieldAlert className="h-8 w-8 text-gray-300 mx-auto" />
          <p className="text-gray-500 font-bold text-sm">Aramanızla eşleşen şarj noktası bulunamadı.</p>
          <p className="text-xs text-gray-400">Farklı anahtar kelimeler kullanarak tekrar arama yapabilirsiniz.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredStations.map((station) => {
            const isFastDC = station.chargerType.toLowerCase().includes('dc') || station.powerKw >= 50;
            return (
              <div 
                key={station.id}
                className="bg-white border border-gray-100 rounded-2xl p-5 hover:border-emerald-200 hover:shadow-sm transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  {/* Header Title & Tags */}
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="font-extrabold text-gray-900 leading-tight text-base">
                      {station.name}
                    </h3>
                    <span className={`shrink-0 text-[10px] font-black uppercase px-2.5 py-1 rounded-md border ${
                      isFastDC 
                        ? 'bg-amber-50 text-amber-700 border-amber-100'
                        : 'bg-emerald-50 text-emerald-700 border-emerald-100'
                    }`}>
                      {isFastDC ? '🔥 Hızlı DC' : '⚡ AC Şarj'}
                    </span>
                  </div>

                  {/* Charger Specs */}
                  <div className="flex items-center space-x-4 text-xs font-bold text-gray-500">
                    <span className="flex items-center">
                      <Zap className="h-4.5 w-4.5 text-amber-500 mr-1" />
                      {station.powerKw} kW
                    </span>
                    <span className="w-1.5 h-1.5 bg-gray-300 rounded-full" />
                    <span>{station.provider} Altyapısı</span>
                  </div>

                  {/* Address */}
                  <p className="text-xs text-gray-500 leading-relaxed font-medium">
                    {station.address}
                  </p>
                </div>

                {/* Footer Location Pin Info */}
                <div className="pt-4 mt-4 border-t border-gray-50 flex items-center justify-between text-[11px] font-bold text-gray-400">
                  <span className="flex items-center">
                    <MapPin className="h-3.5 w-3.5 mr-1 text-gray-400" />
                    {station.district}, {station.city}
                  </span>
                  
                  {/* Directions placeholder or provider tag */}
                  <span className="text-emerald-700 font-extrabold flex items-center">
                    {station.chargerType} Soket
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
