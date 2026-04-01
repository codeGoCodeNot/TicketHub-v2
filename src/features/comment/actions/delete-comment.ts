"use server";

import { toActionState } from "@/components/form/utils/to-action-state";
import deleteAttachment from "@/features/attachments/actions/delete-attachments";
import getAuthOrRedirect from "@/features/auth/queries/get-auth-or-redirect";
import isOwnership from "@/features/auth/utils/is-ownership";
import prisma from "@/lib/prisma";
import { ticketPagePath } from "@/path";
import { revalidatePath } from "next/cache";

export const deleteComment = async (id: string) => {
  const user = await getAuthOrRedirect();

  const comment = await prisma.comment.findUnique({
    where: {
      id,
    },
    include: {
      attachments: true,
    },
  });

  if (!comment || !isOwnership(user, comment)) {
    return toActionState(
      "ERROR",
      "You are not authorized to delete this comment.",
    );
  }

  await Promise.all(
    comment.attachments.map((attachment) => deleteAttachment(attachment.id)),
  );

  await prisma.comment.delete({
    where: {
      id,
    },
  });

  revalidatePath(ticketPagePath(comment.ticketId));
  return toActionState("SUCCESS", "Comment deleted successfully.");
};
