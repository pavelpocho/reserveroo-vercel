-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "searchId" TEXT;

-- AlterTable
ALTER TABLE "Tag" ADD COLUMN     "searchId" TEXT;

-- CreateTable
CREATE TABLE "Search" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "phrase" TEXT NOT NULL,
    "locationId" TEXT,
    "userId" TEXT,

    CONSTRAINT "Search_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_SearchToTag" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_CategoryToSearch" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_SearchToTag_AB_unique" ON "_SearchToTag"("A", "B");

-- CreateIndex
CREATE INDEX "_SearchToTag_B_index" ON "_SearchToTag"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CategoryToSearch_AB_unique" ON "_CategoryToSearch"("A", "B");

-- CreateIndex
CREATE INDEX "_CategoryToSearch_B_index" ON "_CategoryToSearch"("B");

-- AddForeignKey
ALTER TABLE "Search" ADD CONSTRAINT "Search_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Search" ADD CONSTRAINT "Search_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SearchToTag" ADD CONSTRAINT "_SearchToTag_A_fkey" FOREIGN KEY ("A") REFERENCES "Search"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SearchToTag" ADD CONSTRAINT "_SearchToTag_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryToSearch" ADD CONSTRAINT "_CategoryToSearch_A_fkey" FOREIGN KEY ("A") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryToSearch" ADD CONSTRAINT "_CategoryToSearch_B_fkey" FOREIGN KEY ("B") REFERENCES "Search"("id") ON DELETE CASCADE ON UPDATE CASCADE;
