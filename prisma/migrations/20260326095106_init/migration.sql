-- AlterTable
ALTER TABLE "member" ADD COLUMN     "canUpdateTickets" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "canDeleteTickets" SET DEFAULT false;
