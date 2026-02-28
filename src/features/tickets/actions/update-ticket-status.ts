"use server";

import fromErrorToActionState, {
  toActionState,
} from "@/components/form/utils/to-action-state";
import getAuthOrRedirect from "@/features/auth/queries/get-auth-or-redirect";
import isOwnership from "@/features/auth/utils/is-ownership";
import { TicketStatus } from "@/generated/prisma/enums";
import prisma from "@/lib/prisma";
import { ticketsPagePath } from "@/path";
import { revalidatePath } from "next/cache";

const updateTicketStatus = async (id: string, status: TicketStatus) => {
  const user = await getAuthOrRedirect();

  try {
    const ticket = await prisma.ticket.findUnique({
      where: {
        id,
      },
    });

    if (!ticket || !isOwnership(user, ticket)) {
      return toActionState(
        "ERROR",
        "You are not authorized to update the status of this ticket.",
      );
    }

    await prisma.ticket.update({
      where: {
        id,
      },
      data: { status },
    });
  } catch (error) {
    return fromErrorToActionState(error);
  }

  revalidatePath(ticketsPagePath());
  return toActionState("SUCCESS", "Status updated");
};

export default updateTicketStatus;
