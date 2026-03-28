"use server";

import { toActionState } from "@/components/form/utils/to-action-state";
import getAuthOrRedirect from "@/features/auth/queries/get-auth-or-redirect";
import prisma from "@/lib/prisma";
import { organizationInvitationPagePath } from "@/path";
import { revalidatePath } from "next/cache";

type DeleteInvitationProps = {
  email: string;
  organizationId: string;
};

const deleteInvitation = async ({
  email,
  organizationId,
}: DeleteInvitationProps) => {
  await getAuthOrRedirect();

  try {
    const invitation = await prisma.invitation.findFirst({
      where: {
        email,
        organizationId,
      },
    });

    if (!invitation) return toActionState("ERROR", "Invitation not found.");

    await prisma.invitation.delete({
      where: {
        id: invitation.id,
      },
    });
  } catch (error) {
    return toActionState(
      "ERROR",
      "Failed to delete invitation. Please try again.",
    );
  }

  revalidatePath(organizationInvitationPagePath(organizationId));
  return toActionState("SUCCESS", "Invitation deleted successfully.");
};

export default deleteInvitation;
