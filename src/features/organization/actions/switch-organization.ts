"use server";

import fromErrorToActionState, {
  toActionState,
} from "@/components/form/utils/to-action-state";
import { auth } from "@/lib/auth";
import { organizationPagePath } from "@/path";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import getOrganizationsByUser from "../queries/get-organizations-by-user";

const switchOrganization = async (organizationId: string) => {
  try {
    const organizations = await getOrganizationsByUser();

    const canSwitch = organizations.some(
      ({ organization }) => organization.id === organizationId,
    );

    if (!canSwitch)
      return toActionState(
        "ERROR",
        "You are not a member of this organization",
      );

    await auth.api.setActiveOrganization({
      headers: await headers(),
      body: {
        organizationId,
      },
    });
  } catch (error) {
    return fromErrorToActionState(error);
  }
  revalidatePath(organizationPagePath());
  return toActionState("SUCCESS", "Switched organization successfully");
};

export default switchOrganization;
