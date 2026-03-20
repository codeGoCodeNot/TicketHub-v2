import getOrganizationsByUser from "@/features/organization/queries/get-organizations-by-user";
import { emailVerificationPagePath, onboardPath, signInPagePath } from "@/path";
import { redirect } from "next/navigation";
import getAuth from "../../../lib/get-auth";

const getAuthOrRedirect = async () => {
  const user = await getAuth();
  const organizations = await getOrganizationsByUser();

  if (!user) {
    redirect(signInPagePath());
  }

  if (!user?.emailVerified) redirect(emailVerificationPagePath());

  if (!organizations.length) {
    redirect(onboardPath());
  }

  return user;
};

export default getAuthOrRedirect;
