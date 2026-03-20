import { redirect } from "next/navigation";
import getAuth from "../actions/get-auth";
import { emailVerificationPagePath, signInPagePath } from "@/path";

const getAuthOrRedirect = async () => {
  const user = await getAuth();

  if (!user) {
    redirect(signInPagePath());
  }

  if (!user?.emailVerified) redirect(emailVerificationPagePath());

  return user;
};

export default getAuthOrRedirect;
