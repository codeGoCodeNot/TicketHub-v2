"use server";

import { setCookieByKey } from "@/actions/cookies";
import fromErrorToActionState, {
  ActionState,
} from "@/components/form/utils/to-action-state";
import { auth } from "@/lib/auth";
import getAuth from "@/lib/get-auth";
import { inngest } from "@/lib/inngest";
import prisma from "@/lib/prisma";
import {
  organizationActivityLogPagePath,
  organizationPagePath,
  signInPagePath,
} from "@/path";
import { revalidatePath } from "next/cache";
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

  let createOrgId: string | undefined;

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

    createOrgId = createdOrg.id;

    await inngest.send({
      name: "app/organization-created",
      data: {
        organizationId: createdOrg.id,
        byEmail: user.email,
      },
    });

    await auth.api.setActiveOrganization({
      headers: await headers(),
      body: {
        organizationId: createdOrg.id,
      },
    });

    await prisma.activityLog.create({
      data: {
        organizationId: createdOrg.id,
        action: "organization_created",
        detail: `Organization "${createdOrg.name}" was created.`,
      },
    });
  } catch (error) {
    return fromErrorToActionState(error);
  }

  if (createOrgId) revalidatePath(organizationActivityLogPagePath(createOrgId));

  await setCookieByKey("toast", "Organization created successfully");
  redirect(organizationPagePath());
};

export default createOrganization;
