import BreadCrumbs from "@/components/breadcrumbs";
import CardCompact from "@/components/card-compact";
import { Separator } from "@/components/ui/separator";
import getAuth from "@/lib/get-auth";
import isOwnership from "@/features/auth/utils/is-ownership";
import TicketUpsertForm from "@/features/tickets/components/ticket-upsert-form";
import getTicket from "@/features/tickets/queries/get-ticket";
import { ticketPagePath, ticketsPagePath } from "@/path";
import { forbidden, notFound } from "next/navigation";
import { getSession } from "@/lib/get-session";
import getStripeProvisioning from "@/features/stripe/queries/get-stripe-provisioning";
import getTicketPermission from "@/features/tickets/queries/get-ticket-permission";

type TicketEditPageProps = {
  params: Promise<{ ticketId: string }>;
};

const TicketEditPage = async ({ params }: TicketEditPageProps) => {
  const user = await getAuth();
  const { ticketId } = await params;
  const ticket = await getTicket(ticketId);

  if (!ticket) notFound();

  const isTicketOwner = isOwnership(user, ticket);

  const permission = await getTicketPermission({
    organizationId: ticket.organizationId,
    userId: user?.id ?? "",
  });

  if (!isTicketOwner && !permission.canUpdateTickets) forbidden();

  const session = await getSession();
  const { hasActivePlan } = await getStripeProvisioning(
    session?.session.activeOrganizationId!,
  );

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
          content={
            <TicketUpsertForm ticket={ticket} hasActivePlan={hasActivePlan} />
          }
        />
      </div>
    </div>
  );
};

export default TicketEditPage;
