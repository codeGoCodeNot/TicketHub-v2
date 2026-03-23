import getTickets from "@/features/tickets/queries/get-tickets";
import { searchParamsCache } from "@/features/tickets/search-params";

// public API route to fetch tickets without user authentication for testing purposes
export const GET = async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const untypedSearchParams = Object.fromEntries(searchParams);
  const typedSearchParams = searchParamsCache.parse(untypedSearchParams);

  const { list, metadata } = await getTickets(
    undefined,
    false,
    typedSearchParams,
  );

  return Response.json({ list, metadata });
};
