import { inngest } from "@/lib/inngest";
import prisma from "@/lib/prisma";
import { sendEmailVerification } from "../emails/send-email-verification";

export const eventEmailVerification = inngest.createFunction(
  {
    id: "email-verification",
    triggers: { event: "app/password.email-verification" },
  },
  async ({ event }) => {
    const { userId, name, email, url } = event.data;

    let userName: string | null | undefined = name;
    let userEmail: string | undefined = email;
    if (!userName || !userEmail) {
      const user = await prisma.user.findUniqueOrThrow({
        where: { id: userId },
      });
      userName = user.name;
      userEmail = user.email;
    }

    const result = await sendEmailVerification(userName, userEmail, url);
    return { event, body: result };
  },
);
