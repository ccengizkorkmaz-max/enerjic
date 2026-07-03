"use client";

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Sparkles, ArrowRight, ArrowLeft, Car, Battery, Zap, Gauge,
  MapPin, Users, Wallet, Route, ChevronRight, RotateCcw,
  TrendingUp, CheckCircle, Star, GitCompareArrows
} from 'lucide-react';

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
  driveType: string | null;
  availableInTurkey: boolean;
  specialFeatures: string | null;
  maxDcChargingKw: number | null;
  topSpeedKmh: number | null;
  trunkLiters: number | null;
}

interface EvFinderWizardProps {
  vehicles: Vehicle[];
}

type Step = 'budget' | 'usage' | 'segment' | 'range' | 'priority' | 'results';

const STEPS: Step[] = ['budget', 'usage', 'segment', 'range', 'priority', 'results'];

const STEP_TITLES: Record<Step, string> = {
  budget: 'Bütçeniz',
  usage: 'Kullanım Amacı',
  segment: 'Araç Tipi',
  range: 'Menzil Beklentisi',
  priority: 'Öncelikleriniz',
  results: 'Size Uygun Araçlar',
};

export default function EvFinderWizard({ vehicles }: EvFinderWizardProps) {
  const [currentStep, setCurrentStep] = useState<Step>('budget');
  const [budget, setBudget] = useState('');
  const [usage, setUsage] = useState('');
  const [segments, setSegments] = useState<string[]>([]);
  const [minRange, setMinRange] = useState('');
  const [priority, setPriority] = useState('');

  const stepIndex = STEPS.indexOf(currentStep);
  const progress = ((stepIndex) / (STEPS.length - 1)) * 100;

  const goNext = () => {
    if (stepIndex < STEPS.length - 1) setCurrentStep(STEPS[stepIndex + 1]);
  };
  const goBack = () => {
    if (stepIndex > 0) setCurrentStep(STEPS[stepIndex - 1]);
  };
  const reset = () => {
    setCurrentStep('budget');
    setBudget('');
    setUsage('');
    setSegments([]);
    setMinRange('');
    setPriority('');
  };

  const toggleSegment = (s: string) => {
    setSegments((prev) => prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]);
  };

  // Filter logic
  const results = useMemo(() => {
    let filtered = [...vehicles];

    // Budget filter
    if (budget === 'under1m') filtered = filtered.filter((v) => v.priceStartTl && v.priceStartTl < 1000000);
    else if (budget === '1m-2m') filtered = filtered.filter((v) => v.priceStartTl && v.priceStartTl >= 1000000 && v.priceStartTl <= 2000000);
    else if (budget === '2m-4m') filtered = filtered.filter((v) => v.priceStartTl && v.priceStartTl >= 2000000 && v.priceStartTl <= 4000000);
    else if (budget === '4m-8m') filtered = filtered.filter((v) => v.priceStartTl && v.priceStartTl >= 4000000 && v.priceStartTl <= 8000000);
    else if (budget === 'over8m') filtered = filtered.filter((v) => v.priceStartTl && v.priceStartTl > 8000000);

    // Segment filter
    if (segments.length > 0) {
      filtered = filtered.filter((v) => segments.some((s) => v.segment.toLowerCase().includes(s.toLowerCase())));
    }

    // Range filter
    if (minRange === '200') filtered = filtered.filter((v) => v.rangeKm && v.rangeKm >= 200);
    else if (minRange === '350') filtered = filtered.filter((v) => v.rangeKm && v.rangeKm >= 350);
    else if (minRange === '500') filtered = filtered.filter((v) => v.rangeKm && v.rangeKm >= 500);
    else if (minRange === '600') filtered = filtered.filter((v) => v.rangeKm && v.rangeKm >= 600);

    // Sort based on priority
    if (priority === 'range') filtered.sort((a, b) => (b.rangeKm || 0) - (a.rangeKm || 0));
    else if (priority === 'performance') filtered.sort((a, b) => (a.acceleration0100 || 99) - (b.acceleration0100 || 99));
    else if (priority === 'charging') filtered.sort((a, b) => (b.maxDcChargingKw || 0) - (a.maxDcChargingKw || 0));
    else if (priority === 'price') filtered.sort((a, b) => (a.priceStartTl || 999999999) - (b.priceStartTl || 999999999));
    else if (priority === 'trunk') filtered.sort((a, b) => (b.trunkLiters || 0) - (a.trunkLiters || 0));

    return filtered;
  }, [vehicles, budget, segments, minRange, priority]);

  const canProceed = () => {
    if (currentStep === 'budget') return !!budget;
    if (currentStep === 'usage') return !!usage;
    if (currentStep === 'segment') return segments.length > 0;
    if (currentStep === 'range') return !!minRange;
    if (currentStep === 'priority') return !!priority;
    return true;
  };

  const fmt = (n: number | null) => n ? n.toLocaleString('tr-TR') : '—';

  const OptionCard = ({
    selected,
    onClick,
    icon,
    title,
    desc,
  }: {
    selected: boolean;
    onClick: () => void;
    icon: React.ReactNode;
    title: string;
    desc: string;
  }) => (
    <button
      onClick={onClick}
      className={`w-full text-left p-4 rounded-2xl border-2 transition-all cursor-pointer ${
        selected
          ? 'border-emerald-500 bg-emerald-50 shadow-sm'
          : 'border-gray-100 bg-white hover:border-emerald-200 hover:bg-emerald-50/30'
      }`}
    >
      <div className="flex items-center space-x-3">
        <div className={`p-2 rounded-xl ${selected ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
          {icon}
        </div>
        <div>
          <p className={`font-extrabold text-sm ${selected ? 'text-emerald-900' : 'text-gray-800'}`}>{title}</p>
          <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
        </div>
        {selected && <CheckCircle className="h-5 w-5 text-emerald-500 ml-auto shrink-0" />}
      </div>
    </button>
  );

  const MultiOptionCard = ({
    selected,
    onClick,
    title,
  }: {
    selected: boolean;
    onClick: () => void;
    title: string;
  }) => (
    <button
      onClick={onClick}
      className={`px-4 py-2.5 rounded-xl border-2 text-sm font-bold transition-all cursor-pointer ${
        selected
          ? 'border-emerald-500 bg-emerald-50 text-emerald-800'
          : 'border-gray-100 bg-white text-gray-600 hover:border-emerald-200'
      }`}
    >
      {title}
    </button>
  );

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      {/* Header */}
      {currentStep !== 'results' && (
        <div className="text-center mb-8 space-y-3">
          <div className="inline-flex items-center bg-violet-50 text-violet-700 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="h-3.5 w-3.5 mr-1.5" />
            Akıllı Öneri
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            Sana Uygun <span className="text-emerald-700">Elektrikli Aracı</span> Bulalım
          </h1>
          <p className="text-gray-500 text-sm">
            Birkaç soru cevaplayın, size en uygun araçları önerelim.
          </p>
        </div>
      )}

      {/* Progress Bar */}
      {currentStep !== 'results' && (
        <div className="mb-8">
          <div className="flex justify-between text-xs font-bold text-gray-400 mb-2">
            <span>Adım {stepIndex + 1} / {STEPS.length - 1}</span>
            <span>{STEP_TITLES[currentStep]}</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Step Content */}
      <div className="min-h-[320px]">
        {/* Step 1: Budget */}
        {currentStep === 'budget' && (
          <div className="space-y-3">
            <h2 className="text-xl font-extrabold text-gray-900 mb-4">
              <Wallet className="h-5 w-5 text-emerald-600 inline mr-2" />
              Bütçeniz ne kadar?
            </h2>
            <OptionCard selected={budget === 'under1m'} onClick={() => setBudget('under1m')}
              icon={<Wallet className="h-5 w-5" />} title="1 Milyon TL altı" desc="Giriş seviyesi elektrikli araçlar" />
            <OptionCard selected={budget === '1m-2m'} onClick={() => setBudget('1m-2m')}
              icon={<Wallet className="h-5 w-5" />} title="1 – 2 Milyon TL" desc="Orta segment, iyi donanımlı modeller" />
            <OptionCard selected={budget === '2m-4m'} onClick={() => setBudget('2m-4m')}
              icon={<Wallet className="h-5 w-5" />} title="2 – 4 Milyon TL" desc="Premium segment araçlar" />
            <OptionCard selected={budget === '4m-8m'} onClick={() => setBudget('4m-8m')}
              icon={<Wallet className="h-5 w-5" />} title="4 – 8 Milyon TL" desc="Lüks segment, üst düzey performans" />
            <OptionCard selected={budget === 'over8m'} onClick={() => setBudget('over8m')}
              icon={<Star className="h-5 w-5" />} title="8 Milyon TL üzeri" desc="Ultra lüks, spor ve koleksiyon araçlar" />
          </div>
        )}

        {/* Step 2: Usage */}
        {currentStep === 'usage' && (
          <div className="space-y-3">
            <h2 className="text-xl font-extrabold text-gray-900 mb-4">
              <Route className="h-5 w-5 text-emerald-600 inline mr-2" />
              Aracı nasıl kullanacaksınız?
            </h2>
            <OptionCard selected={usage === 'city'} onClick={() => setUsage('city')}
              icon={<MapPin className="h-5 w-5" />} title="Şehir İçi" desc="Günlük işe gidiş-geliş, kısa mesafeler" />
            <OptionCard selected={usage === 'highway'} onClick={() => setUsage('highway')}
              icon={<Route className="h-5 w-5" />} title="Uzun Yol" desc="Şehirlerarası seyahat, tatil rotaları" />
            <OptionCard selected={usage === 'mixed'} onClick={() => setUsage('mixed')}
              icon={<Car className="h-5 w-5" />} title="Karma Kullanım" desc="Hem şehir hem yol, her koşulda esneklik" />
            <OptionCard selected={usage === 'family'} onClick={() => setUsage('family')}
              icon={<Users className="h-5 w-5" />} title="Aile Aracı" desc="Geniş kabin, büyük bagaj, konfor öncelikli" />
          </div>
        )}

        {/* Step 3: Segment */}
        {currentStep === 'segment' && (
          <div className="space-y-4">
            <h2 className="text-xl font-extrabold text-gray-900 mb-2">
              <Car className="h-5 w-5 text-emerald-600 inline mr-2" />
              Hangi araç tiplerini tercih edersiniz?
            </h2>
            <p className="text-sm text-gray-500 mb-4">Birden fazla seçebilirsiniz.</p>
            <div className="flex flex-wrap gap-2">
              {['SUV', 'Sedan', 'Hatchback', 'Crossover', 'Coupe', 'MPV', 'Pickup'].map((s) => (
                <MultiOptionCard key={s} selected={segments.includes(s)} onClick={() => toggleSegment(s)} title={s} />
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Range */}
        {currentStep === 'range' && (
          <div className="space-y-3">
            <h2 className="text-xl font-extrabold text-gray-900 mb-4">
              <Battery className="h-5 w-5 text-emerald-600 inline mr-2" />
              Minimum menzil beklentiniz?
            </h2>
            <OptionCard selected={minRange === '200'} onClick={() => setMinRange('200')}
              icon={<Battery className="h-5 w-5" />} title="200+ km" desc="Şehir içi günlük kullanım için yeterli" />
            <OptionCard selected={minRange === '350'} onClick={() => setMinRange('350')}
              icon={<Battery className="h-5 w-5" />} title="350+ km" desc="Hafta sonu gezileri dahil rahat kullanım" />
            <OptionCard selected={minRange === '500'} onClick={() => setMinRange('500')}
              icon={<Battery className="h-5 w-5" />} title="500+ km" desc="Şehirlerarası seyahatte güven" />
            <OptionCard selected={minRange === '600'} onClick={() => setMinRange('600')}
              icon={<Zap className="h-5 w-5" />} title="600+ km" desc="Maksimum menzil, menzil kaygısı sıfır" />
          </div>
        )}

        {/* Step 5: Priority */}
        {currentStep === 'priority' && (
          <div className="space-y-3">
            <h2 className="text-xl font-extrabold text-gray-900 mb-4">
              <TrendingUp className="h-5 w-5 text-emerald-600 inline mr-2" />
              En önemli önceliğiniz hangisi?
            </h2>
            <OptionCard selected={priority === 'price'} onClick={() => setPriority('price')}
              icon={<Wallet className="h-5 w-5" />} title="En Uygun Fiyat" desc="Bütçe dostu, ekonomik tercih" />
            <OptionCard selected={priority === 'range'} onClick={() => setPriority('range')}
              icon={<Battery className="h-5 w-5" />} title="En Uzun Menzil" desc="Tek şarjla en uzun mesafe" />
            <OptionCard selected={priority === 'performance'} onClick={() => setPriority('performance')}
              icon={<Gauge className="h-5 w-5" />} title="Yüksek Performans" desc="En hızlı 0-100, sportif sürüş" />
            <OptionCard selected={priority === 'charging'} onClick={() => setPriority('charging')}
              icon={<Zap className="h-5 w-5" />} title="Hızlı Şarj" desc="En yüksek DC şarj gücü, kısa mola" />
            <OptionCard selected={priority === 'trunk'} onClick={() => setPriority('trunk')}
              icon={<Car className="h-5 w-5" />} title="Geniş Bagaj" desc="Aile, seyahat, yük taşıma kapasitesi" />
          </div>
        )}

        {/* Results */}
        {currentStep === 'results' && (
          <div>
            <div className="text-center mb-8 space-y-3">
              <div className="inline-flex items-center bg-emerald-50 text-emerald-700 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
                <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                Öneri Sonuçları
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                Sana Uygun <span className="text-emerald-700">{results.length} Araç</span> Bulduk!
              </h1>
              <p className="text-gray-500 text-sm">
                Tercihlerine göre en uygun elektrikli araçlar aşağıda sıralanmıştır.
              </p>
            </div>

            {results.length > 0 ? (
              <div className="space-y-4">
                {results.slice(0, 10).map((v, idx) => {
                  const features: string[] = v.specialFeatures
                    ? (() => { try { return JSON.parse(v.specialFeatures); } catch { return []; } })()
                    : [];

                  return (
                    <div
                      key={v.id}
                      className="bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-md hover:border-emerald-100 transition-all duration-200"
                    >
                      <div className="flex items-start gap-4">
                        <div className="bg-emerald-50 text-emerald-700 font-extrabold text-lg w-10 h-10 rounded-xl flex items-center justify-center shrink-0">
                          {idx + 1}
                        </div>
                        <div className="flex-grow min-w-0 space-y-2">
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider">{v.brand}</p>
                              <h3 className="font-extrabold text-gray-900 text-lg">
                                {v.model}
                                {v.variant && <span className="text-gray-400 font-bold text-sm ml-1.5">{v.variant}</span>}
                              </h3>
                            </div>
                            <span className="text-[10px] font-bold bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full shrink-0">
                              {v.year} · {v.segment}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                            <div className="bg-gray-50 rounded-lg px-3 py-2 text-center">
                              <p className="text-gray-400 font-bold">Menzil</p>
                              <p className="font-extrabold text-gray-800">{v.rangeKm ? `${v.rangeKm} km` : '—'}</p>
                            </div>
                            <div className="bg-gray-50 rounded-lg px-3 py-2 text-center">
                              <p className="text-gray-400 font-bold">Güç</p>
                              <p className="font-extrabold text-gray-800">{v.powerHp ? `${v.powerHp} HP` : '—'}</p>
                            </div>
                            <div className="bg-gray-50 rounded-lg px-3 py-2 text-center">
                              <p className="text-gray-400 font-bold">0-100</p>
                              <p className="font-extrabold text-gray-800">{v.acceleration0100 ? `${v.acceleration0100}s` : '—'}</p>
                            </div>
                            <div className="bg-gray-50 rounded-lg px-3 py-2 text-center">
                              <p className="text-gray-400 font-bold">DC Şarj</p>
                              <p className="font-extrabold text-gray-800">{v.maxDcChargingKw ? `${v.maxDcChargingKw} kW` : '—'}</p>
                            </div>
                          </div>

                          {features.length > 0 && (
                            <div className="flex flex-wrap gap-1 pt-1">
                              {features.slice(0, 4).map((f, i) => (
                                <span key={i} className="text-[10px] font-bold bg-violet-50 text-violet-700 px-2 py-0.5 rounded-full">
                                  {f}
                                </span>
                              ))}
                            </div>
                          )}

                          <div className="flex items-center justify-between pt-2 border-t border-gray-50">
                            <span className="text-base font-extrabold text-gray-900">
                              {v.priceStartTl ? `${fmt(v.priceStartTl)} ₺` : v.priceStartEur ? `${fmt(v.priceStartEur)} €` : '—'}
                            </span>
                            <Link
                              href={`/elektrikli-araclar?q=${encodeURIComponent(v.brand + ' ' + v.model)}`}
                              className="inline-flex items-center text-xs font-bold text-emerald-700 hover:text-emerald-800"
                            >
                              Detay <ChevronRight className="h-3 w-3 ml-0.5" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-gray-50 border border-dashed border-gray-200 rounded-2xl p-12 text-center space-y-3">
                <p className="text-gray-500 text-sm font-semibold">Tercihlerinize uygun araç bulunamadı.</p>
                <p className="text-gray-400 text-xs">Daha geniş filtrelerle tekrar deneyin.</p>
              </div>
            )}

            {/* Bottom actions */}
            <div className="mt-8 flex justify-center gap-3">
              <button
                onClick={reset}
                className="inline-flex items-center bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold px-5 py-2.5 rounded-xl text-sm transition-colors cursor-pointer"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Baştan Başla
              </button>
              <Link
                href="/elektrikli-araclar"
                className="inline-flex items-center bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-colors"
              >
                <GitCompareArrows className="h-4 w-4 mr-2" />
                Tüm Kataloğu Gör
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      {currentStep !== 'results' && (
        <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
          {stepIndex > 0 ? (
            <button
              onClick={goBack}
              className="inline-flex items-center text-gray-500 hover:text-gray-700 font-bold text-sm cursor-pointer transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-1.5" />
              Geri
            </button>
          ) : (
            <div />
          )}
          <button
            onClick={goNext}
            disabled={!canProceed()}
            className="inline-flex items-center bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed shadow-sm"
          >
            {stepIndex === STEPS.length - 2 ? 'Araçları Göster' : 'Devam Et'}
            <ArrowRight className="h-4 w-4 ml-1.5" />
          </button>
        </div>
      )}
    </div>
  );
}
