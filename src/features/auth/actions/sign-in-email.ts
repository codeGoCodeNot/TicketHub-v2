"use server";

import fromErrorToActionState, {
  ActionState,
} from "@/components/form/utils/to-action-state";
import { auth } from "@/lib/auth";
import { ticketsPagePath } from "@/path";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import z from "zod";

const signInSchema = z.object({
  email: z.email({ message: "Please enter a valid email" }),
  password: z.string().min(1, { message: "Password is required" }),
});

const signInEmail = async (_actionState: ActionState, formData: FormData) => {
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
