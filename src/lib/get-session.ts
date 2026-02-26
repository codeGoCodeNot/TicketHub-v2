import { cache } from "react";
import { auth } from "./auth";
import { headers } from "next/headers";

export const getSession = cache(async () => {
  console.log("getSession called");
  return await auth.api.getSession({
    headers: await headers(),
  });
});
