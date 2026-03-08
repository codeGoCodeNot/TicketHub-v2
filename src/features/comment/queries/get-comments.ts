"use server";

import getAuth from "@/features/auth/actions/get-auth";
import isOwnership from "@/features/auth/utils/is-ownership";
import prisma from "@/lib/prisma";

const getComments = async (ticketId: string, offset?: number) => {
  const user = await getAuth();

  const where = {
    ticketId,
  };

  const skip = offset ?? 0;
  const take = 2;

  const [comments, count] = await prisma.$transaction([
    prisma.comment.findMany({
      where,
      skip,
      take,
      include: {
        user: {
          select: {
            name: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    }),

    prisma.comment.count({
      where,
    }),
  ]);

  return {
    list: comments.map((comment) => ({
      ...comment,
      isOwner: isOwnership(user, comment),
    })),
    metadata: {
      count,
      hasMore: count > skip + take,
    },
  };
};

export default getComments;
