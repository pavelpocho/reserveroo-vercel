/*
  Warnings:

  - A unique constraint covering the columns `[cityCountry]` on the table `Location` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `cityCountry` to the `Location` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Location_country_key";

-- AlterTable
ALTER TABLE "Location" ADD COLUMN     "cityCountry" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Location_cityCountry_key" ON "Location"("cityCountry");
