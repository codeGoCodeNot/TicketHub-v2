import { Prisma } from "@/generated/prisma/client";
import prisma from "@/lib/prisma";

type CreateCommentArgs<T> = {
  content: string;
  userId: string;
  ticketId: string;
  include: Prisma.Subset<T, Prisma.CommentInclude>;
};

export const createComment = async <T extends Prisma.CommentSelect>({
  content,
  userId,
  ticketId,
  include,
}: CreateCommentArgs<T>) => {
  return await prisma.comment.create({
    data: {
      userId,
      ticketId,
      content,
    },
    include,
  });
};
