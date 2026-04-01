"use server";

import fromErrorToActionState, {
  ActionState,
  toActionState,
} from "@/components/form/utils/to-action-state";
import { fileSchema } from "@/features/attachments/schema/schema";
import * as attachmentService from "@/features/attachments/service";
import getAuthOrRedirect from "@/features/auth/queries/get-auth-or-redirect";
import isOwnership from "@/features/auth/utils/is-ownership";
import prisma from "@/lib/prisma";
import { ticketPagePath } from "@/path";
import { revalidatePath } from "next/cache";
import z from "zod";

const updateCommentSchema = z.object({
  content: z.string().trim().min(1, "Content is required").max(1024),
  files: fileSchema,
});

export const updateComment = async (
  id: string,
  _actionState: ActionState,
  formData: FormData,
) => {
  const user = await getAuthOrRedirect();

  const comment = await prisma.comment.findUnique({
    where: {
      id,
    },
    include: {
      ticket: true,
    },
  });

  if (!comment || !isOwnership(user, comment)) {
    return toActionState(
      "ERROR",
      "You are not authorized to edit this comment.",
    );
  }

  try {
    const { content, files } = updateCommentSchema.parse({
      content: formData.get("content"),
      files: formData.getAll("files"),
    });

    await prisma.comment.update({
      where: {
        id,
      },
      data: {
        content,
      },
    });

    if (files.length > 0) {
      await attachmentService.createAttachments({
        entity: "COMMENT",
        subject: comment,
        entityId: comment.id,
        files,
        userId: user.id,
      });
    }
  } catch (error) {
    return fromErrorToActionState(error, formData);
  }

  revalidatePath(ticketPagePath(comment.ticketId));
  return toActionState("SUCCESS", "Comment updated successfully");
};
