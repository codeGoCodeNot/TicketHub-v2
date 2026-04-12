import { convertToModelMessages, streamText, UIMessage } from "ai";
import { anthropic } from "@ai-sdk/anthropic";

export const POST = async (request: Request) => {
  const { messages }: { messages: UIMessage[] } = await request.json();

  const result = streamText({
    model: anthropic("claude-haiku-4-5-20251001"),
    system:
      "You are a helpful assistant for a ticketing system called TicketHub.",
    messages: await convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
};
