"use client";

import { useState } from "react";
import { useChat } from "@ai-sdk/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LucideMessageSquare, LucideSend, LucideX } from "lucide-react";

const AiChatBot = () => {
  const [input, setInput] = useState("");
  const { messages, sendMessage } = useChat();
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {open && (
        <div className="w-80 bg-background border rounded-lg flex flex-col overflow-hidden">
          <div className="flex items-center justify-between p-3 border-b">
            <span className="text-sm font-medium">Tickethub Ai Assistant</span>
            <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
              <LucideX className="text-red-500" />
            </Button>
          </div>
          <div className="flex flex-col gap-2 p-3 h-64 overflow-y-auto">
            {messages.map((message) => (
              <div key={message.id}>
                {message.role === "user" ? "You: " : "AI: "}
                {message.parts.map((part, idx) => {
                  switch (part.type) {
                    case "text":
                      return <span key={idx}>{part.text}</span>;
                  }
                })}
              </div>
            ))}
          </div>

          <form
            className="flex gap-2 p-3 border-t"
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage({ text: input });
              setInput("");
            }}
          >
            <Input
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />

            <Button type="submit" size="icon">
              <LucideSend />
            </Button>
          </form>
        </div>
      )}

      <Button
        className="rounded-full"
        variant="outline"
        onClick={() => setOpen((prev) => !prev)}
      >
        {open ? (
          <LucideX className="w-4 h-4" />
        ) : (
          <LucideMessageSquare className="w-4 h-4" />
        )}
      </Button>
    </div>
  );
};

export default AiChatBot;
