import getAuth from "@/features/auth/actions/get-auth";
import isOwnership from "@/features/auth/utils/is-ownership";
import prisma from "@/lib/prisma";

const getComments = async (ticketId: string) => {
  const user = await getAuth();

  const comments = await prisma.comment.findMany({
    where: {
      ticketId,
    },
    include: {
      user: {
        select: {
          name: true,
          image: true,
        },
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  return comments.map((comment) => ({
    ...comment,
    isOwner: isOwnership(user, comment),
  }));
};

export default getComments;
