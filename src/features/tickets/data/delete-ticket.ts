import prisma from "@/lib/prisma";

export const deleteTicket = async (id: string) => {
  return await prisma.ticket.delete({
    where: {
      id,
    },
  });
};
