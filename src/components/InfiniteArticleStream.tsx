"use client";

import { useState, useEffect, useRef } from 'react';
import { getNextArticleAction } from '@/app/actions/articles';
import InArticleAd from './InArticleAd';
import ShareButtons from './ShareButtons';
import { Loader2, ArrowDown, Sparkles } from 'lucide-react';
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
  content: string;
  imageUrl: string | null;
  publishedAt: Date;
  categoryId: string;
  category: Category;
}

interface InfiniteArticleStreamProps {
  initialArticleId: string;
  categoryId: string;
  inArticleAdPlacement?: any;
}

export default function InfiniteArticleStream({
  initialArticleId,
  categoryId,
  inArticleAdPlacement,
}: InfiniteArticleStreamProps) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loadedIds, setLoadedIds] = useState<string[]>([initialArticleId]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const triggerRef = useRef<HTMLDivElement>(null);

  const loadNextArticle = async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const res = await getNextArticleAction(initialArticleId, categoryId, loadedIds);
      if (res.success && res.article) {
        const nextArt = res.article as Article;
        setArticles((prev) => [...prev, nextArt]);
        setLoadedIds((prev) => [...prev, nextArt.id]);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.warn('Infinite article load error:', err);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadNextArticle();
        }
      },
      { threshold: 0.2 }
    );

    if (triggerRef.current) {
      observer.observe(triggerRef.current);
    }

    return () => observer.disconnect();
  }, [hasMore, loading, loadedIds]);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <div className="space-y-16 mt-16 border-t-2 border-emerald-600/30 pt-16">
      {articles.map((article) => (
        <article key={article.id} className="space-y-6 border-b border-gray-100 pb-16">
          {/* Article Header Divider */}
          <div className="flex items-center space-x-2 text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-full w-fit">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
            <span>Sıradaki Okuma Önerisi</span>
          </div>

          <div className="space-y-4">
            <nav className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-emerald-700">
              <Link href={`/kategori/${article.category.slug}`} className="hover:underline">
                {article.category.name}
              </Link>
              <span className="text-gray-300 font-normal">&bull;</span>
              <span className="text-gray-400 font-medium">{formatDate(article.publishedAt)}</span>
            </nav>

            <Link href={`/haber/${article.slug}`}>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight hover:text-emerald-700 transition">
                {article.title}
              </h2>
            </Link>

            <p className="text-lg text-gray-500 leading-relaxed font-medium italic border-l-4 border-emerald-600 pl-4 py-1">
              {article.summary}
            </p>
          </div>

          <ShareButtons title={article.title} />

          {/* Article Image */}
          {article.imageUrl && (
            <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-slate-950 border border-gray-100 flex items-center justify-center shadow-sm">
              <img
                src={article.imageUrl}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 w-full h-full object-cover filter blur-xl opacity-45 scale-110 select-none pointer-events-none"
              />
              <img
                src={article.imageUrl}
                alt={article.title}
                className="relative z-10 max-h-full max-w-full object-contain rounded-2xl"
              />
            </div>
          )}

          {/* In-Article Content & Ad Placement */}
          <InArticleAd content={article.content} adPlacement={inArticleAdPlacement} />
        </article>
      ))}

      {/* Infinite Scroll Trigger Sentinel */}
      <div ref={triggerRef} className="py-6 text-center">
        {loading && (
          <div className="flex items-center justify-center space-x-2 text-emerald-700 font-bold text-sm">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Sıradaki haber yükleniyor...</span>
          </div>
        )}

        {!hasMore && articles.length > 0 && (
          <p className="text-xs font-semibold text-gray-400">
            Tüm önerilen haberler görüntülendi.
          </p>
        )}
      </div>
    </div>
  );
}
