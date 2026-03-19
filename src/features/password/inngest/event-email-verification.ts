import { inngest } from "@/lib/inngest";
import prisma from "@/lib/prisma";
import { sendEmailVerification } from "../emails/send-email-verification";

export const eventEmailVerification = inngest.createFunction(
  {
    id: "email-verification",
    triggers: { event: "app/password.email-verification" },
  },
  async ({ event }) => {
    const { userId, email, url } = event.data;

    let userName: string | null | undefined = undefined;
    let userEmail: string | undefined = email;
    if (!userEmail) {
      const user = await prisma.user.findUniqueOrThrow({
        where: { id: userId },
      });
      userName = user.name;
      userEmail = user.email;
    } else {
      // Optionally fetch name for personalization if needed
      const user = await prisma.user.findUnique({ where: { id: userId } });
      userName = user?.name;
    }

    const result = await sendEmailVerification(userName, userEmail, url);
    return { event, body: result };
  },
);
