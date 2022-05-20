/*
  Warnings:

  - You are about to drop the column `placeId` on the `Reservation` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Reservation" DROP CONSTRAINT "Reservation_placeId_fkey";

-- AlterTable
ALTER TABLE "Reservation" DROP COLUMN "placeId",
ADD COLUMN     "reservableId" TEXT;

-- CreateTable
CREATE TABLE "Reservable" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "placeId" TEXT,

    CONSTRAINT "Reservable_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_reservableId_fkey" FOREIGN KEY ("reservableId") REFERENCES "Reservable"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reservable" ADD CONSTRAINT "Reservable_placeId_fkey" FOREIGN KEY ("placeId") REFERENCES "Place"("id") ON DELETE SET NULL ON UPDATE CASCADE;
