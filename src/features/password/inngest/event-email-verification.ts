import { inngest } from "@/lib/inngest";
import prisma from "@/lib/prisma";
import { sendEmailVerification } from "../emails/send-email-verification";

export const eventEmailVerification = inngest.createFunction(
  {
    id: "email-verification",
    triggers: { event: "app/password.email-verification" },
  },
  async ({ event }: { event: { data: { userId: string; url: string } } }) => {
    const { userId, url } = event.data;

    const user = await prisma.user.findUniqueOrThrow({
      where: { id: userId },
    });

    const result = await sendEmailVerification(user.name, user.email, url);
    return { event, body: result };
  },
);
