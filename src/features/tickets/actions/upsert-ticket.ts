"use server";

import { setCookieByKey } from "@/actions/cookies";
import fromErrorToActionState, {
  ActionState,
  toActionState,
} from "@/components/form/utils/to-action-state";
import prisma from "@/lib/prisma";
import { ticketPagePath, ticketsPagePath } from "@/path";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const upsertTicketSchema = z.object({
  title: z.string().min(1, "Title is required."),
  content: z.string().min(3, "Content must be at least 3 characters long."),
  bounty: z.coerce.number().positive("Bounty must be a positive number."),
  deadline: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "is required"),
});

const upsertTicket = async (
  id: string,
  _actionState: ActionState,
  formData: FormData,
) => {
  try {
    const data = upsertTicketSchema.parse(
      Object.fromEntries(formData.entries()),
    );

    await prisma.ticket.upsert({
      where: {
        id: id || "",
      },
      create: data,
      update: data,
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
