import getTickets from "../queries/get-tickets";
import TicketItem from "./ticket-item";

type TicketListProps = {
  userId?: string;
};

const TicketList = async ({ userId }: TicketListProps) => {
  const tickets = await getTickets(userId);

  return (
    <div className="flex flex-1 flex-col items-center gap-y-4 animate-fade-from-top">
      {tickets.length === 0 ? (
        <p className="text-muted-foreground">No tickets found.</p>
      ) : (
        tickets.map((ticket) => <TicketItem key={ticket.id} ticket={ticket} />)
      )}
    </div>
  );
};

export default TicketList;
