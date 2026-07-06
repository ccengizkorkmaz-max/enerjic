'use client';

import { useState } from 'react';
import Link from 'next/link';

interface SoftwareUpdate {
  id: string;
  brand: string;
  model: string | null;
  version: string;
  previousVersion: string | null;
  updateType: string;
  title: string;
  changelog: string;
  highlights: string | null;
  releaseDate: Date;
  sourceUrl: string | null;
  sourceName: string | null;
  isSecurityFix: boolean;
}

interface Props {
  updates: SoftwareUpdate[];
  brands: string[];
}

const typeLabels: Record<string, { text: string; color: string; bg: string }> = {
  major: { text: 'Büyük Güncelleme', color: 'text-blue-700', bg: 'bg-blue-50 border-blue-200' },
  minor: { text: 'Küçük Güncelleme', color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200' },
  patch: { text: 'Yama', color: 'text-amber-700', bg: 'bg-amber-50 border-amber-200' },
  security: { text: 'Güvenlik', color: 'text-red-700', bg: 'bg-red-50 border-red-200' },
  recall: { text: 'Geri Çağırma', color: 'text-rose-700', bg: 'bg-rose-50 border-rose-200' },
};

const brandColors: Record<string, string> = {
  'Tesla': 'from-red-500 to-red-700',
  'Togg': 'from-blue-600 to-indigo-700',
  'BMW': 'from-blue-500 to-blue-700',
  'BYD': 'from-emerald-500 to-emerald-700',
  'Rivian': 'from-amber-500 to-orange-600',
  'Ford': 'from-blue-700 to-blue-900',
};

export default function SoftwareUpdateClient({ updates, brands }: Props) {
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const filteredUpdates = updates.filter(u => {
    if (selectedBrand && u.brand !== selectedBrand) return false;
    if (selectedType && u.updateType !== selectedType) return false;
    return true;
  });

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const parseHighlights = (highlights: string | null): string[] => {
    if (!highlights) return [];
    try {
      return JSON.parse(highlights);
    } catch {
      return [];
    }
  };

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        {/* Brand Filter */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedBrand(null)}
            className={`text-xs font-bold px-3 py-2 rounded-xl transition-all duration-200 border cursor-pointer ${
              !selectedBrand
                ? 'bg-gray-900 text-white border-gray-900 shadow-md'
                : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
            }`}
          >
            Tüm Markalar
          </button>
          {brands.map(brand => (
            <button
              key={brand}
              onClick={() => setSelectedBrand(selectedBrand === brand ? null : brand)}
              className={`text-xs font-bold px-3 py-2 rounded-xl transition-all duration-200 border cursor-pointer ${
                selectedBrand === brand
                  ? 'bg-gray-900 text-white border-gray-900 shadow-md'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
              }`}
            >
              {brand}
            </button>
          ))}
        </div>

        {/* Type Filter */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedType(null)}
            className={`text-xs font-bold px-3 py-2 rounded-xl transition-all duration-200 border cursor-pointer ${
              !selectedType
                ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
            }`}
          >
            Tümü
          </button>
          {Object.entries(typeLabels).map(([key, val]) => (
            <button
              key={key}
              onClick={() => setSelectedType(selectedType === key ? null : key)}
              className={`text-xs font-bold px-3 py-2 rounded-xl transition-all duration-200 border cursor-pointer ${
                selectedType === key
                  ? `${val.bg} ${val.color} border-current shadow-md`
                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
              }`}
            >
              {val.text}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <p className="text-sm text-gray-500 mb-6">
        {filteredUpdates.length} güncelleme gösteriliyor
      </p>

      {/* Update Cards - Timeline Style */}
      <div className="relative">
        {/* Timeline Line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-200 via-emerald-200 to-gray-100 hidden md:block" />

        <div className="space-y-6">
          {filteredUpdates.map((update, idx) => {
            const typeInfo = typeLabels[update.updateType] || typeLabels.minor;
            const highlights = parseHighlights(update.highlights);
            const brandGradient = brandColors[update.brand] || 'from-gray-500 to-gray-700';

            return (
              <div key={update.id} className="relative md:pl-16 group">
                {/* Timeline Dot */}
                <div className="absolute left-4 top-8 w-4 h-4 rounded-full bg-white border-2 border-blue-400 shadow-sm hidden md:block z-10 group-hover:scale-125 group-hover:border-blue-600 transition-all duration-300" />

                {/* Card */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group-hover:border-gray-200">
                  {/* Card Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 pb-3">
                    <div className="flex items-center gap-3">
                      {/* Brand Badge */}
                      <div className={`bg-gradient-to-br ${brandGradient} text-white text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-lg shadow-sm`}>
                        {update.brand}
                      </div>
                      {/* Type Badge */}
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg border ${typeInfo.bg} ${typeInfo.color}`}>
                        {typeInfo.text}
                      </span>
                      {update.isSecurityFix && (
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg bg-red-50 text-red-700 border border-red-200 flex items-center gap-1">
                          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                          </svg>
                          Güvenlik
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-gray-400 font-medium">
                      {formatDate(update.releaseDate)}
                    </span>
                  </div>

                  {/* Card Body */}
                  <div className="px-5 pb-5">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                      {update.title}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                      <span className="font-mono bg-gray-50 px-2 py-0.5 rounded text-xs font-bold">
                        v{update.version}
                      </span>
                      {update.previousVersion && (
                        <>
                          <span className="text-gray-300">←</span>
                          <span className="font-mono text-xs text-gray-400">
                            v{update.previousVersion}
                          </span>
                        </>
                      )}
                      {update.model && (
                        <span className="text-xs text-gray-400">
                          • {update.model}
                        </span>
                      )}
                    </div>

                    {/* Highlights */}
                    {highlights.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {highlights.map((h, i) => (
                          <span key={i} className="text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-lg font-medium">
                            {h}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Changelog */}
                    <div
                      className="text-sm text-gray-600 leading-relaxed prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: update.changelog }}
                    />

                    {/* Source */}
                    {update.sourceUrl && (
                      <div className="mt-4 pt-3 border-t border-gray-50">
                        <a
                          href={update.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
                        >
                          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                          </svg>
                          Kaynak: {update.sourceName || 'Orijinal'}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {filteredUpdates.length === 0 && (
        <div className="text-center py-16">
          <div className="text-gray-300 text-5xl mb-4">📋</div>
          <p className="text-gray-500 font-medium">Bu filtrelerle eşleşen güncelleme bulunamadı.</p>
          <button
            onClick={() => { setSelectedBrand(null); setSelectedType(null); }}
            className="mt-4 text-sm text-blue-600 hover:text-blue-800 font-medium cursor-pointer"
          >
            Filtreleri Temizle
          </button>
        </div>
      )}
    </div>
  );
}
