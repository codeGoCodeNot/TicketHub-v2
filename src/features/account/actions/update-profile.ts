"use server";

import fromErrorToActionState, {
  ActionState,
  toActionState,
} from "@/components/form/utils/to-action-state";
import getAuthOrRedirect from "@/features/auth/queries/get-auth-or-redirect";
import { auth } from "@/lib/auth";
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
  await getAuthOrRedirect();

  try {
    const { email, name, image } = updateProfileSchema.parse(
      Object.fromEntries(formData),
    );

    await auth.api.changeEmail({
      body: {
        newEmail: email,
      },
      headers: await headers(),
    });

    await auth.api.updateUser({
      body: {
        name,
        image,
      },
      headers: await headers(),
    });
  } catch (error) {
    return fromErrorToActionState(error, formData);
  }

  revalidatePath(accountProfilePagePath());
  return toActionState("SUCCESS", "Profile updated successfully");
};

export default updateProfile;
