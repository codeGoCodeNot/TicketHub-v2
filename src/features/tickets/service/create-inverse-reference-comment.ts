import prisma from "@/lib/prisma";

export const createInverseReferenceComment = async (
  sourceTicketId: string,
  referencedTicketIds: string[],
  userId: string,
) => {
  if (!referencedTicketIds.length) return;

  const sourceTicket = await prisma.ticket.findUnique({
    where: { id: sourceTicketId },
    select: { title: true },
  });

  if (!sourceTicket) return;

  await prisma.comment.createMany({
    data: referencedTicketIds.map((referencedTicketId) => ({
      ticketId: referencedTicketId,
      userId,
      content: `This ticket is referenced by "${sourceTicket.title}".`,
    })),
    skipDuplicates: true,
  });
};
