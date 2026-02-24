import CardCompact from "@/components/card-compact";
import Heading from "@/components/heading";
import Spinner from "@/components/spinner";
import TicketList from "@/features/tickets/components/ticket-list";
import TicketUpsertForm from "@/features/tickets/components/ticket-upsert-form";
import { getBaseUrl } from "@/utils/url";
import { Suspense } from "react";

const TicketsPage = () => {
  console.log(getBaseUrl());

  return (
    <div className="flex flex-col gap-y-8 flex-1">
      <Heading title="Tickets" description="All your tickets at one place" />

      <CardCompact
        className="w-full max-w-[420px] self-center"
        title="Create Ticket"
        description="A new ticket can be created here"
        content={<TicketUpsertForm />}
      />

      <Suspense fallback={<Spinner />}>
        <TicketList />
      </Suspense>
    </div>
  );
};

export default TicketsPage;
