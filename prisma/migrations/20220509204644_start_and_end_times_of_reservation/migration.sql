/*
  Warnings:

  - Added the required column `end` to the `Reservation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `start` to the `Reservation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Reservation" ADD COLUMN     "end" TIME NOT NULL,
ADD COLUMN     "start" TIME NOT NULL;
