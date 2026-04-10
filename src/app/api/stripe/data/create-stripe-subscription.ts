import prisma from "@/lib/prisma";
import { Stripe } from "stripe";

export const createStripeSubscription = async (
  subscription: Stripe.Subscription,
) => {
  const stripeCustomer = await prisma.stripeCustomer.update({
    where: { customerId: subscription.customer as string },
    data: {
      subscriptionId: subscription.id,
      subscriptionStatus: subscription.status,
      productId: subscription.items.data[0].price.product as string,
      priceId: subscription.items.data[0].price.id,
    },
  });

  await Promise.all([
    prisma.activityLog.create({
      data: {
        organizationId: stripeCustomer.organizationId, // 👈 use from DB not metadata
        action: "subscription_created",
        detail: `Subscription created with status: ${subscription.status}.`,
      },
    }),
  ]);
};
