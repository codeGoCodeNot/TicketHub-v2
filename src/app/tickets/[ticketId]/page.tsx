import { initialData } from "@/data";
import { ticketPagePath, ticketsPagePath } from "@/path";
import Link from "next/link";

type TicketPageProps = {
  params: Promise<{ ticketId: string }>;
};

const TicketPage = async ({ params }: TicketPageProps) => {
  const { ticketId } = await params;
  const ticket = initialData.tickets.find((ticket) => ticket.id === ticketId);

  if (!ticket)
    return (
      <div className="text-red-500 font-bold px-4 py-8">Ticket not found</div>
    );

  return (
    <div>
      <h1 className="text-3xl font-bold">{ticket.title}</h1>
      <Link href={ticketsPagePath()}>Back to Tickets</Link>
    </div>
  );
};

export default TicketPage;
