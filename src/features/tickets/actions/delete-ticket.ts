"use server";

import { setCookieByKey } from "@/actions/cookies";
import fromErrorToActionState from "@/components/form/utils/to-action-state";
import prisma from "@/lib/prisma";
import { ticketsPagePath } from "@/path";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const deleteTicket = async (id: string) => {
  try {
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
