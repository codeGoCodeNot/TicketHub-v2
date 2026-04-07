import "dotenv/config";
import prisma from "../prisma";
import { stripe } from "./stripe";

const seed = async () => {
  const t0 = performance.now();
  console.log("Seeding Stripe data...");

  const prices = await stripe.prices.list();
  const products = await stripe.products.list();
  const customers = await stripe.customers.list();

  for (const price of prices.data) {
    await stripe.prices.update(price.id, {
      active: false,
    });
  }

  for (const product of products.data) {
    await stripe.products.update(product.id, {
      active: false,
    });
  }

  for (const customer of customers.data) {
    await stripe.customers.del(customer.id);
  }

  const organization = await prisma.organization.findMany({
    include: {
      members: {
        include: {
          user: true,
        },
      },
    },
  });

  for (const org of organization) {
    const customer = await stripe.customers.create({
      name: org.name,
      email: org.members[0].user.email,
      metadata: {
        organizationId: org.id,
      },
    });

    await prisma.stripeCustomer.upsert({
      where: {
        organizationId: org.id,
      },
      update: {
        customerId: customer.id,
      },
      create: {
        customerId: customer.id,
        organizationId: org.id,
      },
    });
  }

  const productOne = await stripe.products.create({
    name: "Business Plan",
    description: "The best plan for growing businesses.",
    marketing_features: [
      {
        name: "Cancel anytime",
      },
    ],
  });

  const productTwo = await stripe.products.create({
    name: "Basic Plan",
    description: "A great plan for small businesses.",
    marketing_features: [
      {
        name: "Cancel anytime",
      },
    ],
  });

  await stripe.prices.create({
    product: productTwo.id,
    unit_amount: 1999,
    currency: "usd",
    recurring: {
      interval: "year",
    },
  });

  await stripe.prices.create({
    product: productTwo.id,
    unit_amount: 199,
    currency: "usd",
    recurring: {
      interval: "month",
    },
  });

  await stripe.prices.create({
    product: productOne.id,
    unit_amount: 4999,
    currency: "usd",
    recurring: {
      interval: "year",
    },
  });

  await stripe.prices.create({
    product: productOne.id,
    unit_amount: 499,
    currency: "usd",
    recurring: {
      interval: "month",
    },
  });

  const t1 = performance.now();
  console.log(
    `Stripe data seeded in ${((t1 - t0) / 1000).toFixed(2)} seconds.`,
  );
};

seed();
