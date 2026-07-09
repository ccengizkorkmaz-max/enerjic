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

    // Always run the new articles script to insert our latest 4 AdSense-optimized articles
    console.log("Checking and adding new AdSense-optimized articles...");
    execSync('node prisma/seed-new-articles.js', { stdio: 'inherit' });

    // Always run the TechCrunch articles addition script
    console.log("Checking and adding TechCrunch climate articles...");
    execSync('node prisma/add-techcrunch-articles.js', { stdio: 'inherit' });

    // Always run the user articles addition script
    console.log("Checking and adding user-provided articles...");
    execSync('node prisma/add-user-articles.js', { stdio: 'inherit' });

    // Always run the electric motorcycle articles addition script
    console.log("Checking and adding electric motorcycle articles...");
    execSync('node prisma/add-motorcycle-articles.js', { stdio: 'inherit' });

    // Always run the EV battery fire article seed script
    console.log("Checking and adding EV battery fire article...");
    execSync('node prisma/add-ev-fire-article.js', { stdio: 'inherit' });

    // Always run the EV software updates seed script
    console.log("Checking and adding EV software updates...");
    execSync('node prisma/seed-software-updates.js', { stdio: 'inherit' });
  } catch (e) {
    console.error("Database connection error or schema not pushed yet:", e.message);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch(console.error);
