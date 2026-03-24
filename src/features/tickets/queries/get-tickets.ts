import prisma from "@/lib/prisma";
import { ParsedSearchParams } from "../search-params";
import getAuth from "@/lib/get-auth";
import isOwnership from "@/features/auth/utils/is-ownership";
import getActiveOrganization from "@/features/organization/queries/get-active-organization";
import getMembership from "@/features/membership/queries/get-membership";
import getTicketPermission from "./get-ticket-permission";

// Query to fetch all tickets

const getTickets = async (
  userId: string | undefined,
  searchParams: ParsedSearchParams,
) => {
  const user = await getAuth();
  const activeOrganization = await getActiveOrganization();
  console.log("activeOrg:", activeOrganization?.id);
  console.log("byOrganization:", searchParams.byOrganization);

  const where = {
    userId,
    // search by title with case-insensitive matching
    ...(searchParams.byOrganization && activeOrganization
      ? { organizationId: activeOrganization.id }
      : {}),
    title: {
      contains: searchParams.search,
      mode: "insensitive" as const,
    },
  };

  // calculate skip and take for pagination
  const skip = searchParams.page * searchParams.size;
  const take = searchParams.size;

  const [tickets, count] = await prisma.$transaction([
    prisma.ticket.findMany({
      where,
      skip,
      take,
      // dynamic sorting based on sortKey and sortValue from searchParams
      orderBy: {
        // generic sorting based on sortKey and sortValue
        [searchParams.sortKey]: searchParams.sortValue,
      },
      include: {
        user: {
          select: {
            name: true,
            image: true,
          },
        },
      },
    }),
    prisma.ticket.count({
      where,
    }),
  ]);

  return {
    list: await Promise.all(
      tickets.map(async (ticket) => {
        const permissions = await getTicketPermission({
          organizationId: ticket.organizationId,
          userId: user?.id ?? "",
        });
        const isOwner = isOwnership(user, ticket);
        console.log({
          ticketId: ticket.id,
          userId: user?.id,
          organizationId: ticket.organizationId,
          isOwner,
          canDeleteTickets: permissions.canDeleteTickets,
        });
        return {
          ...ticket,
          isOwner,
          canDeleteTickets: isOwner || !!permissions.canDeleteTickets,
        };
      }),
    ),
    metadata: { count, hasNextPage: count > skip + take },
  };
};

export default getTickets;
