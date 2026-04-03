import prisma from "@/lib/prisma";

export const connnectReferencedTickets = async (
  ticketId: string,
  ticketIds: string[],
) => {
  // Find only existing ticket IDs
  const existingTickets = await prisma.ticket.findMany({
    where: { id: { in: ticketIds } },
    select: { id: true },
  });
  const existingIds = existingTickets.map((t) => t.id);

  if (existingIds.length === 0) return; // Nothing to connect

  await prisma.ticket.update({
    where: { id: ticketId },
    data: {
      referencedTickets: {
        connect: existingIds.map((id) => ({ id })),
      },
    },
  });
};
