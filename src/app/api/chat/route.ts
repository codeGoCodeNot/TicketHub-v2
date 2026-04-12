import { convertToModelMessages, streamText, UIMessage } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { redis } from "@/lib/ratelimit";

export const POST = async (request: Request) => {
  const { messages }: { messages: UIMessage[] } = await request.json();

  // get last message and create a cache key based on its text content
  const lastMessage = messages[messages.length - 1];
  const cacheKey = `chat:${lastMessage.parts.map((part: any) => part.text).join(":")}`;

  // check if we have a cached response for this message
  const cached = await redis.get(cacheKey);

  if (cached) {
    return new Response(cached as string, {
      headers: { "Content-Type": "text/plain" },
    });
  }

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
      // cache the response for 1 hour
      await redis.set(cacheKey, text, { ex: 60 * 60 });
    },
  });

  return result.toUIMessageStreamResponse();
};
