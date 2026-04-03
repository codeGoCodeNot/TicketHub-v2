import prisma from "@/lib/prisma";

const getReferencedTickets = async (ticketId: string) => {
  const ticket = await prisma.ticket.findUnique({
    where: { id: ticketId },
    include: {
      referencedTicket: {
        select: {
          id: true,
          title: true,
          status: true,
        },
      },
      referencedTickets: {
        select: {
          id: true,
          title: true,
          status: true,
        },
      },
    },
  });

  return {
    referencedTicket: ticket?.referencedTicket ?? null,
    referencingTickets: ticket?.referencedTickets ?? [],
  };
};

export default getReferencedTickets;
