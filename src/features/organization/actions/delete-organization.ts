"use server";

import { setCookieByKey } from "@/actions/cookies";
import fromErrorToActionState, {
  toActionState,
} from "@/components/form/utils/to-action-state";
import { auth } from "@/lib/auth";
import { getSession } from "@/lib/get-session";
import { headers } from "next/headers";
import getOrganizationsByUser from "../queries/get-organizations-by-user";

const deleteOrganization = async (organizationId: string) => {
  const session = await getSession();
  const isActive = session?.session.activeOrganizationId === organizationId;

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
    console.log("Error deleting organization", error);
    return fromErrorToActionState(error);
  }

  if (isActive)
    await setCookieByKey("toast", "Deleted organization successfully");

  return toActionState("SUCCESS", "Deleted organization successfully");
};

export default deleteOrganization;
