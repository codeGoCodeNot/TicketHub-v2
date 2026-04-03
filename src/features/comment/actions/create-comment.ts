"use server";

import fromErrorToActionState, {
  ActionState,
  toActionState,
} from "@/components/form/utils/to-action-state";
import { fileSchema } from "@/features/attachments/schema/schema";
import * as attachmentService from "@/features/attachments/service";
import getAuthOrRedirect from "@/features/auth/queries/get-auth-or-redirect";
import { ticketPagePath } from "@/path";
import { revalidatePath } from "next/cache";
import z from "zod";
import * as commentData from "../data";
import * as ticketData from "@/features/tickets/data";
import { findTicketIdsFromText } from "../utils/find-ticket-id-from-text";

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

    await ticketData.connnectReferencedTickets(
      ticketId,
      findTicketIdsFromText("tickets", content),
    );
  } catch (error) {
    return fromErrorToActionState(error);
  }

  revalidatePath(ticketPagePath(ticketId));
  return toActionState("SUCCESS", "Comment created successfully", undefined, {
    ...comment,
    isOwner: true,
  });
};
