-- AlterTable
ALTER TABLE "User" ADD COLUMN     "verifyEmailTriesLeft" INTEGER NOT NULL DEFAULT 3;
