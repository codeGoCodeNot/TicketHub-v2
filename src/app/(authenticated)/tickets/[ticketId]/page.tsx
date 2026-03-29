import BreadCrumbs from "@/components/breadcrumbs";
import { Separator } from "@/components/ui/separator";
import Attachments from "@/features/attachments/components/attachments";
import Comments from "@/features/comment/components/comments";
import getComments from "@/features/comment/queries/get-comments";
import TicketItem from "@/features/tickets/components/ticket-item";
import getTicket from "@/features/tickets/queries/get-ticket";
import { ticketsPagePath } from "@/path";
import { notFound } from "next/navigation";

type TicketPageProps = {
  params: Promise<{ ticketId: string }>;
};

const TicketPage = async ({ params }: TicketPageProps) => {
  const { ticketId } = await params;

  const [ticket, comments] = await Promise.all([
    getTicket(ticketId),
    getComments(ticketId),
  ]);

  if (!ticket) {
    return notFound();
  }

  return (
    <div className="flex flex-col gap-y-8 flex-1">
      <BreadCrumbs
        breadcrumbs={[
          { title: "Tickets", href: ticketsPagePath() },
          { title: ticket.title },
        ]}
      />
      <Separator />
      <div className="flex justify-center animate-fade-from-top">
        <TicketItem
          ticket={ticket}
          comments={<Comments ticketId={ticket.id} comments={comments} />}
          isDetail
          attachments={
            <Attachments ticketId={ticket.id} isOwner={ticket.isOwner} />
          }
        />
      </div>
    </div>
  );
};

export default TicketPage;
