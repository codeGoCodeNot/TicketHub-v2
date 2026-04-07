"use server";

import { toActionState } from "@/components/form/utils/to-action-state";
import prisma from "@/lib/prisma";
import { stripe } from "@/lib/stripe/stripe";
import { selectActiveOrganizationPath, subscriptionPagePath } from "@/path";
import { redirect } from "next/navigation";

const createCustomerPortal = async (
  organizationId: string | null | undefined,
) => {
  if (!organizationId) redirect(selectActiveOrganizationPath());

  const stripeCustomer = await prisma.stripeCustomer.findUnique({
    where: {
      organizationId,
    },
  });

  if (!stripeCustomer)
    return toActionState(
      "ERROR",
      "No Stripe customer found for this organization.",
    );

  const session = await stripe.billingPortal.sessions.create({
    customer: stripeCustomer.customerId,
    return_url: `${process.env.BETTER_AUTH_URL}${subscriptionPagePath(organizationId)}`,
  });

  if (!session.url)
    return toActionState(
      "ERROR",
      "Failed to create Stripe customer portal session.",
    );

  redirect(session.url);
};

export default createCustomerPortal;
