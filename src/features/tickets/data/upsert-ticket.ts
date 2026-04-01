import { Prisma } from "@/generated/prisma/client";
import prisma from "@/lib/prisma";

type UpsertTicketArgs = {
  id: string;
  data: Prisma.TicketUncheckedCreateInput;
};

export const upsertTicket = async ({ id, data }: UpsertTicketArgs) => {
  return await prisma.ticket.upsert({
    where: {
      id: id || "",
    },
    create: data,
    update: data,
  });
};
