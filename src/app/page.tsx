import Heading from "@/components/heading";
import Spinner from "@/components/spinner";
import getAuthOrRedirect from "@/features/auth/queries/get-auth-or-redirect";
import AiChatBot from "@/features/chat/components/AiChatBot";
import getChatMessages from "@/features/chat/queries/get-chat-messages";
import TicketList from "@/features/tickets/components/ticket-list";
import { searchParamsCache } from "@/features/tickets/search-params";
import { SearchParams } from "nuqs/server";

import { Suspense } from "react";

type HomePageProps = {
  searchParams: Promise<SearchParams>;
};

const HomePage = async ({ searchParams }: HomePageProps) => {
  const user = await getAuthOrRedirect();
  const chatHistory = await getChatMessages();

  return (
    <>
      <div className="flex flex-col gap-y-8 flex-1">
        <Heading
          title="All Tickets"
          description="Tickets by every user in one place"
        />

        <Suspense fallback={<Spinner />}>
          <TicketList
            searchParams={await searchParamsCache.parse(searchParams)}
          />
        </Suspense>
      </div>
      {user && <AiChatBot initialMessages={chatHistory} userName={user.name} />}
    </>
  );
};

export default HomePage;
