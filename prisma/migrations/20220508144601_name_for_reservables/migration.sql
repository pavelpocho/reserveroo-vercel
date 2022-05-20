/*
  Warnings:

  - Added the required column `name` to the `Reservable` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Reservable" ADD COLUMN     "name" TEXT NOT NULL;
