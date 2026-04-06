"use server";

import fromErrorToActionState, {
  ActionState,
  toActionState,
} from "@/components/form/utils/to-action-state";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { forgotPasswordRateLimit } from "@/lib/ratelimit";
import { getIp } from "@/utils/get-ip";
import { headers } from "next/headers";
import z from "zod";

const passwordForgotSchema = z.object({
  email: z.email({ message: "Please enter a valid email" }),
});

const passwordForgot = async (
  _actionState: ActionState,
  formData: FormData,
) => {
  const ip = await getIp();
  const { success, reset } = await forgotPasswordRateLimit.limit(ip);

  if (!success) {
    const resetIn = Math.ceil((reset - Date.now()) / 1000 / 60);
    return toActionState(
      "ERROR",
      `Too many attempts. Please try again in ${resetIn} minutes.`,
      formData,
    );
  }

  try {
    const { email } = passwordForgotSchema.parse(Object.fromEntries(formData));
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return toActionState("ERROR", "Incorrect email", formData);
    }

    await auth.api.requestPasswordReset({
      body: {
        email,
        redirectTo: `https://tickethubv2.johnsenb.dev/password-reset`,
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
