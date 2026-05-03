"use server";

import isOwnership from "@/features/auth/utils/is-ownership";
import getAuth from "@/lib/get-auth";
import prisma from "@/lib/prisma";

const getComments = async (
  ticketId: string,
  cursor?: {
    id: string;
    createdAt: number;
  },
) => {
  const user = await getAuth();

  const where = {
    ticketId,
  };

  const take = 2;

  let comments = await prisma.comment.findMany({
    where,
    take: take + 1,
    cursor: cursor
      ? { createdAt: new Date(cursor.createdAt), id: cursor.id }
      : undefined,
    skip: cursor ? 1 : 0,
    include: {
      user: {
        select: {
          name: true,
          image: true,
        },
      },
      attachments: true,
    },
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
  });

  const hasNextPage = comments.length > take;

  comments = hasNextPage ? comments.slice(0, -1) : comments;

  const lastComment = comments.at(-1);

  return {
    list: comments.map((comment) => ({
      ...comment,
      isOwner: isOwnership(user, comment),
    })),
    metadata: {
      hasNextPage,
      cursor: lastComment
        ? {
            id: lastComment.id,
            createdAt: lastComment.createdAt.valueOf(),
          }
        : undefined,
    },
  };
};

export default getComments;
