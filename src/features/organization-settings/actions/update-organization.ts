"use server";
import fromErrorToActionState, {
  ActionState,
  toActionState,
} from "@/components/form/utils/to-action-state";
import getAuthOrRedirect from "@/features/auth/queries/get-auth-or-redirect";
import { auth } from "@/lib/auth";
import uploadFile from "@/lib/upload-file";
import { organizationSettingsPagePath } from "@/path";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import z from "zod";

const updateOrganizationSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  slug: z
    .string()
    .min(1, { message: "Slug is required" })
    .regex(
      /^[a-z0-9-]+$/,
      "Slug can only contain lowercase letters, numbers and dashes",
    ),
  logo: z.custom<File>().optional(),
});

const updateOrganization = async (
  organizationId: string,
  _actionState: ActionState,
  formData: FormData,
) => {
  await getAuthOrRedirect();

  try {
    const { name, slug, logo } = updateOrganizationSchema.parse(
      Object.fromEntries(formData),
    );

    await auth.api.updateOrganization({
      headers: await headers(),
      body: {
        organizationId,
        data: { name, slug },
      },
    });

    if (logo instanceof File && logo.size > 0) {
      const buffer = Buffer.from(await logo.arrayBuffer());
      const key = `organizations/${organizationId}/logo`;

      await uploadFile({
        key,
        buffer,
        contentType: logo.type,
      });

      const logoUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}?t=${Date.now()}`;

      await auth.api.updateOrganization({
        headers: await headers(),
        body: {
          organizationId,
          data: { logo: logoUrl },
        },
      });
    }
  } catch (error) {
    return fromErrorToActionState(error, formData);
  }

  revalidatePath(organizationSettingsPagePath(organizationId));
  return toActionState("SUCCESS", "Organization updated successfully.");
};

export default updateOrganization;
