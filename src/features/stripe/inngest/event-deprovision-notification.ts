import { inngest } from "@/lib/inngest";
import prisma from "@/lib/prisma";
import { sendDeprovisionEmail } from "./send-deprovision-email";

export const deprovisionNotificationEvent = inngest.createFunction(
  {
    id: "deprovision-notification",
    triggers: { event: "app/organization.deprovisioned" },
  },
  async ({ event }) => {
    const { organizationId, removedCount } = event.data;

    const owner = await prisma.member.findFirst({
      where: { organizationId, role: "owner" },
      include: { user: true },
    });

    if (!owner) return;

    const organization = await prisma.organization.findUniqueOrThrow({
      where: { id: organizationId },
    });

    const result = await sendDeprovisionEmail(
      owner.user.name,
      owner.user.email,
      organization.name,
      removedCount,
    );

    return {
      event,
      body: result,
    };
  },
);
