import CardCompact from "@/components/card-compact";
import Heading from "@/components/heading";
import Spinner from "@/components/spinner";
import getActiveOrganization from "@/features/organization/queries/get-active-organization";
import TicketList from "@/features/tickets/components/ticket-list";
import TicketUpsertForm from "@/features/tickets/components/ticket-upsert-form";
import { searchParamsCache } from "@/features/tickets/search-params";
import { SearchParams } from "nuqs/server";

import { Suspense } from "react";

type TicketsByOrganizationPageProps = {
  searchParams: Promise<SearchParams>;
};

const TicketsByOrganizationPage = async ({
  searchParams,
}: TicketsByOrganizationPageProps) => {
  const parsed = await searchParamsCache.parse(searchParams);
  const activeOrganization = await getActiveOrganization();

  return (
    <div className="flex flex-col gap-y-8 flex-1">
      <Heading
        title="Tickets by Organization"
        description="View and manage tickets based on your organization memberships"
      />
      <CardCompact
        className="w-full max-w-[420px] self-center"
        title="Create Ticket"
        description="A new ticket can be created here"
        content={<TicketUpsertForm />}
      />
      <Suspense fallback={<Spinner />}>
        <TicketList
          searchParams={{
            ...parsed,
            byOrganization: activeOrganization ? "true" : "",
          }}
        />
      </Suspense>
    </div>
  );
};

export default TicketsByOrganizationPage;
