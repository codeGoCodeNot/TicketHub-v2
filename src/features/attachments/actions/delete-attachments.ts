"use server";

import fromErrorToActionState, {
  toActionState,
} from "@/components/form/utils/to-action-state";
import getAuthOrRedirect from "@/features/auth/queries/get-auth-or-redirect";
import isOwnership from "@/features/auth/utils/is-ownership";
import { inngest } from "@/lib/inngest";
import prisma from "@/lib/prisma";
import { getOrganizationIdByAttachment } from "../utils/attachment-helper";
import { isComment, isTicket } from "../types";
import { revalidatePath } from "next/cache";
import { ticketPagePath } from "@/path";

const deleteAttachment = async (id: string) => {
  const user = await getAuthOrRedirect();

  const attachment = await prisma.attachment.findUnique({
    where: { id },
    include: { ticket: true, comment: { include: { ticket: true } } },
  });

  if (!attachment) return toActionState("ERROR", "Attachment not found.");

  const subject = attachment.ticket ?? attachment.comment;

  if (!subject) return toActionState("ERROR", "Associated entity not found.");

  if (!isOwnership(user, subject))
    return toActionState(
      "ERROR",
      "You do not have permission to delete this attachment.",
    );

  const organizationId = getOrganizationIdByAttachment(
    attachment.entity,
    subject,
  );

  if (!organizationId) return toActionState("ERROR", "Organization not found.");

  const entityId =
    attachment.entity === "TICKET" ? attachment.ticketId : attachment.commentId;

  if (!entityId) return toActionState("ERROR", "Entity ID not found.");

  try {
    await prisma.attachment.delete({
      where: { id },
    });

    await inngest.send({
      name: "app/attachment.deleted",
      data: {
        attachmentId: attachment.id,
        organizationId,
        filename: attachment.name,
        entityId: subject.id,
        entity: attachment.entity,
      },
    });
  } catch (error) {
    return fromErrorToActionState(error);
  }

  switch (attachment.entity) {
    case "TICKET":
      if (isTicket(subject)) revalidatePath(ticketPagePath(subject.id));
      break;
    case "COMMENT":
      if (isComment(subject)) revalidatePath(ticketPagePath(subject.ticket.id));
      break;
  }

  return toActionState("SUCCESS", "Attachment deleted successfully.");
};

export default deleteAttachment;
