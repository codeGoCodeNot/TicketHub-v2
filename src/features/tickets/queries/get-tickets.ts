import { PAGE_SIZE_OPTIONS } from "@/components/pagination/constant";
import isOwnership from "@/features/auth/utils/is-ownership";
import getActiveOrganization from "@/features/organization/queries/get-active-organization";
import getAuth from "@/lib/get-auth";
import prisma from "@/lib/prisma";
import { ParsedSearchParams } from "../search-params";

const getTickets = async (
  userId: string | undefined,
  searchParams: ParsedSearchParams,
) => {
  const [user, activeOrganization] = await Promise.all([
    getAuth(),
    getActiveOrganization(),
  ]);

  if (!PAGE_SIZE_OPTIONS.includes(searchParams.size)) {
    throw new Error("Invalid page size");
  }

  const where = {
    userId,
    ...(searchParams.byOrganization && activeOrganization
      ? { organizationId: activeOrganization.id }
      : {}),
    title: {
      contains: searchParams.search,
      mode: "insensitive" as const,
    },
    OR: [{ private: false }, { private: true, userId: user?.id ?? "" }],
  };

  const skip = searchParams.page * searchParams.size;
  const take = searchParams.size;

  const [tickets, count] = await prisma.$transaction([
    prisma.ticket.findMany({
      where,
      skip,
      take,
      orderBy: {
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
    prisma.ticket.count({ where }),
  ]);

  // Batch-fetch memberships for all unique orgs to avoid N+1 per-ticket permission lookups
  const orgIds = [...new Set(tickets.map((t) => t.organizationId))];
  const memberships = await prisma.member.findMany({
    where: {
      userId: user?.id ?? "",
      organizationId: { in: orgIds },
    },
    select: {
      organizationId: true,
      canDeleteTickets: true,
      canUpdateTickets: true,
    },
  });
  const membershipMap = new Map(memberships.map((m) => [m.organizationId, m]));

  return {
    list: tickets.map((ticket) => {
      const membership = membershipMap.get(ticket.organizationId);
      const isOwner = isOwnership(user, ticket);
      return {
        ...ticket,
        isOwner,
        canDeleteTickets: !!membership?.canDeleteTickets,
        canUpdateTickets: !!membership?.canUpdateTickets,
      };
    }),
    metadata: { count, hasNextPage: count > skip + take },
  };
};

export default getTickets;
