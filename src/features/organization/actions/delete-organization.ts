"use server";

import fromErrorToActionState, {
  toActionState,
} from "@/components/form/utils/to-action-state";
import { auth } from "@/lib/auth";
import { organizationPagePath } from "@/path";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import getOrganizationsByUser from "../queries/get-organizations-by-user";

const deleteOrganization = async (organizationId: string) => {
  try {
    const organizations = await getOrganizationsByUser();

    const canDelete = organizations.some(
      ({ organization }) => organization.id === organizationId,
    );

    if (!canDelete)
      return toActionState(
        "ERROR",
        "You are not a member of this organization",
      );

    await auth.api.deleteOrganization({
      headers: await headers(),
      body: {
        organizationId,
      },
    });
  } catch (error) {
    return fromErrorToActionState(error);
  }

  revalidatePath(organizationPagePath());
  return toActionState("SUCCESS", "Deleted organization successfully");
};

export default deleteOrganization;
