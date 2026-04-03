import CardCompact from "@/components/card-compact";
import getReferencedTickets from "../queries/get-referenced-tickets";
import Link from "next/link";
import { ticketPagePath } from "@/path";

type ReferencedTicketsProps = {
  ticketId: string;
};

const ReferencedTickets = async ({ ticketId }: ReferencedTicketsProps) => {
  const referencedTickets = await getReferencedTickets(ticketId);

  if (!referencedTickets.length) return null;

  return (
    <CardCompact
      title="Referenced Tickets"
      description="Tickets that have been referenced in Comments"
      content={
        <div className="mx-2 mb-4">
          {referencedTickets.map((referencedTicket) => (
            <div key={referencedTicket.id}>
              <Link href={ticketPagePath(referencedTicket.id)}>
                {referencedTicket.title}
              </Link>
            </div>
          ))}
        </div>
      }
    />
  );
};

export default ReferencedTickets;
