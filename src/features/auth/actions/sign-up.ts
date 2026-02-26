"use server";

import fromErrorToActionState, {
  ActionState,
} from "@/components/form/utils/to-action-state";
import { auth } from "@/lib/auth";
import { passwordSchema } from "@/lib/validation";
import { ticketsPagePath } from "@/path";
import { redirect } from "next/navigation";
import z from "zod";

const signUpSchema = z
  .object({
    name: z.string().min(1, { message: "Name is required" }),
    email: z.email({ message: "Please enter a valid email" }),
    password: passwordSchema,
    confirmPassword: z.string().min(1, { message: "Please confirm password" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const signUp = async (_actionState: ActionState, formData: FormData) => {
  try {
    const { name, email, password } = signUpSchema.parse(
      Object.fromEntries(formData),
    );

    await auth.api.signUpEmail({
      body: {
        name,
        email,
        password,
      },
    });
  } catch (error) {
    return fromErrorToActionState(error, formData);
  }

  redirect(ticketsPagePath());
};

export default signUp;
