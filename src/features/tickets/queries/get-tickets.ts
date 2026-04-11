import { PAGE_SIZE_OPTIONS } from "@/components/pagination/constant";
import isOwnership from "@/features/auth/utils/is-ownership";
import getActiveOrganization from "@/features/organization/queries/get-active-organization";
import getAuth from "@/lib/get-auth";
import prisma from "@/lib/prisma";
import { ParsedSearchParams } from "../search-params";
import getTicketPermission from "./get-ticket-permission";

// Query to fetch all tickets

const getTickets = async (
  userId: string | undefined,
  searchParams: ParsedSearchParams,
) => {
  const user = await getAuth();
  const activeOrganization = await getActiveOrganization();

  if (!PAGE_SIZE_OPTIONS.includes(searchParams.size)) {
    throw new Error("Invalid page size");
  }

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
    OR: [{ private: false }, { private: true, userId: user?.id ?? "" }],
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

        return {
          ...ticket,
          isOwner,
          canDeleteTickets: !!permissions.canDeleteTickets,
          canUpdateTickets: !!permissions.canUpdateTickets,
        };
      }),
    ),
    metadata: { count, hasNextPage: count > skip + take },
  };
};

export default getTickets;
