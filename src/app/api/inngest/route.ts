import { serve } from "inngest/next";
import { inngest } from "@/lib/inngest";
import { passwordResetEvent } from "@/features/password/inngest/event-password-reset";
import { passwordResetEventSuccess } from "@/features/password/inngest/event-password-reset-success";
import { emailChangeEvent } from "@/features/password/inngest/event-email-change";
import { eventEmailVerification } from "@/features/password/inngest/event-email-verification";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    passwordResetEvent,
    passwordResetEventSuccess,
    emailChangeEvent,
    eventEmailVerification,
  ],
});
