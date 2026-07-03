const { execSync } = require('child_process');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("=== Checking Database State for Automatic Seeding ===");
  try {
    const articleCount = await prisma.article.count();
    if (articleCount === 0) {
      console.log("Database is empty. Automatically seeding 16 real articles...");
      execSync('node prisma/seed-real-articles.js', { stdio: 'inherit' });
      console.log("Database seeded successfully!");
    } else {
      console.log(`Database already has ${articleCount} articles. Seeding skipped to protect production data.`);
    }
  } catch (e) {
    console.error("Database connection error or schema not pushed yet:", e.message);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch(console.error);
