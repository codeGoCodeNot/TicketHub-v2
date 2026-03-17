"use server";

import fromErrorToActionState, {
  ActionState,
  toActionState,
} from "@/components/form/utils/to-action-state";
import { auth } from "@/lib/auth";
import { passwordSchema } from "@/lib/validation";
import { ticketsPagePath } from "@/path";
import { redirect } from "next/navigation";
import z from "zod";

const passwordResetSchema = z.object({
  newPassword: passwordSchema,
  confirmPassword: passwordSchema,
});

const passwordReset = async (_actionState: ActionState, formData: FormData) => {
  try {
    const { newPassword, confirmPassword } = passwordResetSchema.parse(
      Object.fromEntries(formData),
    );
    if (newPassword !== confirmPassword) {
      return toActionState("ERROR", "Passwords do not match", formData);
    }

    await auth.api.resetPassword({
      body: {
        newPassword,
      },
    });
  } catch (error) {
    return fromErrorToActionState(error, formData);
  }

  redirect(ticketsPagePath());
};

export default passwordReset;
