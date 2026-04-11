import CardCompact from "@/components/card-compact";
import Heading from "@/components/heading";
import Spinner from "@/components/spinner";
import getAuth from "@/lib/get-auth";
import TicketList from "@/features/tickets/components/ticket-list";
import TicketUpsertForm from "@/features/tickets/components/ticket-upsert-form";
import { SearchParams } from "nuqs/server";
import { Suspense } from "react";
import { searchParamsCache } from "@/features/tickets/search-params";
import { getSession } from "@/lib/get-session";
import getStripeProvisioning from "@/features/stripe/queries/get-stripe-provisioning";

type TicketsPageProps = {
  searchParams: Promise<SearchParams>;
};

const TicketsPage = async ({ searchParams }: TicketsPageProps) => {
  const user = await getAuth();
  const session = await getSession();
  const { hasActivePlan } = await getStripeProvisioning(
    session?.session.activeOrganizationId!,
  );

  return (
    <div className="flex flex-col gap-y-8 flex-1">
      <Heading title="My Tickets" description="All your tickets at one place" />

      <CardCompact
        className="w-full max-w-[420px] self-center"
        title="Create Ticket"
        description="A new ticket can be created here"
        content={<TicketUpsertForm hasActivePlan={hasActivePlan} />}
      />

      <Suspense fallback={<Spinner />}>
        <TicketList
          userId={user?.id}
          searchParams={await searchParamsCache.parse(searchParams)}
          showOrganizationFilter
        />
      </Suspense>
    </div>
  );
};

export default TicketsPage;
