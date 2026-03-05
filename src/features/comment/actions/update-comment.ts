"use server";

import fromErrorToActionState, {
  ActionState,
  toActionState,
} from "@/components/form/utils/to-action-state";
import getAuthOrRedirect from "@/features/auth/queries/get-auth-or-redirect";
import isOwnership from "@/features/auth/utils/is-ownership";
import prisma from "@/lib/prisma";
import { ticketPagePath } from "@/path";
import { revalidatePath } from "next/cache";
import z from "zod";

const updateCommentSchema = z.object({
  content: z.string().trim().min(1, "Content is required").max(1024),
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
  });

  if (!comment || !isOwnership(user, comment)) {
    return toActionState(
      "ERROR",
      "You are not authorized to edit this comment.",
    );
  }

  try {
    const data = updateCommentSchema.parse(
      Object.fromEntries(formData.entries()),
    );

    await prisma.comment.update({
      where: {
        id,
      },
      data,
    });
  } catch (error) {
    return fromErrorToActionState(error, formData);
  }

  revalidatePath(ticketPagePath(comment.ticketId));
  return toActionState("SUCCESS", "Comment updated successfully");
};
