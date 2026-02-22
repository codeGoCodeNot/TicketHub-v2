import { initialData } from "@/data";
import { Ticket } from "../type";

const getTicket = async (ticketId: string): Promise<Ticket | null> => {
  // Simulate an API call to fetch the ticket by ID

  await new Promise((resolve) => {
    setTimeout(resolve, 2000); // Simulate network delay
  });

  return await new Promise((resolve) => {
    resolve(
      initialData.tickets.find((ticket) => ticket.id === ticketId) || null,
    );
  });
};

export default getTicket;
