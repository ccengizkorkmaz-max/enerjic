import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import EditArticleForm from '@/components/EditArticleForm';

interface PageProps {
  params: Promise<{ id: string }>;
}

export const dynamic = 'force-dynamic';

export default async function EditArticlePage({ params }: PageProps) {
  const { id } = await params;

  let article = null;
  try {
    article = await db.article.findUnique({
      where: { id },
    });
  } catch (e) {
    console.error('Error fetching article for editing: ', e);
  }

  if (!article) {
    notFound();
  }

  let categories: any[] = [];
  try {
    categories = await db.category.findMany({
      orderBy: { name: 'asc' },
    });
  } catch (e) {
    console.error('Error fetching categories: ', e);
  }

  return <EditArticleForm article={article} categories={categories} />;
}
