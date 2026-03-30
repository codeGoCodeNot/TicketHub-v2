"use server";

import fromErrorToActionState, {
  toActionState,
} from "@/components/form/utils/to-action-state";
import getAuthOrRedirect from "@/features/auth/queries/get-auth-or-redirect";
import isOwnership from "@/features/auth/utils/is-ownership";
import { inngest } from "@/lib/inngest";
import prisma from "@/lib/prisma";

const deleteAttachment = async (id: string) => {
  const user = await getAuthOrRedirect();

  const attachment = await prisma.attachment.findUnique({
    where: { id },
    include: { ticket: true },
  });

  if (!attachment) return toActionState("ERROR", "Attachment not found.");
  if (!attachment.ticket)
    return toActionState(
      "ERROR",
      "Attachment is not associated with a ticket.",
    );

  if (!isOwnership(user, attachment?.ticket))
    return toActionState(
      "ERROR",
      "You do not have permission to delete this attachment.",
    );

  try {
    await prisma.attachment.delete({
      where: { id },
    });

    await inngest.send({
      name: "app/attachment.deleted",
      data: {
        attachmentId: attachment.id,
        organizationId: attachment.ticket.organizationId,
        filename: attachment.name,
        ticketId: attachment.ticket.id,
      },
    });
  } catch (error) {
    return fromErrorToActionState(error);
  }

  return toActionState("SUCCESS", "Attachment deleted successfully.");
};

export default deleteAttachment;
