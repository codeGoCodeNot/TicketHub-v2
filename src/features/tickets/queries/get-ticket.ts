import getAuth from "@/features/auth/actions/get-auth";
import isOwnership from "@/features/auth/utils/is-ownership";
import prisma from "@/lib/prisma";

// Query to fetch a single ticket by its ID

const getTicket = async (id: string) => {
  const user = await getAuth();

  const ticket = await prisma.ticket.findUnique({
    where: {
      id,
    },
    include: {
      user: {
        select: {
          name: true,
          image: true,
        },
      },
    },
  });

  if (!ticket) return null;

  return {
    ...ticket,
    isOwner: isOwnership(user, ticket),
  };
};

export default getTicket;
