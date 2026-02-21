import Heading from "@/components/heading";
import TicketItem from "@/features/tickets/components/ticket-item";
import { initialData } from "../../data";

const TicketsPage = () => {
  return (
    <div className="flex flex-col gap-y-8 flex-1">
      <Heading
        title="Tickets Page"
        description="All your tickets at one place"
      />

      <div className="flex flex-1 flex-col self-center items-center gap-y-4 animate-fade-from-top">
        {initialData.tickets.map((ticket) => (
          <TicketItem key={ticket.id} ticket={ticket} />
        ))}
      </div>
    </div>
  );
};

export default TicketsPage;
