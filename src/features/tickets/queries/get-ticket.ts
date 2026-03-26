import isOwnership from "@/features/auth/utils/is-ownership";
import getAuth from "@/lib/get-auth";
import prisma from "@/lib/prisma";
import getTicketPermission from "./get-ticket-permission";

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

  const permission = await getTicketPermission({
    organizationId: ticket.organizationId,
    userId: user?.id ?? "",
  });

  return {
    ...ticket,
    isOwner: isOwnership(user, ticket),
    canDeleteTickets: !!permission.canDeleteTickets,
    canUpdateTickets: !!permission.canUpdateTickets,
  };
};

export default getTicket;
