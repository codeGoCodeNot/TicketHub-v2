"use server";

import fromErrorToActionState, {
  ActionState,
  toActionState,
} from "@/components/form/utils/to-action-state";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import z from "zod";

const passwordForgotSchema = z.object({
  email: z.email({ message: "Please enter a valid email" }),
});

const passwordForgot = async (
  _actionState: ActionState,
  formData: FormData,
) => {
  try {
    const { email } = passwordForgotSchema.parse(Object.fromEntries(formData));

    await auth.api.requestPasswordReset({
      body: {
        email,
        redirectTo: `https://tickethubv2.johnsenb.dev/password-reset`,
        // redirectTo: "http://localhost:3000/password-reset",
      },
      headers: await headers(),
    });
  } catch (error) {
    return fromErrorToActionState(error, formData);
  }

  return toActionState(
    "SUCCESS",
    "If an account with that email exists, a password reset link has been sent.",
  );
};

export default passwordForgot;
