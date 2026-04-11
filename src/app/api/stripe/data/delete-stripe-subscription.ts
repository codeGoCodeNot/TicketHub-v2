import * as stripeData from "@/features/stripe/data";
import prisma from "@/lib/prisma";
import Stripe from "stripe";

export const deleteStripeSubscription = async (
  subscription: Stripe.Subscription,
  eventAt: number,
) => {
  const stripeCustomer = await prisma.stripeCustomer.findUniqueOrThrow({
    where: { customerId: subscription.customer as string },
  });

  if (stripeCustomer.eventAt && stripeCustomer.eventAt >= eventAt) return;

  const updated = await prisma.stripeCustomer.update({
    where: {
      customerId: subscription.customer as string,
    },
    data: {
      subscriptionId: null,
      subscriptionStatus: null,
      productId: null,
      priceId: null,
      eventAt,
    },
  });

  await stripeData.deprovisionOrganization(updated.organizationId, 1);
};
