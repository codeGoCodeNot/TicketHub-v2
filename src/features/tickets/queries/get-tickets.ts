import prisma from "@/lib/prisma";
import { ParsedSearchParams } from "../search-params";

// Query to fetch all tickets

const getTickets = async (
  userId: string | undefined,
  searchParams: ParsedSearchParams,
) => {
  return await prisma.ticket.findMany({
    where: {
      userId,
      // search by title with case-insensitive matching
      title: {
        contains: searchParams.search,
        mode: "insensitive",
      },
    },
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
};

export default getTickets;
