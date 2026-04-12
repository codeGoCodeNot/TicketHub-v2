"use server";

import { toActionState } from "@/components/form/utils/to-action-state";
import getAuthOrRedirect from "@/features/auth/queries/get-auth-or-redirect";
import prisma from "@/lib/prisma";
import { stripe } from "@/lib/stripe/stripe";
import { selectActiveOrganizationPath, subscriptionPagePath } from "@/path";
import { redirect } from "next/navigation";

const createCheckoutSession = async (
  organizationId: string | null | undefined,
  priceId: string,
) => {
  if (!organizationId) redirect(selectActiveOrganizationPath());

  await getAuthOrRedirect();

  let stripeCustomer = await prisma.stripeCustomer.findUnique({
    where: {
      organizationId,
    },
  });

  if (!stripeCustomer) {
    const organization = await prisma.organization.findUniqueOrThrow({
      where: {
        id: organizationId,
      },
    });

    const customer = await stripe.customers.create({
      name: organization.name,
      metadata: {
        organizationId,
      },
    });

    stripeCustomer = await prisma.stripeCustomer.create({
      data: {
        customerId: customer.id,
        organizationId,
      },
    });
  }

  const session = await stripe.checkout.sessions.create({
    customer: stripeCustomer.customerId,
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: "subscription",
    success_url: `${process.env.BETTER_AUTH_URL}${subscriptionPagePath(organizationId)}?success=true`,
    cancel_url: `${process.env.BETTER_AUTH_URL}${subscriptionPagePath(organizationId)}?canceled=true`,
  });

  if (!session.url)
    return toActionState("ERROR", "Failed to create checkout session");

  redirect(session.url);
};

export default createCheckoutSession;
