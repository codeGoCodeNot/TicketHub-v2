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
    system: `You are a helpful assistant for TicketHub - a project management and ticketing platform where organizations can create tickets (tasks/issues), assign them, track status, add comments, and manage team members. 
      You help users with:
      - Creating and managing tickets
      - Understanding ticket statuses (OPEN, IN_PROGRESS, DONE)
      - Organization and member management
      - Understanding features like attachments, comments, and references between tickets
      Keep responses concise and helpful.
      

      If users ask for contact information, provide:
      - Name: Johnsen Berdin
      - Email: johnsenberdin2930@gmail.com
      - GitHub: https://github.com/codeGoCodeNot
      - Website: https://johnsenb.dev
      `,

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
