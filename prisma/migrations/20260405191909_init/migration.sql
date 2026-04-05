-- AlterTable
ALTER TABLE "Credential" ADD COLUMN     "scopes" TEXT NOT NULL DEFAULT 'delete:ticket';

-- CreateIndex
CREATE INDEX "Credential_createdById_idx" ON "Credential"("createdById");
