import SearchInput from "@/components/search-input";
import SortSelect from "@/components/sort-select";
import getTickets from "../queries/get-tickets";
import { ParsedSearchParams } from "../search-params";
import TicketItem from "./ticket-item";
import Pagination from "@/components/pagination";

type TicketListProps = {
  userId?: string;
  searchParams: ParsedSearchParams;
  byOrganization?: boolean;
};

const TicketList = async ({
  userId,
  searchParams,
  byOrganization = false,
}: TicketListProps) => {
  const { list: tickets, metadata: ticketMetadata } = await getTickets(
    userId,
    byOrganization,
    searchParams,
  );

  return (
    <div className="flex flex-1 flex-col items-center gap-y-4 animate-fade-from-top">
      <div className="w-full max-w-[420px] flex gap-x-2">
        <SearchInput placeholder="Search tickets..." />
        <SortSelect
          options={[
            {
              sortKey: "createdAt",
              sortValue: "desc",
              label: "Newest",
            },
            // need composite key to avoid duplicate keys in select items
            {
              sortKey: "createdAt",
              sortValue: "asc",
              label: "Oldest",
            },
            {
              sortKey: "bounty",
              sortValue: "desc",
              label: "Bounty",
            },
          ]}
        />
      </div>
      {tickets.length ? (
        tickets.map((ticket) => <TicketItem key={ticket.id} ticket={ticket} />)
      ) : (
        <p className="text-muted-foreground text-sm">No tickets found.</p>
      )}

      <div className="w-full max-w-[420px] flex gap-x-2">
        <Pagination paginatedMetadata={ticketMetadata} />
      </div>
    </div>
  );
};

export default TicketList;
