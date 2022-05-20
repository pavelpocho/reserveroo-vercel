-- AlterTable
ALTER TABLE "CompanyIdentity" ADD COLUMN     "salt" TEXT NOT NULL DEFAULT E'';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "salt" TEXT NOT NULL DEFAULT E'';
