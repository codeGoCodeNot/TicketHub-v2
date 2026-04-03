import { connectReferencedTickets } from "@/features/tickets/data/connect-referenced-tickets";

/**
 * Service Layer: Connect referenced tickets to a ticket.
 * @param ticketId The ticket to connect references to
 * @param referencedTicketIds Array of ticket IDs to connect
 */
export const connectReferencedTicketsService = async (
  ticketId: string,
  referencedTicketIds: string[],
) => {
  console.log("[connectReferencedTicketsService] ticketId:", ticketId);
  console.log("[connectReferencedTicketsService] referencedTicketIds:", referencedTicketIds);
  await connectReferencedTickets(ticketId, referencedTicketIds);
};
