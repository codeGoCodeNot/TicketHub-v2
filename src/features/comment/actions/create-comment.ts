"use server";

import fromErrorToActionState, {
  ActionState,
  toActionState,
} from "@/components/form/utils/to-action-state";
import { fileSchema } from "@/features/attachments/schema/schema";
import * as attachmentService from "@/features/attachments/service";
import getAuthOrRedirect from "@/features/auth/queries/get-auth-or-redirect";
import { organizationActivityLogPagePath, ticketPagePath } from "@/path";
import { revalidatePath } from "next/cache";
import z from "zod";
import * as commentData from "../data";
import * as ticketService from "../../tickets/service";
import { findTicketIdsFromText } from "../../tickets/utils/find-ticket-id-from-text";
import prisma from "@/lib/prisma";

const createSchema = z.object({
  content: z.string().min(1, "Content is required").max(1024),
  files: fileSchema,
});

export const createComment = async (
  ticketId: string,
  _actionState: ActionState,
  formData: FormData,
) => {
  const user = await getAuthOrRedirect();

  let comment;

  try {
    const { content, files } = createSchema.parse({
      content: formData.get("content"),
      files: formData.getAll("files"),
    });
    comment = await commentData.createComment({
      content,
      userId: user.id,
      ticketId,
      include: {
        user: {
          select: {
            name: true,
            image: true,
          },
        },
        ticket: true,
      },
    });

    await attachmentService.createAttachments({
      entity: "COMMENT",
      subject: comment,
      entityId: comment.id,
      files,
      userId: user.id,
    });

    await prisma.activityLog.create({
      data: {
        organizationId: comment.ticket.organizationId,
        action: "comment_created",
        detail: `A new comment was added to ticket "${comment.ticket.title}".`,
      },
    });

    const referencedTicketIds = findTicketIdsFromText("tickets", content);

    if (referencedTicketIds.length > 0) {
      await ticketService.connectReferencedTicketsService(
        ticketId,
        referencedTicketIds,
      );
    }
  } catch (error) {
    return fromErrorToActionState(error);
  }

  revalidatePath(ticketPagePath(ticketId));
  revalidatePath(
    organizationActivityLogPagePath(comment.ticket.organizationId),
  );
  return toActionState("SUCCESS", "Comment created successfully", undefined, {
    ...comment,
    isOwner: true,
  });
};
