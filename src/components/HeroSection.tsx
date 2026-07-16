'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

interface Category {
  name: string;
  slug: string;
}

interface Article {
  id: string;
  title: string;
  slug: string;
  summary: string;
  imageUrl: string | null;
  publishedAt: Date;
  category: Category;
}

interface HeroSectionProps {
  articles: Article[];
}

export default function HeroSection({ articles }: HeroSectionProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const goTo = useCallback((index: number) => {
    if (index === activeIndex) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveIndex(index);
      setIsTransitioning(false);
    }, 300);
  }, [activeIndex]);

  const goNext = useCallback(() => {
    goTo((activeIndex + 1) % articles.length);
  }, [activeIndex, articles.length, goTo]);

  const goPrev = useCallback(() => {
    goTo((activeIndex - 1 + articles.length) % articles.length);
  }, [activeIndex, articles.length, goTo]);

  // Auto-rotate every 6 seconds
  useEffect(() => {
    if (isPaused || articles.length <= 1) return;
    const timer = setInterval(goNext, 6000);
    return () => clearInterval(timer);
  }, [isPaused, goNext, articles.length]);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  if (articles.length === 0) {
    return (
      <section className="py-8 border-b border-gray-100">
        <div className="h-64 flex items-center justify-center bg-gray-50 border border-dashed border-gray-200 rounded-2xl">
          <p className="text-gray-400 text-sm">Haber bulunamadı.</p>
        </div>
      </section>
    );
  }

  const active = articles[activeIndex];

  // Show max 5 thumbnails on desktop (scrollable on mobile)
  const thumbCount = Math.min(articles.length, 5);

  return (
    <section
      className="py-6 border-b border-gray-100"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Main Carousel Area */}
      <div className="relative group">
        {/* Main Image + Overlay */}
        <Link href={`/haber/${active.slug}`} className="block">
          <div className="relative aspect-[16/7] sm:aspect-[16/7] w-full rounded-2xl overflow-hidden bg-gray-900">
            {active.imageUrl ? (
              <img
                src={active.imageUrl}
                alt={active.title}
                className={`object-cover w-full h-full transition-all duration-500 ease-out ${
                  isTransitioning ? 'opacity-0 scale-105' : 'opacity-100 scale-100'
                }`}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-emerald-900 to-emerald-700 flex items-center justify-center">
                <span className="text-emerald-200 font-semibold text-lg">Enerjic</span>
              </div>
            )}

            {/* Dark gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

            {/* Category badge */}
            <span className="absolute top-4 left-4 bg-emerald-600 text-white text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg z-10 shadow-lg">
              {active.category.name}
            </span>

            {/* Text overlay on bottom */}
            <div className={`absolute bottom-0 left-0 right-0 p-5 sm:p-8 z-10 transition-all duration-500 ${
              isTransitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
            }`}>
              <span className="text-emerald-400 text-xs font-semibold tracking-wide">
                {formatDate(active.publishedAt)}
              </span>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white leading-tight mt-1 line-clamp-2 drop-shadow-lg">
                {active.title}
              </h1>
              <p className="text-gray-300 text-sm sm:text-base leading-relaxed line-clamp-2 mt-2 max-w-3xl">
                {active.summary}
              </p>
            </div>

            {/* Slide counter */}
            <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-lg z-10">
              {activeIndex + 1} / {articles.length}
            </div>
          </div>
        </Link>

        {/* Navigation arrows */}
        {articles.length > 1 && (
          <>
            <button
              onClick={(e) => { e.preventDefault(); goPrev(); }}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/40 hover:bg-emerald-700 backdrop-blur-sm text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 z-20 cursor-pointer"
              aria-label="Önceki haber"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={(e) => { e.preventDefault(); goNext(); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/40 hover:bg-emerald-700 backdrop-blur-sm text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 z-20 cursor-pointer"
              aria-label="Sonraki haber"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 z-20 flex gap-0.5 px-0 rounded-b-2xl overflow-hidden">
          {articles.map((_, i) => (
            <div key={i} className="flex-1 bg-white/20 overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  i === activeIndex ? 'bg-emerald-500' : i < activeIndex ? 'bg-emerald-500/60' : 'bg-transparent'
                }`}
                style={i === activeIndex && !isPaused ? {
                  animation: 'progressFill 6s linear forwards',
                } : i === activeIndex && isPaused ? {
                  width: '50%',
                  backgroundColor: 'rgb(16, 185, 129)',
                } : i < activeIndex ? {
                  width: '100%',
                } : {
                  width: '0%',
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Thumbnail Strip */}
      {articles.length > 1 && (
        <div className="mt-3 grid grid-cols-5 gap-2 sm:gap-3">
          {articles.slice(0, thumbCount).map((article, i) => (
            <button
              key={article.id}
              onClick={() => goTo(i)}
              className={`group/thumb relative rounded-xl overflow-hidden transition-all duration-300 cursor-pointer ${
                i === activeIndex
                  ? 'ring-2 ring-emerald-600 ring-offset-2 shadow-lg'
                  : 'opacity-70 hover:opacity-100 hover:shadow-md'
              }`}
            >
              <div className="aspect-[16/10] w-full bg-gray-100">
                {article.imageUrl ? (
                  <img
                    src={article.imageUrl}
                    alt={article.title}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-emerald-100 to-emerald-50 flex items-center justify-center">
                    <span className="text-emerald-600 text-[10px] font-bold">ENERJİC</span>
                  </div>
                )}
                {/* Dark overlay with title */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <p className="absolute bottom-1 left-1.5 right-1.5 text-white text-[10px] sm:text-xs font-bold leading-tight line-clamp-2 drop-shadow">
                  {article.title}
                </p>
              </div>
              {/* Active dot indicator */}
              {i === activeIndex && (
                <div className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full shadow-lg animate-pulse" />
              )}
            </button>
          ))}
        </div>
      )}

      {/* More thumbnails row for 6-10 */}
      {articles.length > 5 && (
        <div className="mt-2 grid grid-cols-5 gap-2 sm:gap-3">
          {articles.slice(5, 10).map((article, i) => {
            const realIndex = i + 5;
            return (
              <button
                key={article.id}
                onClick={() => goTo(realIndex)}
                className={`group/thumb relative rounded-xl overflow-hidden transition-all duration-300 cursor-pointer ${
                  realIndex === activeIndex
                    ? 'ring-2 ring-emerald-600 ring-offset-2 shadow-lg'
                    : 'opacity-70 hover:opacity-100 hover:shadow-md'
                }`}
              >
                <div className="aspect-[16/10] w-full bg-gray-100">
                  {article.imageUrl ? (
                    <img
                      src={article.imageUrl}
                      alt={article.title}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-emerald-100 to-emerald-50 flex items-center justify-center">
                      <span className="text-emerald-600 text-[10px] font-bold">ENERJİC</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <p className="absolute bottom-1 left-1.5 right-1.5 text-white text-[10px] sm:text-xs font-bold leading-tight line-clamp-2 drop-shadow">
                    {article.title}
                  </p>
                </div>
                {realIndex === activeIndex && (
                  <div className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full shadow-lg animate-pulse" />
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* CSS animation for progress bar */}
      <style jsx>{`
        @keyframes progressFill {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </section>
  );
}
