import React, { useEffect, useRef } from "react";
import type { AiResponse, ChatMessage } from "@/redux/slices/chat/types";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useAppSelector, type RootState } from "@/redux/store";

const ChatMessages: React.FC = () => {
  const messages = useAppSelector((state: RootState) => state.chat.messages);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Auto scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    console.log(messages);
  }, [messages]);

  // Safely parse AI message
  const parseAiMessage = (content: string): AiResponse | null => {
    try {
      const parsed = JSON.parse(content);
      return parsed && typeof parsed.text_response === "string" ? (parsed as AiResponse) : null;
    } catch {
      return null;
    }
  };

  return (
    <div className="flex max-w-4xl w-full min-w-4xl flex-col gap-3 mt-5">
      {messages?.map((msg) => {
        if (msg.role === "assistant") {
          const aiMessage = parseAiMessage(msg.content as string);
          console.log(aiMessage);
          
          return (
            <div key={msg.id} className="flex gap-2 justify-start w-full">
              <Avatar className="h-[2.3rem] w-[2.3rem] mt-1">
                <AvatarFallback>AI</AvatarFallback>
              </Avatar>
              <div>
                <div className="bg-accent/20 p-2 text-sm border max-w-2xl px-4 flex w-fit items-center gap-2 rounded-lg">
                  {aiMessage?.text_response}
                </div>
                {aiMessage?.ui_components && (
                  <div>{aiMessage.ui_components?.type}</div>
                )}
              </div>
            </div>
          );
        }

        // User message
        return (
          <div key={msg.id} className="flex gap-2 justify-end w-full">
            <div className="p-2 border text-sm bg-accent/20 flex px-4 items-center gap-2 rounded-lg">
              {msg.content as string}
            </div>
            <Avatar className="h-[2.3rem] w-[2.3rem] mt-1">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessages;
