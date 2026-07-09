"use client";

import { useState } from 'react';
import Link from 'next/link';
import { MapPin, Search, Zap, Compass, Shield, ArrowRight } from 'lucide-react';
import { slugify } from '@/lib/slugify';

interface CityData {
  city: string;
  count: number;
}

interface Props {
  cities: CityData[];
  totalStations: number;
  providerCount: number;
}

export default function ChargingStationsClient({ cities, totalStations, providerCount }: Props) {
  const [searchQuery, setSearchQuery] = useState('');

  // Normalize Turkish search
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

  const filteredCities = cities.filter(item => 
    cleanSearch(item.city).includes(cleanSearch(searchQuery))
  );

  // Group cities alphabetically
  const alphabetGroups: { [key: string]: CityData[] } = {};
  filteredCities.forEach(item => {
    const firstChar = item.city.charAt(0).toUpperCase();
    // Standardize grouping character
    const groupChar = ['Ç', 'Ğ', 'İ', 'Ö', 'Ş', 'Ü'].includes(firstChar) ? firstChar : firstChar.normalize("NFD").charAt(0);
    if (!alphabetGroups[groupChar]) {
      alphabetGroups[groupChar] = [];
    }
    alphabetGroups[groupChar].push(item);
  });

  const sortedAlphabet = Object.keys(alphabetGroups).sort((a, b) => a.localeCompare(b, 'tr'));

  // Main featured cities (top 4 counts)
  const featuredCities = cities.slice(0, 4);

  return (
    <div className="space-y-12">
      {/* Search & Hero Header */}
      <div className="bg-gradient-to-br from-emerald-950 via-slate-900 to-slate-950 rounded-3xl p-6 sm:p-12 text-white relative overflow-hidden border border-emerald-900/40 shadow-xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.08),transparent_50%)]" />
        
        <div className="relative z-10 max-w-3xl space-y-6">
          <span className="bg-emerald-500/10 text-emerald-400 text-xs font-extrabold px-3 py-1.5 rounded-full border border-emerald-500/20 uppercase tracking-widest">
            Türkiye Şarj Ağı Haritası
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Elektrikli Araç <br className="hidden sm:block" />
            <span className="text-emerald-400">Şarj İstasyonları</span> Rehberi
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Türkiye genelindeki 81 ilde aktif olarak hizmet veren <strong>{totalStations.toLocaleString('tr-TR')}</strong> şarj noktasını, sağlayıcı bazlı güç çıkışlarını (AC/DC kW) ve detaylı konum bilgilerini ilçe ilçe keşfedin.
          </p>

          {/* Quick Stats Banner */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-800">
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-emerald-400">{totalStations.toLocaleString('tr-TR')}</p>
              <p className="text-xs text-slate-400 font-semibold mt-1">Toplam İstasyon</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-blue-400">{providerCount}</p>
              <p className="text-xs text-slate-400 font-semibold mt-1">Aktif Şarj Sağlayıcı</p>
            </div>
            <div className="hidden sm:block">
              <p className="text-2xl sm:text-3xl font-extrabold text-emerald-500">81 İl</p>
              <p className="text-xs text-slate-400 font-semibold mt-1">Kapsama Alanı</p>
            </div>
          </div>

          {/* Search bar inside hero */}
          <div className="pt-6 relative max-w-lg">
            <input
              type="text"
              placeholder="Şehir adı ile ara... (Örn: İstanbul, Ankara)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900/90 border border-slate-700 text-white rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all placeholder-slate-500 font-medium"
            />
            <Search className="absolute left-4 top-[38px] h-5 w-5 text-slate-500" />
          </div>
        </div>
      </div>

      {/* Featured Cities Section */}
      {!searchQuery && (
        <div className="space-y-6">
          <div className="flex items-center space-x-2">
            <Compass className="h-5 w-5 text-emerald-700" />
            <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
              En Çok İstasyon Barındıran Şehirler
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredCities.map((item, index) => {
              const bgGradients = [
                'from-emerald-50 to-teal-50/20 border-emerald-100 hover:border-emerald-300',
                'from-blue-50 to-indigo-50/20 border-blue-100 hover:border-blue-300',
                'from-amber-50 to-orange-50/20 border-amber-100 hover:border-amber-300',
                'from-rose-50 to-pink-50/20 border-rose-100 hover:border-rose-300'
              ];
              const textColors = [
                'text-emerald-700',
                'text-blue-700',
                'text-amber-700',
                'text-rose-700'
              ];
              return (
                <Link
                  key={item.city}
                  href={`/sarj-istasyonlari/${slugify(item.city)}`}
                  className={`group block p-6 rounded-2xl border bg-gradient-to-br ${bgGradients[index % 4]} hover:shadow-md transition-all duration-300`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className={`font-black text-lg text-gray-900 group-hover:${textColors[index % 4]} transition-colors`}>
                        {item.city}
                      </p>
                      <p className="text-xs text-gray-500 font-bold mt-1">
                        {item.count.toLocaleString('tr-TR')} Aktif İstasyon
                      </p>
                    </div>
                    <span className={`p-2.5 rounded-xl bg-white shadow-sm border border-gray-100 ${textColors[index % 4]} group-hover:scale-110 transition-transform duration-300`}>
                      <MapPin className="h-5 w-5" />
                    </span>
                  </div>
                  <div className="mt-6 flex items-center text-xs font-extrabold text-gray-700 group-hover:text-emerald-700 transition-colors">
                    <span>Detayları İncele</span>
                    <ArrowRight className="ml-1.5 h-3.5 w-3.5 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Directory Grid */}
      <div className="space-y-6">
        <div className="flex items-center space-x-2 border-b border-gray-100 pb-4">
          <Zap className="h-5 w-5 text-emerald-700 animate-pulse" />
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
            Şehirler Alfabetik Dizini
          </h2>
          {searchQuery && (
            <span className="text-sm font-bold text-gray-400">
              ({filteredCities.length} sonuç bulundu)
            </span>
          )}
        </div>

        {filteredCities.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-2xl border border-gray-100 space-y-2">
            <Shield className="h-8 w-8 text-gray-300 mx-auto" />
            <p className="text-gray-500 font-bold text-sm">Aradığınız şehirde şarj istasyonu bulunamadı.</p>
            <p className="text-xs text-gray-400">Lütfen kelimeyi kontrol edin veya farklı bir il aramayı deneyin.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedAlphabet.map(letter => (
              <div key={letter} className="space-y-4">
                <div className="text-lg font-black text-emerald-700 bg-emerald-50/50 px-3 py-1 rounded-lg inline-block">
                  {letter}
                </div>
                <div className="space-y-2 divide-y divide-gray-50">
                  {alphabetGroups[letter].map(item => (
                    <Link
                      key={item.city}
                      href={`/sarj-istasyonlari/${slugify(item.city)}`}
                      className="flex items-center justify-between py-2 group text-sm"
                    >
                      <span className="font-bold text-gray-700 group-hover:text-emerald-700 transition-colors">
                        {item.city}
                      </span>
                      <span className="bg-gray-100 text-gray-500 text-xs font-extrabold px-2 py-0.5 rounded-full group-hover:bg-emerald-50 group-hover:text-emerald-700 transition-colors">
                        {item.count} İstasyon
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
