-- CreateIndex
CREATE INDEX "CredentialUsage_credentialId_idx" ON "CredentialUsage"("credentialId");

-- CreateIndex
CREATE INDEX "Ticket_userId_createdAt_idx" ON "Ticket"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "Ticket_organizationId_createdAt_idx" ON "Ticket"("organizationId", "createdAt");

-- CreateIndex
CREATE INDEX "member_organizationId_userId_idx" ON "member"("organizationId", "userId");
