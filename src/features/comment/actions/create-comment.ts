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

  try {
    const data = createSchema.parse(Object.fromEntries(formData.entries()));

    await prisma.comment.create({
      data: {
        userId: user.id,
        ticketId,
        ...data,
      },
    });
  } catch (error) {
    return fromErrorToActionState(error);
  }

  revalidatePath(ticketPagePath(ticketId));
  return toActionState("SUCCESS", "Comment created successfully");
};
