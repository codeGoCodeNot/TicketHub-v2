"use server";

import prisma from "@/lib/prisma";
import { ticketsPagePath } from "@/path";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const upsertTicket = async (id: string, formData: FormData) => {
  const data = {
    title: formData.get("title") as string,
    content: formData.get("content") as string,
  };

  await prisma.ticket.upsert({
    where: {
      id: id || "",
    },
    create: data,
    update: data,
  });

  revalidatePath(ticketsPagePath());

  if (id) redirect(ticketsPagePath());
};

export default upsertTicket;
