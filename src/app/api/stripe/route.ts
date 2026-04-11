import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import * as stripeData from "./data";

const handleSubscriptionCreated = async (
  subscription: Stripe.Subscription,
  eventAt: number,
) => {
  await stripeData.createStripeSubscription(subscription, eventAt);
};

const handleSubscriptionUpdated = async (
  subscription: Stripe.Subscription,
  eventAt: number,
) => {
  await stripeData.updateStripeSubscription(subscription, eventAt);
};

const handleSubscriptionDeleted = async (
  subscription: Stripe.Subscription,
  eventAt: number,
) => {
  await stripeData.deleteStripeSubscription(subscription, eventAt);
};

export const POST = async (request: Request) => {
  const body = await request.text();
  const signature = (await headers()).get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret)
    return new NextResponse("Webhook secret not configured", { status: 500 });

  if (!signature)
    return new NextResponse("Missing Stripe signature", { status: 400 });

  let event: Stripe.Event | null = null;

  try {
    event = Stripe.webhooks.constructEvent(body, signature, webhookSecret);

    switch (event.type) {
      case "customer.subscription.created":
        await handleSubscriptionCreated(event.data.object, event.created);
        break;
      case "customer.subscription.updated":
        await handleSubscriptionUpdated(event.data.object, event.created);
        break;
      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(event.data.object, event.created);
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return new NextResponse("Event received", { status: 200 });
  } catch (error) {
    console.error("Webhook error:", error);
    return new NextResponse("Invalid webhook event", { status: 400 });
  }
};
