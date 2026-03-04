import getTicket from "@/features/tickets/queries/get-ticket";

export const GET = async (
  _request: Request,
  { params }: { params: Promise<{ ticketId: string }> },
) => {
  const ticket = await getTicket((await params).ticketId);

  return Response.json({ ticket });
};
