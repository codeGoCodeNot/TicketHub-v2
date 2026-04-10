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
import { DEFAULT_CREDENTIAL_SCOPES, scopesToString } from "../constants";

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
  const user = await getAuthOrRedirect();

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
        createdById: user.id,
        scopes: scopesToString(DEFAULT_CREDENTIAL_SCOPES),
      },
    });

    await prisma.activityLog.create({
      data: {
        organizationId,
        action: "credential_created",
        detail: `Credential "${name}" created.`,
      },
    });
  } catch (error) {
    return fromErrorToActionState(error);
  }

  revalidatePath(organizationCredentialsPagePath(organizationId));

  return toActionState(
    "SUCCESS",
    `Secret created! Copied to clipboard: ${secret}`,
  );
};

export default createCredential;
