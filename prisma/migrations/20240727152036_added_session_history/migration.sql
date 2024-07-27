/*
  Warnings:

  - You are about to drop the column `counter` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `toggle` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "counter",
DROP COLUMN "toggle",
ADD COLUMN     "currentSession" INTEGER;

-- CreateTable
CREATE TABLE "SessionHistory" (
    "id" SERIAL NOT NULL,
    "counter" INTEGER NOT NULL,
    "toggle" BOOLEAN NOT NULL,
    "expirationTime" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "SessionHistory_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SessionHistory" ADD CONSTRAINT "SessionHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
