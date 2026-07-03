const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const articles = await prisma.article.findMany({
    include: { category: true },
    take: 1
  });
  console.log("Database article count:", await prisma.article.count());
  console.log("First article details:");
  console.log({
    title: articles[0].title,
    slug: articles[0].slug,
    contentPreview: articles[0].content.slice(0, 1000)
  });
  await prisma.$disconnect();
}

main().catch(console.error);
