import { hashPassword, verifyPassword } from "@/utils/password";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { inngest } from "./inngest";
import prisma from "./prisma";
import { organization } from "better-auth/plugins";

export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  trustedOrigins: ["https://tickethubv2.johnsenb.dev", "http://localhost:3000"],
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  user: {
    changeEmail: {
      enabled: true,
      sendChangeEmailConfirmation: async ({ user, url, newEmail }) => {
        await inngest.send({
          name: "app/password.email-change",
          data: {
            userId: user.id,
            newEmail,
            url,
          },
        });
      },
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      await inngest.send({
        name: "app/password.email-verification",
        data: {
          userId: user.id,
          url,
        },
      });
    },
  },
  emailAndPassword: {
    enabled: true,
    password: {
      hash: hashPassword,
      verify: verifyPassword,
    },
    sendResetPassword: async ({ user, url }) => {
      await inngest.send({
        name: "app/password.password-reset",
        data: {
          userId: user.id,
          url,
        },
      });
    },
    onPasswordReset: async ({ user }) => {
      await inngest.send({
        name: "app/password.password-reset-success",
        data: {
          userId: user.id,
        },
      });
    },
  },
  socialProviders: {
    google: {
      prompt: "select_account",
      accessType: "offline",
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 30, // 30 days
    updateAge: 60 * 60 * 24,
  },
  plugins: [nextCookies(), organization()],
});
