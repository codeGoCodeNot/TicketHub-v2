import Heading from "@/components/heading";
import Spinner from "@/components/spinner";
import TicketList from "@/features/tickets/components/ticket-list";
import { Suspense } from "react";

const TicketsPage = () => {
  return (
    <div className="flex flex-col gap-y-8 flex-1">
      <Heading title="Tickets" description="All your tickets at one place" />

      <Suspense fallback={<Spinner />}>
        <TicketList />
      </Suspense>
    </div>
  );
};

export default TicketsPage;
