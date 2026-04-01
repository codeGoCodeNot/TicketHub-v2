"use server";

import {
  ActionState,
  toActionState,
} from "@/components/form/utils/to-action-state";
import getAuthOrRedirect from "@/features/auth/queries/get-auth-or-redirect";
import { organizationMembershipPagePath } from "@/path";
import { revalidatePath } from "next/cache";
import * as memberData from "../data";

const togglePermission = async (
  userId: string,
  organizationId: string,
  permissionType: "canDeleteTickets" | "canUpdateTickets",
  value: boolean,
  _actionState: ActionState,
) => {
  await getAuthOrRedirect();

  const member = await memberData.findMember(userId, organizationId);

  if (!member) return toActionState("ERROR", "Member not found.");

  if (member.role === "owner")
    return toActionState("ERROR", "Cannot change permissions for an owner.");

  await memberData.updateMember(member.id, {
    [permissionType]: value,
  });

  revalidatePath(organizationMembershipPagePath(organizationId));
  return toActionState("SUCCESS", "Permission updated successfully.");
};

export default togglePermission;
