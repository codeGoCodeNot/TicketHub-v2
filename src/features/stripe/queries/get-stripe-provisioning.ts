import prisma from "@/lib/prisma";
import { stripe } from "@/lib/stripe/stripe";

const getStripeProvisioning = async (
  organizationId: string | null | undefined,
) => {
  if (!organizationId) {
    return {
      allowedMembers: 0,
      currentMembers: 0,
    };
  }

  const [membershipCount, invitationCount, stripeCustomer] =
    await prisma.$transaction([
      prisma.member.count({
        where: { organizationId },
      }),
      prisma.invitation.count({
        where: { organizationId },
      }),
      prisma.stripeCustomer.findUnique({
        where: { organizationId },
      }),
    ]);

  const currentMembers = membershipCount + invitationCount;
  const isActive =
    stripeCustomer?.subscriptionStatus === "active" ||
    stripeCustomer?.subscriptionStatus === "trialing";

  if (!isActive || !stripeCustomer.productId) {
    return {
      allowedMembers: 1,
      currentMembers,
      hasActivePlan: false,
    };
  }

  const product = await stripe.products.retrieve(stripeCustomer.productId);

  return {
    allowedMembers: +product.metadata.allowedMembers,
    currentMembers,
    hasActivePlan: true,
  };
};

export default getStripeProvisioning;
