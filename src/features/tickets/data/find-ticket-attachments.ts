import prisma from "@/lib/prisma";

export const findTicketAttachments = async (id: string) => {
  return await prisma.attachment.findMany({
    where: {
      OR: [{ ticketId: id }, { comment: { ticketId: id } }],
    },
  });
};
