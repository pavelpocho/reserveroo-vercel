/*
  Warnings:

  - Changed the type of `day` on the `OpeningTime` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "OpeningTime" DROP COLUMN "day",
ADD COLUMN     "day" INTEGER NOT NULL;
