import React, { useEffect, useRef } from "react";
import type { AiResponse } from "@/redux/slices/chat/types";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useAppSelector, type RootState } from "@/redux/store";
import Markdown from "react-markdown";
import RenderGenUiComponent from "./gen_ui/RenderGenUiComponent";

const ChatMessages: React.FC = () => {
  const messages = useAppSelector((state: RootState) => state.chat.messages);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

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
    <div className="flex max-w-2xl w-full min-w-3xl flex-col-reverse gap-3 mt-5">
      {messages?.map((msg) => {
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
                      // For special components, pass the whole object. For others, pass comp.data.
                      const componentData = specialComponentTypes.includes(
                        comp.type
                      )
                        ? comp
                        : comp.data;

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
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessages;
