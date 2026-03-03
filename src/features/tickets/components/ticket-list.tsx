import SearchInput from "@/components/search-input";
import SortSelect from "@/components/sort-select";
import getTickets from "../queries/get-tickets";
import { ParsedSearchParams } from "../search-params";
import TicketItem from "./ticket-item";

type TicketListProps = {
  userId?: string;
  searchParams: ParsedSearchParams;
};

const TicketList = async ({ userId, searchParams }: TicketListProps) => {
  const tickets = await getTickets(userId, searchParams);

  return (
    <div className="flex flex-1 flex-col items-center gap-y-4 animate-fade-from-top">
      <div className="w-full max-w-[420px] flex gap-x-2">
        <SearchInput placeholder="Search tickets..." />
        <SortSelect
          options={[
            { label: "Newest", value: "newest" },
            { label: "Bounty", value: "bounty" },
          ]}
        />
      </div>
      {tickets.length === 0 ? (
        <p className="text-muted-foreground text-sm">No tickets found.</p>
      ) : (
        tickets.map((ticket) => <TicketItem key={ticket.id} ticket={ticket} />)
      )}
    </div>
  );
};

export default TicketList;
