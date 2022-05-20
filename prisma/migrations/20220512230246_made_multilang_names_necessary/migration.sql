/*
  Warnings:

  - Made the column `multilingualNameId` on table `Category` required. This step will fail if there are existing NULL values in that column.
  - Made the column `multiLangDescId` on table `Tag` required. This step will fail if there are existing NULL values in that column.
  - Made the column `multiLangNameId` on table `Tag` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Category" ALTER COLUMN "multilingualNameId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Tag" ALTER COLUMN "multiLangDescId" SET NOT NULL,
ALTER COLUMN "multiLangNameId" SET NOT NULL;
