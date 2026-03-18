"use server";

import fromErrorToActionState, {
  ActionState,
  toActionState,
} from "@/components/form/utils/to-action-state";
import getAuthOrRedirect from "@/features/auth/queries/get-auth-or-redirect";
import { auth } from "@/lib/auth";
import { passwordSchema } from "@/lib/validation";
import { accountPasswordPagePath } from "@/path";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import z from "zod";

const passwordChangeSchema = z.object({
  currentPassword: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" }),
  newPassword: passwordSchema,
  confirmPassword: passwordSchema,
});

const passwordChange = async (
  _actionState: ActionState,
  formData: FormData,
) => {
  try {
    const { currentPassword, newPassword, confirmPassword } =
      passwordChangeSchema.parse(Object.fromEntries(formData));

    if (newPassword !== confirmPassword) {
      return toActionState(
        "ERROR",
        "New password and confirm password do not match.",
        formData,
      );
    }

    await auth.api.changePassword({
      body: {
        currentPassword,
        newPassword,
        // revokeOtherSessions: true,
      },
      headers: await headers(),
    });
  } catch (error) {
    return fromErrorToActionState(error, formData);
  }

  revalidatePath(accountPasswordPagePath());

  return toActionState(
    "SUCCESS",
    "Your password has been changed successfully.",
  );
};

export default passwordChange;
