import { Prisma } from "@/generated/prisma/client";

export type TicketWithMetada = Prisma.TicketGetPayload<{
  include: {
    user: {
      select: {
        name: true;
        image: true;
      };
    };
  };
}> & {
  isOwner: boolean;
};
