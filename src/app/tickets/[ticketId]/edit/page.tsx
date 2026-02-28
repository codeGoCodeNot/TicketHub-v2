import CardCompact from "@/components/card-compact";
import getAuth from "@/features/auth/actions/get-auth";
import isOwnership from "@/features/auth/utils/is-ownership";
import TicketUpsertForm from "@/features/tickets/components/ticket-upsert-form";
import getTicket from "@/features/tickets/queries/get-ticket";
import { forbidden, notFound, unauthorized } from "next/navigation";

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
    <div className="flex-1 flex -flex-col justify-center items-center">
      <CardCompact
        className="w-full max-w-[420px] animate-fade-from-top"
        title="Edit a ticket"
        description="Edit an existing ticket"
        content={<TicketUpsertForm ticket={ticket} />}
      />
    </div>
  );
};

export default TicketEditPage;
