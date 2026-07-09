const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const sample = await prisma.electricVehicle.findFirst({
    select: { id: true, imageUrl: true, brand: true, model: true },
  });
  console.log('Sample DB vehicle:', JSON.stringify(sample, null, 2));

  const count = await prisma.electricVehicle.count();
  console.log('Total vehicles:', count);

  // Check how many have unsplash/placeholder URLs
  const withUnsplash = await prisma.electricVehicle.count({
    where: { imageUrl: { contains: 'unsplash' } },
  });
  console.log('With unsplash URLs:', withUnsplash);

  const withImgbb = await prisma.electricVehicle.count({
    where: { imageUrl: { contains: 'ibb.co' } },
  });
  console.log('With ImgBB URLs:', withImgbb);

  await prisma.$disconnect();
}

main().catch(console.error);
