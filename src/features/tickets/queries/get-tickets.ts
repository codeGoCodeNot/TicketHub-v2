import { initialData } from "@/data";
import { Ticket } from "../type";

// Simulate an API call to fetch tickets with a delay
const getTickets = async (): Promise<Ticket[]> => {
  await new Promise((resolve) => setTimeout(resolve, 2000));

  return new Promise((resolve) => {
    resolve(initialData.tickets);
  });
};

export default getTickets;
