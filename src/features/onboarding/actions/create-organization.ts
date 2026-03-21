"use server";

import { setCookieByKey } from "@/actions/cookies";
import fromErrorToActionState, {
  ActionState,
} from "@/components/form/utils/to-action-state";
import { auth } from "@/lib/auth";
import getAuth from "@/lib/get-auth";
import { signInPagePath, ticketsPagePath } from "@/path";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import z from "zod";

const createOrganizationSchema = z.object({
  name: z.string().min(1, "Organization name is required").max(191),
});

const createOrganization = async (
  _actionState: ActionState,
  _formData: FormData,
) => {
  const user = await getAuth();

  if (!user) redirect(signInPagePath());

  try {
    const data = createOrganizationSchema.parse(
      Object.fromEntries(_formData.entries()),
    );

    const createdOrg = await auth.api.createOrganization({
      headers: await headers(),
      body: {
        name: data.name,
        slug: data.name.toLowerCase().replace(/\s+/g, "-"),
      },
    });

    await auth.api.setActiveOrganization({
      headers: await headers(),
      body: {
        organizationId: createdOrg.id,
      },
    });
  } catch (error) {
    return fromErrorToActionState(error);
  }

  await setCookieByKey("toast", "Organization created successfully");
  redirect(ticketsPagePath());
};

export default createOrganization;
