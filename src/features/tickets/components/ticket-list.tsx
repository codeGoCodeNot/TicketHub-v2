import Pagination from "@/components/pagination/pagination";
import { Separator } from "@/components/ui/separator";
import OrganizationTicketFilter from "@/features/tickets/utils/organization-ticket-filter";
import SearchInput from "@/features/tickets/utils/search-input";
import SortSelect from "@/features/tickets/utils/sort-select";
import { LucideInbox } from "lucide-react";
import getTickets from "../queries/get-tickets";
import { ParsedSearchParams } from "../search-params";
import TicketItem from "./ticket-item";

type TicketListProps = {
  userId?: string;
  searchParams: ParsedSearchParams;
  showOrganizationFilter?: boolean;
};

const TicketList = async ({
  userId,
  searchParams,
  showOrganizationFilter = false,
}: TicketListProps) => {
  const { list: tickets, metadata: ticketMetadata } = await getTickets(
    userId,
    searchParams,
  );

  return (
    <div className="flex flex-1 flex-col items-center gap-y-4 animate-fade-from-top">
      <div className="w-full max-w-[640px] flex flex-col gap-y-3">
        <div className="flex gap-x-2">
          <SearchInput placeholder="Search tickets..." />
          <SortSelect
            options={[
              {
                sortKey: "createdAt",
                sortValue: "desc",
                label: "Newest",
              },
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
        {showOrganizationFilter && <OrganizationTicketFilter />}
      </div>

      <Separator className="w-full max-w-[640px]" />

      {tickets.length ? (
        <div className="flex flex-col w-full items-center gap-y-3">
          {tickets.map((ticket) => (
            <TicketItem key={ticket.id} ticket={ticket} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-y-2 py-16 text-center">
          <div className="rounded-full bg-muted p-3 mb-1">
            <LucideInbox className="size-5 text-muted-foreground" />
          </div>
          <p className="text-sm font-medium">No tickets found</p>
          <p className="text-xs text-muted-foreground">
            Try adjusting your search or filters
          </p>
        </div>
      )}

      <div className="w-full max-w-[640px]">
        <Pagination paginatedMetadata={ticketMetadata} />
      </div>
    </div>
  );
};

export default TicketList;
