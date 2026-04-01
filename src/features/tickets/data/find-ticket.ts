import prisma from "@/lib/prisma";

export const findTicket = async (id: string) => {
  return await prisma.ticket.findUnique({
    where: {
      id,
    },
  });
};
