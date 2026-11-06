/*
  Warnings:

  - You are about to drop the column `developer` on the `Game` table. All the data in the column will be lost.
  - You are about to drop the column `genre` on the `Game` table. All the data in the column will be lost.
  - You are about to drop the column `publisher` on the `Game` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Game" DROP COLUMN "developer",
DROP COLUMN "genre",
DROP COLUMN "publisher",
ADD COLUMN     "developerId" INTEGER,
ADD COLUMN     "publisherId" INTEGER;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "favoriteGenreId" INTEGER;

-- CreateTable
CREATE TABLE "Developer" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Developer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Publisher" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Publisher_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Genre" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Genre_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserGame" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "gameId" INTEGER NOT NULL,
    "isPlayed" BOOLEAN NOT NULL DEFAULT false,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "isLiked" BOOLEAN NOT NULL DEFAULT false,
    "isQueued" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "UserGame_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_GameGenres" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_UserFavoriteGames" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Developer_name_key" ON "Developer"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Publisher_name_key" ON "Publisher"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Genre_name_key" ON "Genre"("name");

-- CreateIndex
CREATE UNIQUE INDEX "UserGame_userId_gameId_key" ON "UserGame"("userId", "gameId");

-- CreateIndex
CREATE UNIQUE INDEX "_GameGenres_AB_unique" ON "_GameGenres"("A", "B");

-- CreateIndex
CREATE INDEX "_GameGenres_B_index" ON "_GameGenres"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_UserFavoriteGames_AB_unique" ON "_UserFavoriteGames"("A", "B");

-- CreateIndex
CREATE INDEX "_UserFavoriteGames_B_index" ON "_UserFavoriteGames"("B");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_favoriteGenreId_fkey" FOREIGN KEY ("favoriteGenreId") REFERENCES "Genre"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_developerId_fkey" FOREIGN KEY ("developerId") REFERENCES "Developer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_publisherId_fkey" FOREIGN KEY ("publisherId") REFERENCES "Publisher"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserGame" ADD CONSTRAINT "UserGame_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserGame" ADD CONSTRAINT "UserGame_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GameGenres" ADD CONSTRAINT "_GameGenres_A_fkey" FOREIGN KEY ("A") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GameGenres" ADD CONSTRAINT "_GameGenres_B_fkey" FOREIGN KEY ("B") REFERENCES "Genre"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserFavoriteGames" ADD CONSTRAINT "_UserFavoriteGames_A_fkey" FOREIGN KEY ("A") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserFavoriteGames" ADD CONSTRAINT "_UserFavoriteGames_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
