-- DropForeignKey
ALTER TABLE "Reservation" DROP CONSTRAINT "Reservation_reservableId_fkey";

-- CreateTable
CREATE TABLE "OpeningTime" (
    "id" TEXT NOT NULL,
    "open" TIME NOT NULL,
    "close" TIME NOT NULL,
    "placeId" TEXT,
    "day" TEXT NOT NULL,

    CONSTRAINT "OpeningTime_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_reservableId_fkey" FOREIGN KEY ("reservableId") REFERENCES "Reservable"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OpeningTime" ADD CONSTRAINT "OpeningTime_placeId_fkey" FOREIGN KEY ("placeId") REFERENCES "Place"("id") ON DELETE CASCADE ON UPDATE CASCADE;
