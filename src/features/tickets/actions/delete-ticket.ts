"use server";

import prisma from "@/lib/prisma";
import { ticketsPagePath } from "@/path";
import { redirect } from "next/navigation";

const deleteTicket = async (id: string) => {
  await prisma.ticket.delete({
    where: {
      id,
    },
  });

  redirect(ticketsPagePath());
};

export default deleteTicket;
