/*
  Warnings:

  - Added the required column `entity` to the `Attachment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `size` to the `Attachment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Attachment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Attachment` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "AttachmentEntity" AS ENUM ('TICKET', 'COMMENT');

-- AlterTable
ALTER TABLE "Attachment" ADD COLUMN     "entity" "AttachmentEntity" NOT NULL,
ADD COLUMN     "size" INTEGER NOT NULL,
ADD COLUMN     "type" TEXT NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "Attachment_userId_idx" ON "Attachment"("userId");

-- AddForeignKey
ALTER TABLE "Attachment" ADD CONSTRAINT "Attachment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
