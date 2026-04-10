"use server";

import { toActionState } from "@/components/form/utils/to-action-state";
import getAuthOrRedirect from "@/features/auth/queries/get-auth-or-redirect";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { organizationInvitationPagePath } from "@/path";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

type CancelInvitationProps = {
  email: string;
  organizationId: string;
};

const cancelInvitation = async ({
  email,
  organizationId,
}: CancelInvitationProps) => {
  await getAuthOrRedirect();

  try {
    const invitation = await prisma.invitation.findFirst({
      where: {
        email,
        organizationId,
      },
    });

    if (!invitation) return toActionState("ERROR", "Invitation not found.");

    await auth.api.cancelInvitation({
      headers: await headers(),
      body: {
        invitationId: invitation.id,
      },
    });

    await prisma.activityLog.create({
      data: {
        organizationId,
        action: "invitation_cancelled",
        detail: `Invitation for ${email} cancelled.`,
      },
    });
  } catch (error) {
    return toActionState(
      "ERROR",
      "Failed to cancel invitation. Please try again.",
    );
  }

  revalidatePath(organizationInvitationPagePath(organizationId));
  return toActionState("SUCCESS", "Invitation cancelled successfully.");
};

export default cancelInvitation;
