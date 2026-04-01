"use server";

import fromErrorToActionState, {
  ActionState,
  toActionState,
} from "@/components/form/utils/to-action-state";
import getAuthOrRedirect from "@/features/auth/queries/get-auth-or-redirect";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import uploadFile from "@/lib/upload-file";
import { accountProfilePagePath } from "@/path";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import z from "zod";

const updateProfileSchema = z.object({
  email: z.email({ message: "Please enter a valid email" }),
  name: z.string().min(1, { message: "Username is required" }),
  image: z.custom<File>().optional(),
});

const updateProfile = async (_actionState: ActionState, formData: FormData) => {
  const sessionUser = await getAuthOrRedirect();

  try {
    const { email, name, image } = updateProfileSchema.parse(
      Object.fromEntries(formData),
    );

    const user = await prisma.user.findUnique({
      where: {
        id: sessionUser.id,
      },
    });

    if (!user) {
      return toActionState("ERROR", "User not found");
    }

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedName = name.trim();

    const isEmailChanged = normalizedEmail !== user.email.toLowerCase();
    const isNameChanged = normalizedName !== user.name;

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
        },
        headers: await headers(),
      });
    }

    if (image instanceof File && image.size > 0) {
      const buffer = Buffer.from(await image.arrayBuffer());
      const key = `users/${sessionUser.id}/profile`;

      await uploadFile({
        key,
        buffer,
        contentType: image.type,
      });

      const imageUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}?t=${Date.now()}`;

      await auth.api.updateUser({
        body: {
          image: imageUrl,
        },
        headers: await headers(),
      });
    }
  } catch (error) {
    return fromErrorToActionState(error, formData);
  }

  revalidatePath(accountProfilePagePath());
  return toActionState(
    "SUCCESS",
    "Confirmation email sent if email was changed. Please verify to update email.",
  );
};

export default updateProfile;
