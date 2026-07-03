"use server";

import { db } from '@/lib/db';

export async function getArticlesAction(
  offset: number,
  limit: number,
  categoryId?: string,
  excludeIds?: string[],
  searchQuery?: string
) {
  try {
    const whereClause: any = {};

    if (categoryId) {
      whereClause.categoryId = categoryId;
    }

    if (excludeIds && excludeIds.length > 0) {
      whereClause.id = {
        notIn: excludeIds,
      };
    }

    if (searchQuery && searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      whereClause.OR = [
        { title: { contains: q } },
        { summary: { contains: q } },
        { content: { contains: q } },
      ];
    }

    const articles = await db.article.findMany({
      where: whereClause,
      include: { category: true },
      orderBy: { publishedAt: 'desc' },
      skip: offset,
      take: limit,
    });

    return { success: true, articles };
  } catch (e: any) {
    console.error('Error fetching paginated articles: ', e);
    return { success: false, error: e.message, articles: [] };
  }
}
