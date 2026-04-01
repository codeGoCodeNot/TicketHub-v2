import prisma from "@/lib/prisma";

export const findCommentWithTicket = async (id: string) => {
  return await prisma.comment.findUnique({
    where: {
      id,
    },
    include: {
      ticket: true,
    },
  });
};
