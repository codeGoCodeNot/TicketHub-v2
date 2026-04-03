import { disconnectReferencedTickets } from "../data/disconnect-referenced-tickets";
import { findTicketIdsFromText } from "../utils/find-ticket-id-from-text";
import { connectReferencedTicketsService } from "./connect-referenced-tickets";

export const syncReferenceTicketsViaCommentDiff = async (
  ticketId: string,
  oldContent: string,
  newContent: string,
) => {
  const oldIds = new Set(findTicketIdsFromText("tickets", oldContent));
  const newIds = new Set(findTicketIdsFromText("tickets", newContent));

  const toDisconnect = [...oldIds].filter((id) => !newIds.has(id));
  const toConnect = [...newIds].filter((id) => !oldIds.has(id));

  if (toDisconnect.length > 0)
    await disconnectReferencedTickets(ticketId, toDisconnect);

  if (toConnect.length > 0)
    await connectReferencedTicketsService(ticketId, toConnect);
};
