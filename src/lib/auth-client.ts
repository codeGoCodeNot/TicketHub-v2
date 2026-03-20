import { nextCookies } from "better-auth/next-js";
import { createAuthClient } from "better-auth/react";
import {
  inferAdditionalFields,
  organizationClient,
} from "better-auth/client/plugins";
import { auth } from "./auth";

export const authClient = createAuthClient({
  plugins: [
    inferAdditionalFields<typeof auth>(),
    nextCookies(),
    organizationClient(),
  ],
});
