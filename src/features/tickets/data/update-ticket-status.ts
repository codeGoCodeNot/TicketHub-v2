import { TicketStatus } from "@/generated/prisma/enums";
import prisma from "@/lib/prisma";

export const updateTicketStatus = async (id: string, status: TicketStatus) => {
  return await prisma.ticket.update({
    where: {
      id,
    },
    data: { status },
  });
};
