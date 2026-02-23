"use server";

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
  redirect(ticketsPagePath());
};

export default deleteTicket;
