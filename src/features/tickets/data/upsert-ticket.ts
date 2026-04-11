import { Prisma } from "@/generated/prisma/client";
import prisma from "@/lib/prisma";

type UpsertTicketArgs = {
  id: string;
  data: Prisma.TicketUncheckedCreateInput;
  updateData?: Prisma.TicketUncheckedUpdateInput;
};

export const upsertTicket = async ({
  id,
  data,
  updateData,
}: UpsertTicketArgs) => {
  return await prisma.ticket.upsert({
    where: {
      id: id || "",
    },
    create: data,
    update: updateData ?? data,
  });
};
