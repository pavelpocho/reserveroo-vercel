-- AlterTable
ALTER TABLE "Reservable" ADD COLUMN     "reservableTypeId" TEXT;

-- CreateTable
CREATE TABLE "ReservableType" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "multiLangNameId" TEXT,

    CONSTRAINT "ReservableType_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Reservable" ADD CONSTRAINT "Reservable_reservableTypeId_fkey" FOREIGN KEY ("reservableTypeId") REFERENCES "ReservableType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReservableType" ADD CONSTRAINT "ReservableType_multiLangNameId_fkey" FOREIGN KEY ("multiLangNameId") REFERENCES "MultilingualName"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
