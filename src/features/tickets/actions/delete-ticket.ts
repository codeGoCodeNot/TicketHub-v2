"use server";

import { setCookieByKey } from "@/actions/cookies";
import prisma from "@/lib/prisma";
import { ticketsPagePath } from "@/path";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const deleteTicket = async (id: string) => {
  await prisma.ticket.delete({
    where: {
      id,
    },
  });

  revalidatePath(ticketsPagePath());

  await setCookieByKey("toast", "Ticket deleted successfully");
  redirect(ticketsPagePath());
};

export default deleteTicket;
