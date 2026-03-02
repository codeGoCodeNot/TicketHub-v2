import prisma from "@/lib/prisma";
import { SearchParams } from "../search-params";

// Query to fetch all tickets

const getTickets = async (
  userId: string | undefined,
  searchParams: SearchParams,
) => {
  console.log(searchParams.sort);

  return await prisma.ticket.findMany({
    where: {
      userId,
      title: {
        contains: searchParams.search,
        mode: "insensitive",
      },
    },
    orderBy: {
      ...(searchParams.sort === undefined && { createdAt: "desc" }),
      ...(searchParams.sort === "bounty" && { bounty: "desc" }),
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
