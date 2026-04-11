"use server";

import fromErrorToActionState, {
  toActionState,
} from "@/components/form/utils/to-action-state";
import getAuthOrRedirect from "@/features/auth/queries/get-auth-or-redirect";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import {
  organizationActivityLogPagePath,
  organizationMembershipPagePath,
} from "@/path";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

const deleteMember = async (organizationId: string, memberId: string) => {
  await getAuthOrRedirect();

  const member = await prisma.member.findUnique({
    where: { id: memberId },
    include: { user: true },
  });

  try {
    await auth.api.removeMember({
      headers: await headers(),
      body: { organizationId, memberIdOrEmail: memberId },
    });

    await prisma.activityLog.create({
      data: {
        organizationId,
        action: "member_removed",
        detail: `Member ${member?.user.name} removed from organization.`,
      },
    });
  } catch (error) {
    return fromErrorToActionState(error);
  }

  revalidatePath(organizationMembershipPagePath(organizationId));
  revalidatePath(organizationActivityLogPagePath(organizationId));

  return toActionState("SUCCESS", "Member removed successfully.");
};

export default deleteMember;
