import { inngest } from "@/lib/inngest";
import prisma from "@/lib/prisma";
import { sendEmailChange } from "../emails/send-email-change";

export const emailChangeEvent = inngest.createFunction(
  { id: "email-change", triggers: { event: "app/password.email-change" } },
  async ({ event }) => {
    const { userId, newEmail, url } = event.data;

    const user = await prisma.user.findUniqueOrThrow({
      where: { id: userId },
    });

    const result = await sendEmailChange(user.name, user.email, newEmail, url);

    return { event, body: result };
  },
);
