import CardCompact from "@/components/card-compact";
import Heading from "@/components/heading";
import Spinner from "@/components/spinner";
import getAuth from "@/features/auth/actions/get-auth";
import TicketList from "@/features/tickets/components/ticket-list";
import TicketUpsertForm from "@/features/tickets/components/ticket-upsert-form";
import { Suspense } from "react";

const TicketsPage = async () => {
  const user = await getAuth();

  return (
    <div className="flex flex-col gap-y-8 flex-1">
      <Heading title="My Tickets" description="All your tickets at one place" />

      <CardCompact
        className="w-full max-w-[420px] self-center"
        title="Create Ticket"
        description="A new ticket can be created here"
        content={<TicketUpsertForm />}
      />

      <Suspense fallback={<Spinner />}>
        <TicketList userId={user?.id} />
      </Suspense>
    </div>
  );
};

export default TicketsPage;
