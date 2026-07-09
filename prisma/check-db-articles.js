const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const count = await prisma.article.count();
  const articles = await prisma.article.findMany({
    include: { category: true },
    orderBy: { publishedAt: 'desc' },
    take: 5
  });
  console.log("Total database article count:", count);
  console.log("5 Most Recent Articles:");
  articles.forEach((art, i) => {
    console.log(`${i+1}. Title: "${art.title}"`);
    console.log(`   Slug: "${art.slug}"`);
    console.log(`   PublishedAt: ${art.publishedAt.toISOString()}`);
    console.log(`   CreatedAt: ${art.createdAt.toISOString()}`);
    console.log(`   Category: "${art.category.name}"`);
    console.log(`   isFeatured: ${art.isFeatured}`);
  });
  await prisma.$disconnect();
}

main().catch(console.error);
