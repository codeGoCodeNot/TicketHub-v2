-- AlterTable
ALTER TABLE "Ticket" ADD COLUMN     "referencedTicketId" TEXT;

-- CreateIndex
CREATE INDEX "Ticket_referencedTicketId_idx" ON "Ticket"("referencedTicketId");

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_referencedTicketId_fkey" FOREIGN KEY ("referencedTicketId") REFERENCES "Ticket"("id") ON DELETE SET NULL ON UPDATE SET NULL;
