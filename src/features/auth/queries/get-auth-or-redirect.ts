import { redirect } from "next/navigation";
import getAuth from "../actions/get-auth";
import { signInPagePath } from "@/path";

const getAuthOrRedirect = async () => {
  const user = await getAuth();

  if (!user) {
    redirect(signInPagePath());
  }

  return user;
};

export default getAuthOrRedirect;
