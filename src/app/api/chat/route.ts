import { convertToModelMessages, streamText, UIMessage } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { redis } from "@/lib/ratelimit";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export const POST = async (request: Request) => {
  const { messages }: { messages: UIMessage[] } = await request.json();

  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return new Response("Unauthorized", { status: 401 });

  // get last message and create a cache key based on its text content
  const lastMessage = messages[messages.length - 1];
  const userText = lastMessage.parts.map((part: any) => part.text).join("");
  const cacheKey = `chat:${session.user.id}:${userText}`;

  const result = streamText({
    model: anthropic("claude-haiku-4-5-20251001"),
    system: `You are the official AI assistant for TicketHub v2 — a team-based ticket and task management platform.

Your job is to help users navigate and use TicketHub v2 effectively.

WHAT USERS CAN DO:
- Create and manage tickets with a title, description, bounty reward, deadline, and status
- Track ticket status: OPEN → IN_PROGRESS → DONE
- Add comments and file attachments (images, PDFs) to tickets
- Reference other tickets in comments by pasting their URL
- Mark tickets as private (paid plan only) — only visible to org members

ORGANIZATIONS:
- Create an organization and invite team members via email
- Roles: Owner, Admin, Member — each with different permissions
- Admins can grant members the ability to update or delete tickets
- Manage subscriptions: Basic Plan (up to 3 members) or Business Plan (unlimited members)

SUBSCRIPTIONS & PLANS:
- Free: 1 member only, no private tickets
- Basic Plan: $1.99/mo or $19.99/yr — up to 3 members
- Business Plan: $4.99/mo or $49.99/yr — unlimited members
- Private tickets and advanced features require an active paid plan
- Downgrading or canceling will automatically remove excess members

API ACCESS:
- Generate API credentials in your organization settings
- Use API keys to delete tickets programmatically via REST API
- Credentials can be scoped and revoked at any time

ACTIVITY LOG:
- Found under organization settings
- Tracks all important events: invitations, member changes, ticket actions, subscription changes

HOW TO GET STARTED:
1. Sign up and create your account
2. Create or join an organization
3. Invite your team members
4. Start creating tickets and tracking progress

If you cannot answer something, direct the user to contact the developer:
- Developer: Johnsen Berdin
- Email: johnsenberdin2930@gmail.com
- GitHub: https://github.com/codeGoCodeNot
- Website: https://johnsenb.dev

Always be concise, friendly, and helpful. Only answer questions related to TicketHub v2.`,

    messages: await convertToModelMessages(messages),

    onFinish: async ({ text }) => {
      const alreadySaved = await redis.get(cacheKey);

      if (!alreadySaved) {
        await redis.set(cacheKey, "1", { ex: 60 * 60 * 24 });
        await prisma.chatMessage.createMany({
          data: [
            {
              role: "user",
              content: userText,
              userId: session.user.id,
            },
            {
              role: "assistant",
              content: text,
              userId: session.user.id,
            },
          ],
        });
      }
    },
  });

  return result.toUIMessageStreamResponse();
};
