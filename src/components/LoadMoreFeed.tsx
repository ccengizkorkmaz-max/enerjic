"use client";

import { useState } from 'react';
import { getArticlesAction } from '@/app/actions/articles';
import ArticleFeed from './ArticleFeed';
import { Loader2 } from 'lucide-react';

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

interface LoadMoreFeedProps {
  initialArticles: Article[];
  categoryId?: string;
  excludeIds?: string[];
  searchQuery?: string;
  limit?: number;
}

export default function LoadMoreFeed({
  initialArticles,
  categoryId,
  excludeIds = [],
  searchQuery = '',
  limit = 5,
}: LoadMoreFeedProps) {
  const [articles, setArticles] = useState<Article[]>(initialArticles);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialArticles.length >= limit);

  const handleLoadMore = async () => {
    if (loading) return;
    setLoading(true);

    const currentOffset = articles.length;
    const res = await getArticlesAction(currentOffset, limit, categoryId, excludeIds, searchQuery);

    if (res.success && res.articles) {
      const newArticles = res.articles.map((art: any) => ({
        ...art,
        publishedAt: new Date(art.publishedAt),
      }));

      setArticles((prev) => [...prev, ...newArticles]);

      if (newArticles.length < limit) {
        setHasMore(false);
      }
    } else {
      setHasMore(false);
    }
    setLoading(false);
  };

  return (
    <div className="space-y-8">
      <ArticleFeed articles={articles} />

      {hasMore && (
        <div className="flex justify-center pt-4">
          <button
            onClick={handleLoadMore}
            disabled={loading}
            className="inline-flex items-center justify-center bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 hover:text-emerald-700 font-extrabold px-6 py-3 rounded-2xl text-sm transition-all duration-200 shadow-sm disabled:opacity-50 cursor-pointer group"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin text-emerald-600" />
                Yükleniyor...
              </>
            ) : (
              <>
                Daha Fazla Yükle
                <svg
                  className="ml-1.5 w-4 h-4 text-gray-400 group-hover:text-emerald-600 group-hover:translate-y-0.5 transition-all"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
