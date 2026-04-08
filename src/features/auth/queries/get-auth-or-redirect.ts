import getOrganizationsByUser from "@/features/organization/queries/get-organizations-by-user";
import {
  emailVerificationPagePath,
  onboardPath,
  selectActiveOrganizationPath,
  signInPagePath,
} from "@/path";
import { redirect } from "next/navigation";
import getAuth from "../../../lib/get-auth";
import { getSession } from "@/lib/get-session";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const getAuthOrRedirect = async () => {
  const user = await getAuth();
  const organizations = await getOrganizationsByUser();

  const session = await getSession();

  if (!user) {
    redirect(signInPagePath());
  }

  if (!user?.emailVerified) redirect(emailVerificationPagePath());

  if (!organizations.length) {
    redirect(onboardPath());
  }

  if (!session?.session.activeOrganizationId) {
    if (organizations.length === 1) {
      await auth.api.setActiveOrganization({
        headers: await headers(),
        body: {
          organizationId: organizations[0].organization.id,
        },
      });
    } else {
      redirect(selectActiveOrganizationPath());
    }
  } else {
    redirect(selectActiveOrganizationPath());
  }

  return user;
};

export default getAuthOrRedirect;
