"use server";

import fromErrorToActionState, {
  ActionState,
  toActionState,
} from "@/components/form/utils/to-action-state";
import getAuthOrRedirect from "@/features/auth/queries/get-auth-or-redirect";
import prisma from "@/lib/prisma";
import { ticketPagePath } from "@/path";
import { revalidatePath } from "next/cache";
import z from "zod";

const createSchema = z.object({
  content: z.string().min(1, "Content is required").max(1024),
});

export const createComment = async (
  ticketId: string,
  _actionState: ActionState,
  formData: FormData,
) => {
  const user = await getAuthOrRedirect();

  let comment;

  try {
    const data = createSchema.parse(Object.fromEntries(formData.entries()));
    comment = await prisma.comment.create({
      data: {
        userId: user.id,
        ticketId,
        ...data,
      },
      include: {
        user: {
          select: {
            name: true,
            image: true,
          },
        },
      },
    });
  } catch (error) {
    return fromErrorToActionState(error);
  }

  revalidatePath(ticketPagePath(ticketId));
  return toActionState("SUCCESS", "Comment created successfully", undefined, {
    ...comment,
    isOwner: true,
  });
};
