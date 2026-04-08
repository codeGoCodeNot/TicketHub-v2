import prisma from "@/lib/prisma";
import Stripe from "stripe";

export const deleteStripeSubscription = async (
  subscription: Stripe.Subscription,
) => {
  await prisma.stripeCustomer.update({
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
};
