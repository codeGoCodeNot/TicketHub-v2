"use server";

import fromErrorToActionState, {
  ActionState,
  toActionState,
} from "@/components/form/utils/to-action-state";
import getAuthOrRedirect from "@/features/auth/queries/get-auth-or-redirect";
import getStripeProvisioning from "@/features/stripe/queries/get-stripe-provisioning";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { organizationInvitationPagePath } from "@/path";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import z from "zod";

const createInvitationSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  role: z.enum(["member", "admin"]).optional().default("member"),
});

const createInvitation = async (
  organizationId: string,
  _actionState: ActionState,
  formData: FormData,
) => {
  await getAuthOrRedirect();

  const { allowedMembers, currentMembers } =
    await getStripeProvisioning(organizationId);

  if (currentMembers >= allowedMembers)
    return toActionState(
      "ERROR",
      "Please upgrade your plan to invite more members.",
    );

  try {
    const { email, role } = createInvitationSchema.parse(
      Object.fromEntries(formData.entries()),
    );

    await auth.api.createInvitation({
      headers: await headers(),
      body: {
        email,
        role,
        organizationId,
      },
    });

    // log activity
    await prisma.activityLog.create({
      data: {
        organizationId,
        action: "invitation",
        detail: `Invitation sent to ${email} with role ${role}.`,
      },
    });
  } catch (error) {
    return fromErrorToActionState(error, formData);
  }

  revalidatePath(organizationInvitationPagePath(organizationId));
  return toActionState("SUCCESS", "Invitation created successfully");
};

export default createInvitation;
