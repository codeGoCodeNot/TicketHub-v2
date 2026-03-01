"use server";

import fromErrorToActionState, {
  ActionState,
  toActionState,
} from "@/components/form/utils/to-action-state";
import getAuthOrRedirect from "@/features/auth/queries/get-auth-or-redirect";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { accountProfilePagePath } from "@/path";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import z from "zod";

const updateProfileSchema = z.object({
  email: z.email({ message: "Please enter a valid email" }),
  name: z.string().min(1, { message: "Username is required" }),
  image: z.string().optional().nullable(),
});

const updateProfile = async (_actionState: ActionState, formData: FormData) => {
  const sessionUser = await getAuthOrRedirect();

  try {
    const { email, name, image } = updateProfileSchema.parse(
      Object.fromEntries(formData),
    );

    const user = await prisma.user.findUnique({
      where: { id: sessionUser.id },
      select: { email: true, name: true },
    });

    if (!user) {
      return toActionState("ERROR", "User not found");
    }

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedName = name.trim();

    const isEmailChanged = normalizedEmail !== user.email.toLowerCase();
    const isNameChanged = normalizedName !== user.name;
    const changeCount = Number(isEmailChanged) + Number(isNameChanged);

    if (changeCount !== 1) {
      return toActionState(
        "ERROR",
        "Change exactly one field: email or username.",
      );
    }

    if (isEmailChanged) {
      await auth.api.changeEmail({
        body: {
          newEmail: normalizedEmail,
        },
        headers: await headers(),
      });
    }

    if (isNameChanged) {
      await auth.api.updateUser({
        body: {
          name: normalizedName,
          image,
        },
        headers: await headers(),
      });
    }
  } catch (error) {
    return fromErrorToActionState(error, formData);
  }

  revalidatePath(accountProfilePagePath());
  return toActionState("SUCCESS", "Profile updated successfully");
};

export default updateProfile;
