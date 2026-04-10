"use server";

import { toActionState } from "@/components/form/utils/to-action-state";
import getAuthOrRedirect from "@/features/auth/queries/get-auth-or-redirect";
import prisma from "@/lib/prisma";
import { organizationActivityLogPagePath } from "@/path";
import { revalidatePath } from "next/cache";

const deleteLogs = async (organizationId: string, id: string) => {
  await getAuthOrRedirect();

  try {
    await prisma.activityLog.delete({
      where: {
        id,
      },
    });
  } catch (error) {
    return toActionState("ERROR", "Failed to delete logs. Please try again.");
  }

  revalidatePath(organizationActivityLogPagePath(organizationId));
  return toActionState("SUCCESS", "Logs deleted successfully.");
};

export default deleteLogs;
