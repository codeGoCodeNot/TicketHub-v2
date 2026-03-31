"use server";

import isOwnership from "@/features/auth/utils/is-ownership";
import getAuth from "@/lib/get-auth";
import prisma from "@/lib/prisma";
import { unstable_noStore as noStore } from "next/cache";

const getComments = async (
  ticketId: string,
  cursor?: {
    id: string;
    createdAt: number;
  },
) => {
  // This function is only used in the ticket details page, which is already server-side rendered.
  // We can safely use noStore here to prevent caching and ensure fresh data on each request.
  noStore();

  const user = await getAuth();

  const where = {
    ticketId,
  };

  const take = 2;

  let [comments, count] = await prisma.$transaction([
    prisma.comment.findMany({
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
    }),

    prisma.comment.count({
      where,
    }),
  ]);

  const hasNextPage = comments.length > take;

  // Remove the extra comment used to check for the next page
  comments = hasNextPage ? comments.slice(0, -1) : comments;

  // Get the last comment for the next page cursor
  const lastComment = comments.at(-1);

  return {
    list: comments.map((comment) => ({
      ...comment,
      isOwner: isOwnership(user, comment),
    })),
    metadata: {
      count,
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
