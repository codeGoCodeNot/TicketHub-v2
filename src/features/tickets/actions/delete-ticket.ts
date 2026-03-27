"use server";

import { setCookieByKey } from "@/actions/cookies";
import fromErrorToActionState, {
  toActionState,
} from "@/components/form/utils/to-action-state";
import getAuthOrRedirect from "@/features/auth/queries/get-auth-or-redirect";
import prisma from "@/lib/prisma";
import { ticketsPagePath } from "@/path";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import getTicketPermission from "../queries/get-ticket-permission";

const deleteTicket = async (id: string) => {
  const user = await getAuthOrRedirect();

  try {
    const ticket = await prisma.ticket.findUnique({
      where: {
        id,
      },
    });

    const permission = await getTicketPermission({
      organizationId: ticket?.organizationId!,
      userId: user.id,
    });

    if (!ticket || !permission.canDeleteTickets) {
      return toActionState(
        "ERROR",
        "You are not authorized to delete this ticket.",
      );
    }

    await prisma.ticket.delete({
      where: {
        id,
      },
    });
  } catch (error) {
    return fromErrorToActionState(error);
  }

  revalidatePath(ticketsPagePath());

  await setCookieByKey("toast", "Ticket deleted successfully");
  redirect(ticketsPagePath());
};

export default deleteTicket;
