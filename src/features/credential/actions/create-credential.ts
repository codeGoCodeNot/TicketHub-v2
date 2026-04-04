"use server";

import fromErrorToActionState, {
  ActionState,
  toActionState,
} from "@/components/form/utils/to-action-state";
import getAuthOrRedirect from "@/features/auth/queries/get-auth-or-redirect";
import { organizationCredentialsPagePath } from "@/path";
import { revalidatePath } from "next/cache";
import z from "zod";
import crypto from "node:crypto";
import { hashPassword } from "@/utils/password";
import prisma from "@/lib/prisma";

const createCredentialSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(191, "Name must be less than 191 characters"),
});

const createCredential = async (
  organizationId: string,
  _actionState: ActionState,
  formData: FormData,
) => {
  await getAuthOrRedirect();

  let secret;

  try {
    const { name } = createCredentialSchema.parse(Object.fromEntries(formData));
    secret = crypto.randomBytes(32).toString("hex");

    const secretHash = await hashPassword(secret);

    await prisma.credential.create({
      data: {
        name,
        secretHash,
        organizationId,
      },
    });
  } catch (error) {
    return fromErrorToActionState(error);
  }

  revalidatePath(organizationCredentialsPagePath(organizationId));

  return toActionState(
    "SUCCESS",
    `Copy the secret, we will not show it again: ${secret}`,
  );
};

export default createCredential;
