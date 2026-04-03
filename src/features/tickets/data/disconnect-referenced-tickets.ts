import prisma from "@/lib/prisma";

export const disconnectReferencedTickets = async (
  ticketId: string,
  referencedTicketIds: string[],
) => {
  if (!referencedTicketIds.length) return;
  await prisma.ticket.update({
    where: { id: ticketId },
    data: {
      referencedTicketId: null,
    },
  });
};
