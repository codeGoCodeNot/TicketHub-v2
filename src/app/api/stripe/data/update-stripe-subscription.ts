import prisma from "@/lib/prisma";
import { stripe } from "@/lib/stripe/stripe";
import Stripe from "stripe";
import * as stripeData from "@/features/stripe/data";

export const updateStripeSubscription = async (
  subscription: Stripe.Subscription,
) => {
  const productId = subscription.items.data[0].price.product as string;

  const stripeCustomer = await prisma.stripeCustomer.update({
    where: { customerId: subscription.customer as string },
    data: {
      subscriptionId: subscription.id,
      subscriptionStatus: subscription.status,
      productId: subscription.items.data[0].price.product as string,
      priceId: subscription.items.data[0].price.id,
    },
  });

  const product = await stripe.products.retrieve(productId);
  const allowedMembers =
    subscription.status === "canceled" ? 1 : +product.metadata.allowedMembers;

  await stripeData.deprovisionOrganization(
    stripeCustomer.organizationId,
    allowedMembers,
  );
};
