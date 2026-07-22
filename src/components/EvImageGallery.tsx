"use client";

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Car } from 'lucide-react';

interface EvImageGalleryProps {
  imageUrls: string[];
  brand: string;
  model: string;
}

export default function EvImageGallery({ imageUrls, brand, model }: EvImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (imageUrls.length === 0) {
    return (
      <div className="relative aspect-[16/10] bg-gray-50 rounded-3xl border border-gray-100 overflow-hidden shadow-sm flex items-center justify-center">
        <div className="text-center text-gray-400">
          <Car className="h-16 w-16 mx-auto mb-2 opacity-30" />
          <p className="text-sm font-semibold">Görsel Bulunmuyor</p>
        </div>
      </div>
    );
  }

  const goNext = () => {
    setActiveIndex((prev) => (prev + 1) % imageUrls.length);
  };

  const goPrev = () => {
    setActiveIndex((prev) => (prev - 1 + imageUrls.length) % imageUrls.length);
  };

  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});

  const handleImageError = (index: number) => {
    setImageErrors(prev => ({ ...prev, [index]: true }));
  };

  const isMainError = imageErrors[activeIndex];

  // Filter out broken images dynamically so empty boxes are never rendered
  const validImageUrls = imageUrls.filter((url, idx) => !imageErrors[idx] && url && !url.startsWith('/img/'));
  const activeUrl = validImageUrls[activeIndex] || imageUrls[0];

  return (
    <div className="space-y-4">
      {/* Main Image View */}
      <div className="relative aspect-[16/10] bg-slate-950 rounded-3xl border border-gray-100 overflow-hidden shadow-sm flex items-center justify-center group">
        {!isMainError && activeUrl ? (
          <>
            <img
              src={activeUrl}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 w-full h-full object-cover filter blur-xl opacity-35 scale-110 select-none pointer-events-none"
            />
            <img
              src={activeUrl}
              alt={`${brand} ${model}`}
              referrerPolicy="no-referrer"
              onError={() => handleImageError(activeIndex)}
              className="relative z-10 w-full h-full object-contain p-4 transition-all duration-300"
            />
          </>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900 flex flex-col items-center justify-center p-6 text-center space-y-3 text-white">
            <div className="p-4 bg-emerald-800/40 rounded-3xl shadow-sm border border-emerald-700/50 text-emerald-400 animate-pulse">
              <Car className="h-12 w-12" />
            </div>
            <div>
              <p className="text-xs font-extrabold text-emerald-400 tracking-wider uppercase">{brand}</p>
              <h3 className="text-lg font-black text-white mt-0.5">{model}</h3>
            </div>
          </div>
        )}

        {/* Navigation arrows (only if multiple valid images exist) */}
        {validImageUrls.length > 1 && (
          <>
            <button
              onClick={goPrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-md backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 cursor-pointer z-20"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={goNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-md backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 cursor-pointer z-20"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}

        {/* Indicator pill */}
        {validImageUrls.length > 1 && (
          <span className="absolute bottom-4 right-4 bg-gray-900/80 text-white text-[10px] font-bold px-2.5 py-1 rounded-md backdrop-blur-sm z-20">
            {activeIndex + 1} / {validImageUrls.length}
          </span>
        )}
      </div>

      {/* Thumbnails list (only render if multiple valid URLs exist) */}
      {validImageUrls.length > 1 && (
        <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-thin">
          {validImageUrls.map((url, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`relative aspect-[16/10] w-20 rounded-xl overflow-hidden border-2 bg-slate-900 shrink-0 transition-all cursor-pointer flex items-center justify-center ${
                idx === activeIndex ? 'border-emerald-500 ring-2 ring-emerald-400/30' : 'border-gray-200 hover:border-emerald-400'
              }`}
            >
              <img
                src={url}
                alt={`${brand} ${model} thumbnail ${idx + 1}`}
                referrerPolicy="no-referrer"
                onError={() => handleImageError(idx)}
                className="w-full h-full object-contain p-1"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
