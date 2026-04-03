import { findTicketIdsFromText } from "@/features/comment/utils/find-ticket-id-from-text";
import { Comment } from "@/generated/prisma/client";
import prisma from "@/lib/prisma";

export const disconnectReferencedTicket = async (comment: Comment) => {
  const ticketId = comment.ticketId;
  const ticketIds = findTicketIdsFromText("tickets", comment.content);

  if (ticketIds.length === 0) return;

  const comments = await prisma.comment.findMany({
    where: {
      ticketId: comment.ticketId,
      id: { not: comment.id },
    },
  });

  const allOtherContent = comments.map((c) => c.content).join(" ");
  const allOtherTicketIds = findTicketIdsFromText("tickets", allOtherContent);
  const ticketIdsToDisconnect = ticketIds.filter(
    (ticketId) => !allOtherTicketIds.includes(ticketId),
  );

  await prisma.ticket.update({
    where: { id: ticketId },
    data: {
      referencedTickets: {
        disconnect: ticketIdsToDisconnect.map((id) => ({ id })),
      },
    },
  });
};
