'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getNearbyStations, getStationStats } from '@/app/actions/stations';
import { MapPin, Zap, Navigation, Battery, ChevronRight, Locate } from 'lucide-react';

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

interface StationStats {
  totalStations: number;
  totalCities: number;
  totalProviders: number;
}

export default function NearbyStations({ stats }: { stats: StationStats }) {
  const [stations, setStations] = useState<Station[]>([]);
  const [city, setCity] = useState<string>('');
  const [isExact, setIsExact] = useState(false);
  const [loading, setLoading] = useState(false);
  const [locationAsked, setLocationAsked] = useState(false);
  const [locationDenied, setLocationDenied] = useState(false);

  const requestLocation = async () => {
    setLoading(true);
    setLocationAsked(true);

    if (!navigator.geolocation) {
      await loadFallback();
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          // Reverse geocode coordinates to city name using free API
          const res = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&localityLanguage=tr`
          );
          const data = await res.json();
          const cityName = data.city || data.locality || data.principalSubdivision || '';

          if (cityName) {
            const result = await getNearbyStations(cityName);
            setStations(result.stations as Station[]);
            setCity(result.city);
            setIsExact(result.isExact);
          } else {
            await loadFallback();
          }
        } catch {
          await loadFallback();
        }
        setLoading(false);
      },
      async () => {
        setLocationDenied(true);
        await loadFallback();
        setLoading(false);
      },
      { timeout: 8000, maximumAge: 300000 }
    );
  };

  const loadFallback = async () => {
    const result = await getNearbyStations('');
    setStations(result.stations as Station[]);
    setCity('Türkiye');
    setIsExact(false);
  };

  // Auto-load fallback stations on mount
  useEffect(() => {
    loadFallback();
  }, []);

  return (
    <section className="mt-10 mb-2">
      {/* Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-800 via-emerald-700 to-teal-600 p-6 sm:p-8 text-white shadow-lg">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 400 200" fill="none">
            <circle cx="350" cy="30" r="120" fill="white" />
            <circle cx="50" cy="170" r="80" fill="white" />
            <circle cx="200" cy="100" r="60" fill="white" />
          </svg>
        </div>

        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center bg-white/15 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              <Battery className="h-3.5 w-3.5 mr-1.5" />
              Şarj İstasyonu Rehberi
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {city && isExact ? (
                <><span className="text-emerald-200">{city}</span> Yakınındaki Şarj İstasyonları</>
              ) : (
                <>Size En Yakın <span className="text-emerald-200">Şarj İstasyonunu</span> Bulun</>
              )}
            </h2>
            <p className="text-emerald-100 text-sm max-w-lg">
              Türkiye genelinde <strong>{stats.totalStations}</strong> istasyon, <strong>{stats.totalCities}</strong> şehir, <strong>{stats.totalProviders}</strong> sağlayıcı. Konumunuzu paylaşın, en yakın noktaları gösterelim.
            </p>
          </div>

          <div className="flex flex-col gap-2 shrink-0">
            {!locationAsked || locationDenied ? (
              <button
                onClick={requestLocation}
                disabled={loading}
                className="inline-flex items-center bg-white text-emerald-800 font-bold px-5 py-3 rounded-xl text-sm hover:bg-emerald-50 transition-all shadow-md hover:shadow-lg cursor-pointer disabled:opacity-50"
              >
                <Locate className="h-4 w-4 mr-2" />
                {loading ? 'Konum Alınıyor...' : 'Konumumu Paylaş'}
              </button>
            ) : isExact ? (
              <div className="inline-flex items-center bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl text-sm font-medium">
                <Navigation className="h-4 w-4 mr-2 text-emerald-200" />
                📍 {city} konumunuz tespit edildi
              </div>
            ) : null}
            <Link
              href="/sarj-rehberi"
              className="inline-flex items-center justify-center text-sm font-bold text-white/90 hover:text-white transition-colors"
            >
              Tüm istasyonları görüntüle <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
        </div>
      </div>

      {/* Station Cards */}
      {stations.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-5">
          {stations.map((station) => (
            <div
              key={station.id}
              className="bg-white border border-gray-100 rounded-xl p-4 hover:shadow-md hover:border-emerald-100 transition-all duration-200 group"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-gray-900 text-sm truncate group-hover:text-emerald-700 transition-colors">
                    {station.name}
                  </h4>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full mt-1 inline-block">
                    {station.provider}
                  </span>
                </div>
                <div className="text-right shrink-0 ml-2">
                  <div className="flex items-center text-xs font-bold text-gray-800">
                    <Zap className="h-3 w-3 text-amber-500 mr-0.5" />
                    {station.powerKw} kW
                  </div>
                  <span className="text-[10px] text-gray-400 font-medium">{station.chargerType}</span>
                </div>
              </div>
              <div className="flex items-start space-x-1.5 text-xs text-gray-500">
                <MapPin className="h-3 w-3 text-emerald-600 shrink-0 mt-0.5" />
                <span className="line-clamp-2">{station.district}, {station.city}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
