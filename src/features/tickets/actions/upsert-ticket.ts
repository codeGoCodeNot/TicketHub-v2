"use server";

import { setCookieByKey } from "@/actions/cookies";
import fromErrorToActionState, {
  ActionState,
  toActionState,
} from "@/components/form/utils/to-action-state";
import getAuthOrRedirect from "@/features/auth/queries/get-auth-or-redirect";
import isOwnership from "@/features/auth/utils/is-ownership";
import { getSession } from "@/lib/get-session";
import prisma from "@/lib/prisma";
import { ticketPagePath, ticketsPagePath } from "@/path";
import { toCent } from "@/utils/currency";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import getTicketPermission from "../queries/get-ticket-permission";

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
  const user = await getAuthOrRedirect();
  const session = await getSession();
  const organizationId = session?.session.activeOrganizationId;

  if (!organizationId)
    return toActionState("ERROR", "Active organization not found.", formData);

  try {
    if (id) {
      const ticket = await prisma.ticket.findUnique({ where: { id } });

      if (!ticket) {
        return toActionState("ERROR", "Ticket not found.");
      }

      const permission = await getTicketPermission({
        organizationId: ticket?.organizationId!,
        userId: user.id,
      });

      if (!permission.canUpdateTickets) {
        return toActionState(
          "ERROR",
          "You are not authorized to edit this ticket.",
        );
      }
    }

    const data = upsertTicketSchema.parse(
      Object.fromEntries(formData.entries()),
    );

    const dbData = {
      ...data,
      userId: user.id,
      organizationId,
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
