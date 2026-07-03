const { execSync } = require('child_process');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("=== Running Database Force Initialization ===");
  try {
    console.log("Force seeding 16 real articles (with Pexels images)...");
    execSync('node prisma/seed-real-articles.js', { stdio: 'inherit' });
    console.log("Articles seeded successfully!");

    console.log("Force seeding 1375 real vehicles (EV Catalog)...");
    execSync('node prisma/load-real-evs.js', { stdio: 'inherit' });
    console.log("EV Catalog seeded successfully!");

    console.log("Force seeding charging stations...");
    execSync('node prisma/seed-stations.js', { stdio: 'inherit' });
    console.log("Charging stations seeded successfully!");
    
    console.log("Database fully initialized with all seed data!");
  } catch (e) {
    console.error("Database connection error during initialization:", e.message);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch(console.error);
