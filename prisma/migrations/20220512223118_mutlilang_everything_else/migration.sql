-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "multilingualNameId" TEXT,
ALTER COLUMN "name" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Location" ADD COLUMN     "multilingualNameId" TEXT;

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_multilingualNameId_fkey" FOREIGN KEY ("multilingualNameId") REFERENCES "MultilingualName"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Location" ADD CONSTRAINT "Location_multilingualNameId_fkey" FOREIGN KEY ("multilingualNameId") REFERENCES "MultilingualName"("id") ON DELETE CASCADE ON UPDATE CASCADE;
