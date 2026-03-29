import prisma from "@/lib/prisma";

const getAttachments = async (ticketId: string) => {
  return await prisma.attachment.findMany({
    where: { ticketId },
  });
};

export default getAttachments;
