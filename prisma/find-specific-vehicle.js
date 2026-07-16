const { PrismaClient } = require('@prisma/client');
const db = new PrismaClient();

async function main() {
  const vehicle = await db.electricVehicle.findFirst({
    where: {
      id: { startsWith: "83c994d" }
    }
  });
  
  if (vehicle) {
    console.log("VEHICLE_FOUND_JSON:" + JSON.stringify(vehicle));
  } else {
    // List first 5 vehicles to see the format
    const list = await db.electricVehicle.findMany({ take: 5 });
    console.log("NOT_FOUND, sample list:", list.map(v => ({ id: v.id, brand: v.brand, model: v.model })));
  }
  
  await db.$disconnect();
}

main().catch(console.error);
