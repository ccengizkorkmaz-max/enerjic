import { db } from '@/lib/db';
import CreateArticleForm from '@/components/CreateArticleForm';

export const dynamic = 'force-dynamic';

export default async function AddArticlePage() {
  let categories: any[] = [];
  try {
    categories = await db.category.findMany({
      orderBy: { name: 'asc' },
    });
  } catch (e) {
    console.error('Error fetching categories for article creation: ', e);
  }

  return <CreateArticleForm categories={categories} />;
}
