"use server";

import fromErrorToActionState, {
  toActionState,
} from "@/components/form/utils/to-action-state";
import getAuthOrRedirect from "@/features/auth/queries/get-auth-or-redirect";
import prisma from "@/lib/prisma";
import { organizationCredentialsPagePath } from "@/path";
import { revalidatePath } from "next/cache";

const revokeCredential = async (organizationId: string, id: string) => {
  await getAuthOrRedirect();

  try {
    const credential = await prisma.credential.findUnique({
      where: {
        id,
      },
      select: {
        name: true,
      },
    });

    await prisma.credential.update({
      where: { id },
      data: { revokedAt: new Date() },
    });

    await prisma.activityLog.create({
      data: {
        organizationId,
        action: "credential_revoked",
        detail: `Credential "${credential?.name ?? id}" was revoked.`,
      },
    });
  } catch (error) {
    return fromErrorToActionState(error);
  }

  revalidatePath(organizationCredentialsPagePath(organizationId));
  return toActionState("SUCCESS", "Credential revoked successfully.");
};

export default revokeCredential;
