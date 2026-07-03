"use client";

import { createContext, useContext, useState, ReactNode } from 'react';
import Link from 'next/link';
import { X, GitCompareArrows } from 'lucide-react';

interface CompareVehicle {
  id: string;
  brand: string;
  model: string;
  variant: string | null;
}

interface CompareContextType {
  selected: CompareVehicle[];
  toggle: (vehicle: CompareVehicle) => void;
  isSelected: (id: string) => boolean;
  clear: () => void;
}

const CompareContext = createContext<CompareContextType>({
  selected: [],
  toggle: () => {},
  isSelected: () => false,
  clear: () => {},
});

export function useCompare() {
  return useContext(CompareContext);
}

export function CompareProvider({ children }: { children: ReactNode }) {
  const [selected, setSelected] = useState<CompareVehicle[]>([]);

  const toggle = (vehicle: CompareVehicle) => {
    setSelected((prev) => {
      const exists = prev.find((v) => v.id === vehicle.id);
      if (exists) return prev.filter((v) => v.id !== vehicle.id);
      if (prev.length >= 3) return prev; // Max 3
      return [...prev, vehicle];
    });
  };

  const isSelected = (id: string) => selected.some((v) => v.id === id);
  const clear = () => setSelected([]);

  return (
    <CompareContext.Provider value={{ selected, toggle, isSelected, clear }}>
      {children}
      {selected.length > 0 && <CompareBar />}
    </CompareContext.Provider>
  );
}

function CompareBar() {
  const { selected, toggle, clear } = useCompare();

  const compareUrl = `/elektrikli-araclar/karsilastir?ids=${selected.map((v) => v.id).join(',')}`;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-sm border-t border-gray-700 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-grow overflow-x-auto">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider shrink-0">
              Karşılaştır ({selected.length}/3)
            </span>
            {selected.map((v) => (
              <div
                key={v.id}
                className="flex items-center bg-gray-800 border border-gray-700 rounded-xl px-3 py-1.5 text-xs shrink-0"
              >
                <span className="font-bold text-white mr-1">{v.brand}</span>
                <span className="text-gray-400">{v.model}{v.variant ? ` ${v.variant}` : ''}</span>
                <button
                  onClick={() => toggle(v)}
                  className="ml-2 text-gray-500 hover:text-red-400 transition-colors cursor-pointer"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={clear}
              className="text-xs font-bold text-gray-500 hover:text-gray-300 transition-colors cursor-pointer px-3 py-1.5"
            >
              Temizle
            </button>
            {selected.length >= 2 && (
              <Link
                href={compareUrl}
                className="inline-flex items-center bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2 rounded-xl text-sm transition-colors shadow-sm"
              >
                <GitCompareArrows className="h-4 w-4 mr-1.5" />
                Karşılaştır
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
