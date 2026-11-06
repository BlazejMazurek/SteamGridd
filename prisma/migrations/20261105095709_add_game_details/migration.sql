/*
  Warnings:

  - A unique constraint covering the columns `[title]` on the table `Game` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Game" ADD COLUMN     "description" TEXT,
ADD COLUMN     "developer" TEXT;

-- AlterTable
ALTER TABLE "Review" ALTER COLUMN "rating" SET DATA TYPE DOUBLE PRECISION;

-- CreateIndex
CREATE UNIQUE INDEX "Game_title_key" ON "Game"("title");
