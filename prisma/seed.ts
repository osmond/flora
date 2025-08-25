import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.careEvent.deleteMany();
  await prisma.photo.deleteMany();
  await prisma.note.deleteMany();
  await prisma.plant.deleteMany();
  await prisma.room.deleteMany();

  // Create rooms
  const livingRoom = await prisma.room.create({
    data: { name: "Living Room" },
  });
  const kitchen = await prisma.room.create({
    data: { name: "Kitchen" },
  });

  // Create plants
  await prisma.plant.create({
    data: {
      nickname: "Fiona the Fern",
      speciesScientific: "Nephrolepis exaltata",
      roomId: livingRoom.id,
      waterEvery: "7 days",
      waterAmount: "250ml",
      fertEvery: "30 days",
      fertFormula: "10-10-10",
      humidity: "medium",
      careEvents: {
        create: [
          { type: "water", date: new Date() },
        ],
      },
    },
  });

  await prisma.plant.create({
    data: {
      nickname: "Spike",
      speciesScientific: "Carnegiea gigantea",
      roomId: kitchen.id,
      waterEvery: "14 days",
      humidity: "low",
      careEvents: {
        create: [
          { type: "water", date: new Date() },
        ],
      },
    },
  });

  console.log(`Seeded ${await prisma.room.count()} rooms and ${await prisma.plant.count()} plants.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

