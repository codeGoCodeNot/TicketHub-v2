import prisma from "@/lib/prisma";

// Query to fetch all tickets

const getTickets = async () => {
  return await prisma.ticket.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: {
          name: true,
        },
      },
    },
  });
};

export default getTickets;
