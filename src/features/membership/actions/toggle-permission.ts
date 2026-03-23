"use server";

import {
  ActionState,
  toActionState,
} from "@/components/form/utils/to-action-state";
import getAuthOrRedirect from "@/features/auth/queries/get-auth-or-redirect";
import prisma from "@/lib/prisma";
import { organizationMembershiPagePath } from "@/path";
import { revalidatePath } from "next/cache";

const togglePermission = async (
  userId: string,
  organizationId: string,
  canDeleteTickets: boolean,
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

  await prisma.member.update({
    where: {
      id: member.id,
    },
    data: {
      canDeleteTickets,
    },
  });

  revalidatePath(organizationMembershiPagePath(organizationId));
  return toActionState("SUCCESS", "Permission updated successfully.");
};

export default togglePermission;
