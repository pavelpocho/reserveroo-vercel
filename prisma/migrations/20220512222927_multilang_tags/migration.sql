-- AlterTable
ALTER TABLE "Tag" ADD COLUMN     "multiLangDescId" TEXT,
ADD COLUMN     "multiLangNameId" TEXT,
ALTER COLUMN "name" DROP NOT NULL,
ALTER COLUMN "description" DROP NOT NULL;

-- CreateTable
CREATE TABLE "MultilingualName" (
    "id" TEXT NOT NULL,
    "czech" TEXT NOT NULL,
    "english" TEXT NOT NULL,

    CONSTRAINT "MultilingualName_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MultilingualDesc" (
    "id" TEXT NOT NULL,
    "czech" TEXT NOT NULL,
    "english" TEXT NOT NULL,

    CONSTRAINT "MultilingualDesc_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Tag" ADD CONSTRAINT "Tag_multiLangNameId_fkey" FOREIGN KEY ("multiLangNameId") REFERENCES "MultilingualName"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tag" ADD CONSTRAINT "Tag_multiLangDescId_fkey" FOREIGN KEY ("multiLangDescId") REFERENCES "MultilingualDesc"("id") ON DELETE CASCADE ON UPDATE CASCADE;
