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
    await prisma.credential.update({
      where: {
        id,
      },
      data: {
        revokedAt: new Date(),
      },
    });
  } catch (error) {
    return fromErrorToActionState(error);
  }

  revalidatePath(organizationCredentialsPagePath(organizationId));
  return toActionState("SUCCESS", "Credential revoked successfully.");
};

export default revokeCredential;
