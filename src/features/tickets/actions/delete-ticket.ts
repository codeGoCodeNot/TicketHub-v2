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
import * as ticketData from "../data";
import getTicketPermission from "../queries/get-ticket-permission";
import { inngest } from "@/lib/inngest";

const deleteTicket = async (id: string) => {
  const user = await getAuthOrRedirect();

  try {
    const ticket = await ticketData.findTicket(id);

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

    const attachments = await prisma.attachment.findMany({
      where: {
        OR: [{ ticketId: id }, { comment: { ticketId: id } }],
      },
    });

    await ticketData.deleteTicket(id);

    if (process.env.NODE_ENV === "production" && attachments.length > 0) {
      await inngest.send(
        attachments.map((attachment) => ({
          name: "app/attachment.deleted" as const,
          data: {
            attachmentId: attachment.id,
            organizationId: ticket.organizationId,
            filename: attachment.name,
            entityId: attachment.ticketId ?? attachment.commentId ?? id,
            entity: attachment.entity,
          },
        })),
      );
    }
  } catch (error) {
    return fromErrorToActionState(error);
  }

  revalidatePath(ticketsPagePath());

  await setCookieByKey("toast", "Ticket deleted successfully");
  redirect(ticketsPagePath());
};

export default deleteTicket;
