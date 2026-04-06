import { inngest } from "@/lib/inngest";
import prisma from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

const organizationCreatedEvent = inngest.createFunction(
  {
    id: "organization-created",
    triggers: { event: "app/organization-created" },
  },
  async ({
    event,
  }: {
    event: { data: { organizationId: string; byEmail: string } };
  }) => {
    const { organizationId, byEmail } = event.data;

    const organization = await prisma.organization.findFirstOrThrow({
      where: { id: organizationId },
      include: {
        members: {
          include: {
            user: true,
          },
        },
      },
    });

    const stripeCustomer = await stripe.customers.create({
      name: organization.name,
      email: byEmail,
      metadata: {
        organizationId: organization.id,
      },
    });

    await prisma.stripeCustomer.create({
      data: {
        customerId: stripeCustomer.id,
        organizationId,
      },
    });

    return { event, body: true };
  },
);

export default organizationCreatedEvent;
