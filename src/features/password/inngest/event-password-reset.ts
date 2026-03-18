import { inngest } from "@/lib/inngest";
import prisma from "@/lib/prisma";
import { sendEmailPasswordReset } from "../emails/send-email-password-reset";

export const passwordResetEvent = inngest.createFunction(
  {
    id: "password-reset",
    triggers: { event: "app/password.password-reset" },
    retries: 6,
  },

  async ({ event, step }) => {
    await step.sleep("wait-1-min", "1m"); // 5 minutes

    const { userId } = event.data;

    const user = await prisma.user.findUniqueOrThrow({
      where: { id: userId },
    });

    const result = await sendEmailPasswordReset(user.email, user.name);

    return { event, body: result };
  },
);
