import BreadCrumbs from "@/components/breadcrumbs";
import CardCompact from "@/components/card-compact";
import { Separator } from "@/components/ui/separator";
import getAuth from "@/features/auth/actions/get-auth";
import isOwnership from "@/features/auth/utils/is-ownership";
import TicketUpsertForm from "@/features/tickets/components/ticket-upsert-form";
import getTicket from "@/features/tickets/queries/get-ticket";
import { ticketPagePath, ticketsPagePath } from "@/path";
import { forbidden, notFound } from "next/navigation";

type TicketEditPageProps = {
  params: Promise<{ ticketId: string }>;
};

const TicketEditPage = async ({ params }: TicketEditPageProps) => {
  const user = await getAuth();
  const { ticketId } = await params;
  const ticket = await getTicket(ticketId);

  const isTicketFound = !!ticket;
  const isTicketOwner = isOwnership(user, ticket);

  if (!isTicketFound) notFound();
  if (!isTicketOwner) forbidden();

  return (
    <div className="flex flex-col gap-y-8 flex-1">
      <BreadCrumbs
        breadcrumbs={[
          { title: "Tickets", href: ticketsPagePath() },
          { title: ticket.title, href: ticketPagePath(ticket.id) },
          { title: "Edit" },
        ]}
      />
      <Separator />
      <div className="flex-1 flex -flex-col justify-center items-center">
        <CardCompact
          className="w-full max-w-[420px] animate-fade-from-top"
          title="Edit a ticket"
          description="Edit an existing ticket"
          content={<TicketUpsertForm ticket={ticket} />}
        />
      </div>
    </div>
  );
};

export default TicketEditPage;
