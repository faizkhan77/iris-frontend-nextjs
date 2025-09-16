import React, { useEffect, useRef } from "react";
import type { AiResponse } from "@/redux/slices/chat/types";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useAppSelector, type RootState } from "@/redux/store";
import Markdown from "react-markdown";
import RenderGenUiComponent from "./gen_ui/RenderGenUiComponent";

const ChatMessages: React.FC = () => {
  const messages = useAppSelector((state: RootState) => state.chat.messages);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const chatloading = useAppSelector((state: RootState) => state.chat.loading);

  const sortedMessages = useMemo(() => {
    return [...messages].sort((a, b) => {
      const timeDiff =
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime();

      if (timeDiff !== 0) return timeDiff;

      // If created_at is the same → order by role (user first, then assistant)
      if (a.role === "user" && b.role === "assistant") return -1;
      if (a.role === "assistant" && b.role === "user") return 1;

      // fallback: sort by id (consistent unique key)
      return a.id.localeCompare(b.id);
    });
  }, [messages]);

  // Auto scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const specialComponentTypes = [
    "ranking_bar_chart",
    "clarification_options",
    "vertical_suggestions",
  ];

  return (
    <div className="flex max-w-2xl w-full min-w-3xl flex-col gap-3 mt-5">
      {sortedMessages?.map((msg) => {
        if (msg.role === "user") {
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
        } else if (msg.role === "assistant") {
          const parsedMsg = JSON.parse(msg?.content) as AiResponse;
          return (
            <div key={msg.id} className="flex gap-2 justify-start w-full">
              <Avatar className="h-[2.3rem] w-[2.3rem] mt-1">
                <AvatarFallback>AI</AvatarFallback>
              </Avatar>
              <div>
                <div className="bg-accent/20 p-2 text-sm border max-w-2xl px-4 flex w-fit items-center gap-2 rounded-lg">
                  <Markdown>{parsedMsg.text_response}</Markdown>
                </div>
                {parsedMsg.ui_components.length > 0 && (
                  <div className="mt-2 p-5 rounded-md bg-accent/20 border">
                    {parsedMsg.ui_components.map((comp, index) => {
                      return (
                        <RenderGenUiComponent
                          key={index}
                          data={componentData} // Use the prepared data object
                          title={comp?.title!}
                          type={comp?.type}
                        />
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          );
        }
      })}
      {chatloading && (
        <div className="flex gap-2 justify-start w-full">
          <Avatar className="h-[2.3rem] w-[2.3rem] mt-1">
            <AvatarFallback>AI</AvatarFallback>
          </Avatar>
          <div className="bg-accent/20 p-2 text-sm border rounded-lg text-muted-foreground">
            <div className="animate-pulse space-y-2">
              <div className="h-2 w-20 bg-muted rounded"></div>
              <div className="h-2 w-32 bg-muted rounded"></div>
            </div>
          </div>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessages;
