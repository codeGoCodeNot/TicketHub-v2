import * as stripeData from "@/features/stripe/data";
import prisma from "@/lib/prisma";
import Stripe from "stripe";

export const deleteStripeSubscription = async (
  subscription: Stripe.Subscription,
) => {
  const stripeCustomer = await prisma.stripeCustomer.update({
    where: {
      customerId: subscription.customer as string,
    },
    data: {
      subscriptionId: null,
      subscriptionStatus: null,
      productId: null,
      priceId: null,
    },
  });

  await stripeData.deprovisionOrganization(stripeCustomer.organizationId, 1);
};
