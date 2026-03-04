import prisma from "@/lib/prisma";
import { ParsedSearchParams } from "../search-params";

// Query to fetch all tickets

const getTickets = async (
  userId: string | undefined,
  searchParams: ParsedSearchParams,
) => {
  const where = {
    userId,
    // search by title with case-insensitive matching
    title: {
      contains: searchParams.search,
      mode: "insensitive" as const,
    },
  };

  // calculate skip and take for pagination and count total tickets for pagination metadata
  const skip = searchParams.page * searchParams.size;
  const take = searchParams.size;
  const count = await prisma.ticket.count({ where });

  const tickets = await prisma.ticket.findMany({
    where,
    skip,
    take,
    // dynamic sorting based on sortKey and sortValue from searchParams
    orderBy: {
      [searchParams.sortKey]: searchParams.sortValue,
      // generic sorting based on sortKey and sortValue
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

  return {
    list: tickets,
    metadata: { count, hasNextPage: count > skip + take },
  };
};

export default getTickets;
