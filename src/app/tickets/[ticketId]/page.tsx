import Placeholder from "@/components/placeholder";
import { Button } from "@/components/ui/button";
import TicketItem from "@/features/tickets/components/ticket-item";
import getTicket from "@/features/tickets/queries/get-ticket";
import { ticketsPagePath } from "@/path";
import { LucideMessageSquareWarning } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

type TicketPageProps = {
  params: Promise<{ ticketId: string }>;
};

const TicketPage = async ({ params }: TicketPageProps) => {
  const { ticketId } = await params;
  const ticket = await getTicket(ticketId);

  if (!ticket) {
    return notFound();
  }

  return (
    <div className="flex justify-center animate-fade-from-top">
      <TicketItem ticket={ticket} isDetail />
    </div>
  );
};

export default TicketPage;
