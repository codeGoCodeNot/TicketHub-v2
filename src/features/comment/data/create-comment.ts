import prisma from "@/lib/prisma";

type CreateCommentArgs = {
  content: string;
  userId: string;
  ticketId: string;
};

export const createComment = async ({
  content,
  userId,
  ticketId,
}: CreateCommentArgs) => {
  return await prisma.comment.create({
    data: {
      userId,
      ticketId,
      content,
    },
    include: {
      user: {
        select: {
          name: true,
          image: true,
        },
      },
      ticket: true,
    },
  });
};
