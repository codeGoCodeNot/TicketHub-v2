import prisma from "@/lib/prisma";

// Query to fetch all tickets

const getTickets = async (userId: string | undefined) => {
  return await prisma.ticket.findMany({
    where: {
      userId,
    },
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: {
          name: true,
          image: true,
        },
      },
    },
  });
};

export default getTickets;
