-- CreateTable
CREATE TABLE "CredentialUsage" (
    "id" TEXT NOT NULL,
    "usedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "route" TEXT NOT NULL,
    "ipAddress" TEXT NOT NULL,
    "userAgent" TEXT NOT NULL,
    "credentialId" TEXT NOT NULL,

    CONSTRAINT "CredentialUsage_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CredentialUsage" ADD CONSTRAINT "CredentialUsage_credentialId_fkey" FOREIGN KEY ("credentialId") REFERENCES "Credential"("id") ON DELETE CASCADE ON UPDATE CASCADE;
