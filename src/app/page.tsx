import Heading from "@/components/heading";
import Spinner from "@/components/spinner";
import TicketList from "@/features/tickets/components/ticket-list";
import { SearchParams } from "@/features/tickets/search-params";

import { Suspense } from "react";

type HomePageProps = {
  searchParams: Promise<SearchParams>;
};

const HomePage = async ({ searchParams }: HomePageProps) => {
  return (
    <div className="flex flex-col gap-y-8 flex-1">
      <Heading
        title="All Tickets"
        description="Tickets by every user in one place"
      />

      <Suspense fallback={<Spinner />}>
        <TicketList searchParams={await searchParams} />
      </Suspense>
    </div>
  );
};

export default HomePage;
