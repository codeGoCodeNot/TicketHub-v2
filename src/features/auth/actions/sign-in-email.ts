"use server";

import fromErrorToActionState, {
  ActionState,
  toActionState,
} from "@/components/form/utils/to-action-state";
import { auth } from "@/lib/auth";
import { logInRateLimit } from "@/lib/ratelimit";
import { ticketsPagePath } from "@/path";
import { getIp } from "@/utils/get-ip";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import z from "zod";

const signInSchema = z.object({
  email: z.email({ message: "Please enter a valid email" }),
  password: z.string().min(1, { message: "Password is required" }),
});

const signInEmail = async (_actionState: ActionState, formData: FormData) => {
  const ip = await getIp();
  const { success, reset } = await logInRateLimit.limit(ip);

  if (!success) {
    const resetIn = Math.ceil((reset - Date.now()) / 1000 / 60);
    return toActionState(
      "ERROR",
      `Too many login attempts. Please try again in ${resetIn} minutes.`,
    );
  }

  try {
    const { email, password } = signInSchema.parse(
      Object.fromEntries(formData),
    );

    await auth.api.signInEmail({
      body: {
        email,
        password,
      },
      headers: await headers(),
    });
  } catch (error) {
    return fromErrorToActionState(error, formData);
  }

  redirect(ticketsPagePath());
};

export default signInEmail;
