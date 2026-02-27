"use server";

import { setCookieByKey } from "@/actions/cookies";
import fromErrorToActionState, {
  ActionState,
  toActionState,
} from "@/components/form/utils/to-action-state";
import getAuth from "@/features/auth/actions/get-auth";
import prisma from "@/lib/prisma";
import { signInPagePath, ticketPagePath, ticketsPagePath } from "@/path";
import { toCent } from "@/utils/currency";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const upsertTicketSchema = z.object({
  title: z.string().min(1, "Title is required."),
  content: z.string().min(3, "Content must be at least 3 characters long."),
  bounty: z.coerce.number().positive("Bounty is required."),
  deadline: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "is required"),
});

const upsertTicket = async (
  id: string,
  _actionState: ActionState,
  formData: FormData,
) => {
  const user = await getAuth();

  if (!user) redirect(signInPagePath());

  try {
    const data = upsertTicketSchema.parse(
      Object.fromEntries(formData.entries()),
    );

    const dbData = {
      ...data,
      userId: user.id,
      bounty: toCent(data.bounty),
    };

    await prisma.ticket.upsert({
      where: {
        id: id || "",
      },
      create: dbData,
      update: dbData,
    });
  } catch (error) {
    // extract validation errors and return them as action state
    return fromErrorToActionState(error, formData);
  }

  revalidatePath(ticketsPagePath());

  if (id) {
    await setCookieByKey("toast", "Ticket updated successfully");
    redirect(ticketPagePath(id));
  }

  return toActionState("SUCCESS", "Ticket created successfully");
};

export default upsertTicket;
