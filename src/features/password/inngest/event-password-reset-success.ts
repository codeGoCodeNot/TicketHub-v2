import { inngest } from "@/lib/inngest";
import prisma from "@/lib/prisma";
import { sendEmailPasswordResetSuccess } from "../emails/send-email-password-reset-success";

export const passwordResetEventSuccess = inngest.createFunction(
  {
    id: "password-reset-success",
    triggers: { event: "app/password.password-reset-success" },
  },
  async ({ event }: { event: { data: { userId: string } } }) => {
    const { userId } = event.data;

    const user = await prisma.user.findFirstOrThrow({
      where: { id: userId },
    });

    const result = await sendEmailPasswordResetSuccess(user.name, user.email);

    return { event, body: result };
  },
);
