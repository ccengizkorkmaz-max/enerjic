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
      console.log("Database articles seeded successfully!");

      console.log("Automatically seeding 1375 real vehicles (EV Catalog)...");
      execSync('node prisma/load-real-evs.js', { stdio: 'inherit' });
      console.log("EV Catalog seeded successfully!");

      console.log("Mapping and filling correct local/remote image URLs for vehicles...");
      execSync('node prisma/fill-all-image-urls.js', { stdio: 'inherit' });
      console.log("Vehicle image mapping completed!");

      console.log("Automatically seeding charging stations...");
      execSync('node prisma/seed-stations.js', { stdio: 'inherit' });
      console.log("Charging stations seeded successfully!");
      
      console.log("Database fully initialized with all seed data!");
    } else {
      console.log(`Database already has ${articleCount} articles. Seeding skipped to protect production data.`);
    }

    // Always run the new SaaS articles addition script to ensure they are added safely if missing
    console.log("Checking and adding new SaaS articles...");
    execSync('node prisma/add-saas-articles.js', { stdio: 'inherit' });
  } catch (e) {
    console.error("Database connection error or schema not pushed yet:", e.message);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch(console.error);
