/*
  Warnings:

  - Added the required column `bounty` to the `Ticket` table without a default value. This is not possible if the table is not empty.
  - Added the required column `deadline` to the `Ticket` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Ticket" ADD COLUMN     "bounty" INTEGER NOT NULL,
ADD COLUMN     "deadline" TEXT NOT NULL;
