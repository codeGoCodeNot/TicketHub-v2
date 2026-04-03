import CardCompact from "@/components/card-compact";
import getReferencedTickets from "../queries/get-referenced-tickets";
import Link from "next/link";
import { ticketPagePath } from "@/path";

type ReferencedTicketsProps = {
  ticketId: string;
};

const ReferencedTickets = async ({ ticketId }: ReferencedTicketsProps) => {
  const { referencedTicket, referencingTickets } =
    await getReferencedTickets(ticketId);

  if (!referencedTicket && !referencingTickets.length) return null;

  return (
    <CardCompact
      title="Referenced Tickets"
      description="Tickets that have been referenced in Comments"
      content={
        <div className="mx-2 mb-4">
          {referencedTicket && (
            <div className="flex flex-col gap-y-1">
              <p className="text-xs text-muted-foreground font-semibold uppercase">
                References →
              </p>
              <Link href={ticketPagePath(referencedTicket.id)}>
                {referencedTicket.title}
              </Link>
            </div>
          )}

          {referencingTickets.length > 0 && (
            <div className="flex flex-col gap-y-1">
              <p className="text-xs text-muted-foreground font-semibold uppercase">
                Referenced by →
              </p>
              {referencingTickets.map((ticket) => (
                <div key={ticket.id}>
                  <Link href={ticketPagePath(ticket.id)}>{ticket.title}</Link>
                </div>
              ))}
            </div>
          )}
        </div>
      }
    />
  );
};

export default ReferencedTickets;
