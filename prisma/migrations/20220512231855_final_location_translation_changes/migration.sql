/*
  Warnings:

  - You are about to drop the column `multilingualNameId` on the `Location` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Location" DROP CONSTRAINT "Location_multilingualNameId_fkey";

-- AlterTable
ALTER TABLE "Location" DROP COLUMN "multilingualNameId",
ADD COLUMN     "multilingualCityId" TEXT,
ADD COLUMN     "multilingualCountryId" TEXT;

-- AddForeignKey
ALTER TABLE "Location" ADD CONSTRAINT "Location_multilingualCountryId_fkey" FOREIGN KEY ("multilingualCountryId") REFERENCES "MultilingualName"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Location" ADD CONSTRAINT "Location_multilingualCityId_fkey" FOREIGN KEY ("multilingualCityId") REFERENCES "MultilingualDesc"("id") ON DELETE CASCADE ON UPDATE CASCADE;
