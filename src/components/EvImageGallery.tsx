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

  return (
    <div className="space-y-4">
      {/* Main Image View */}
      <div className="relative aspect-[16/10] bg-gray-50 rounded-3xl border border-gray-100 overflow-hidden shadow-sm flex items-center justify-center group">
        {!isMainError ? (
          <img
            src={imageUrls[activeIndex]}
            alt={`${brand} ${model} - Görsel ${activeIndex + 1}`}
            referrerPolicy="no-referrer"
            onError={() => handleImageError(activeIndex)}
            className="w-full h-full object-contain p-4 transition-all duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-emerald-50 via-teal-50 to-indigo-50 flex flex-col items-center justify-center p-6 text-center space-y-3">
            <div className="p-4 bg-white rounded-3xl shadow-sm border border-emerald-100/50 text-emerald-700 animate-pulse">
              <Car className="h-12 w-12" />
            </div>
            <div>
              <p className="text-xs font-extrabold text-emerald-800 tracking-wider uppercase">{brand}</p>
              <h3 className="text-lg font-black text-gray-900 mt-0.5">{model}</h3>
              <p className="text-[10px] text-gray-400 font-bold mt-1 uppercase tracking-widest bg-white/80 px-2 py-0.5 rounded-full inline-block">Konsept Görsel</p>
            </div>
          </div>
        )}

        {/* Navigation arrows (only if multiple images exist) */}
        {imageUrls.length > 1 && (
          <>
            <button
              onClick={goPrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-md backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={goNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-md backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}

        {/* Indicator pill */}
        {imageUrls.length > 1 && (
          <span className="absolute bottom-4 right-4 bg-gray-900/80 text-white text-[10px] font-bold px-2 py-1 rounded-md backdrop-blur-sm">
            {activeIndex + 1} / {imageUrls.length}
          </span>
        )}
      </div>

      {/* Thumbnails list */}
      {imageUrls.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
          {imageUrls.map((url, idx) => {
            const isError = imageErrors[idx];
            return (
              <button
                key={idx}
                onClick={() => setActiveIndex(idx)}
                className={`relative aspect-[16/10] w-20 rounded-xl overflow-hidden border-2 bg-gray-50 shrink-0 transition-all cursor-pointer flex items-center justify-center ${
                  idx === activeIndex ? 'border-emerald-600 ring-2 ring-emerald-100' : 'border-gray-150 hover:border-emerald-200'
                }`}
              >
                {!isError ? (
                  <img
                    src={url}
                    alt={`${brand} ${model} thumbnail ${idx + 1}`}
                    referrerPolicy="no-referrer"
                    onError={() => handleImageError(idx)}
                    className="w-full h-full object-contain p-1"
                  />
                ) : (
                  <Car className="h-5 w-5 text-gray-400 opacity-40" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
