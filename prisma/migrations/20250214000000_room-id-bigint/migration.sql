-- CreateTable
CREATE TABLE "Plant" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "species" TEXT,
  "roomId" BIGINT,
  "imageUrl" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "waterEvery" TEXT,
  "waterAmount" TEXT,
  "fertEvery" TEXT,
  "fertFormula" TEXT,
  "humidity" TEXT,
  "archived" BOOLEAN NOT NULL DEFAULT false,

  CONSTRAINT "Plant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Room" (
  "id" BIGSERIAL NOT NULL,
  "name" TEXT NOT NULL,

  CONSTRAINT "Room_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CareEvent" (
  "id" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "date" TIMESTAMP(3) NOT NULL,
  "plantId" TEXT NOT NULL,

  CONSTRAINT "CareEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Note" (
  "id" TEXT NOT NULL,
  "content" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "plantId" TEXT NOT NULL,

  CONSTRAINT "Note_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Photo" (
  "id" TEXT NOT NULL,
  "url" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "plantId" TEXT NOT NULL,

  CONSTRAINT "Photo_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Plant" ADD CONSTRAINT "Plant_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CareEvent" ADD CONSTRAINT "CareEvent_plantId_fkey" FOREIGN KEY ("plantId") REFERENCES "Plant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_plantId_fkey" FOREIGN KEY ("plantId") REFERENCES "Plant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Photo" ADD CONSTRAINT "Photo_plantId_fkey" FOREIGN KEY ("plantId") REFERENCES "Plant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
