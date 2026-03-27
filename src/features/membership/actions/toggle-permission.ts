"use server";

import {
  ActionState,
  toActionState,
} from "@/components/form/utils/to-action-state";
import getAuthOrRedirect from "@/features/auth/queries/get-auth-or-redirect";
import prisma from "@/lib/prisma";
import { organizationMembershipPagePath } from "@/path";
import { revalidatePath } from "next/cache";

const togglePermission = async (
  userId: string,
  organizationId: string,
  permissionType: "canDeleteTickets" | "canUpdateTickets",
  value: boolean,
  _actionState: ActionState,
) => {
  await getAuthOrRedirect();

  const member = await prisma.member.findFirst({
    where: {
      userId,
      organizationId,
    },
  });

  if (!member) return toActionState("ERROR", "Member not found.");

  if (member.role === "owner")
    return toActionState("ERROR", "Cannot change permissions for an owner.");

  await prisma.member.update({
    where: {
      id: member.id,
    },
    data: {
      [permissionType]: value,
    },
  });

  revalidatePath(organizationMembershipPagePath(organizationId));
  return toActionState("SUCCESS", "Permission updated successfully.");
};

export default togglePermission;
