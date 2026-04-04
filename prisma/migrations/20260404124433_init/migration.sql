-- AlterTable
ALTER TABLE "Credential" ADD COLUMN     "createdById" TEXT;

-- AddForeignKey
ALTER TABLE "Credential" ADD CONSTRAINT "Credential_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
