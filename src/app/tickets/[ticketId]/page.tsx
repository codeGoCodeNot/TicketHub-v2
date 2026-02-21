import Placeholder from "@/components/placeholder";
import { Button } from "@/components/ui/button";
import { initialData } from "@/data";
import TicketItem from "@/features/tickets/components/ticket-item";
import { ticketsPagePath } from "@/path";
import { LucideMessageSquareWarning } from "lucide-react";
import Link from "next/link";

type TicketPageProps = {
  params: Promise<{ ticketId: string }>;
};

const TicketPage = async ({ params }: TicketPageProps) => {
  const { ticketId } = await params;
  const ticket = initialData.tickets.find((ticket) => ticket.id === ticketId);

  if (!ticket)
    return (
      <Placeholder
        label="Ticket not found"
        icon={<LucideMessageSquareWarning className="w-16 h-16" />}
        button={
          <Button variant="destructive" asChild>
            <Link href={ticketsPagePath()}>Go Back to Tickets</Link>
          </Button>
        }
      />
    );

  return (
    <div className="flex justify-center animate-fade-from-top">
      <TicketItem ticket={ticket} isDetail />
    </div>
  );
};

export default TicketPage;
