import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

const tickets = [
  {
    title: "Issue with login",
    content: "Unable to login with correct credentials.",
    status: "OPEN" as const,
  },
  {
    title: "Page not loading",
    content: "The dashboard page is not loading for some users.",
    status: "DONE" as const,
  },

  {
    title: "Missing user permissions",
    content: "Some users are unable to access certain features.",
    status: "IN_PROGRESS" as const,
  },
];

export const seed = async () => {
  const t0 = performance.now();
  console.log("Seeding database with initial data...");

  await prisma.ticket.deleteMany();

  await prisma.ticket.createMany({
    data: tickets,
  });

  const t1 = performance.now();
  console.log(`Seeding completed in ${(t1 - t0).toFixed(2)} milliseconds.`);
};
seed();
