import prisma from "@/lib/prisma";

// Query to fetch a single ticket by its ID

const getTicket = async (id: string) => {
  return await prisma.ticket.findUnique({
    where: {
      id,
    },
    include: {
      user: {
        select: {
          name: true,
        },
      },
    },
  });
};

export default getTicket;
