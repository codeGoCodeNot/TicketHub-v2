import getTickets from "../queries/get-tickets";
import TicketItem from "./ticket-item";

const TicketList = async () => {
  const tickets = await getTickets();

  return (
    <div className="flex flex-1 flex-col self-center items-center gap-y-4 animate-fade-from-top">
      {tickets.length === 0 ? (
        <div className="flex flex-col gap-y-2 items-center">
          <span className="text-2xl">No tickets found</span>
        </div>
      ) : (
        tickets.map((ticket) => <TicketItem key={ticket.id} ticket={ticket} />)
      )}
    </div>
  );
};

export default TicketList;
