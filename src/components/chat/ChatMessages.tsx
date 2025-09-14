import React, { useEffect, useRef } from "react";
import { useAppSelector, type RootState } from "@/redux/store";
import type { ChatMessage } from "@/redux/slices/chat/types";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface ChatMessagesProps {
  messages?: ChatMessage[];
}

const ChatMessages: React.FC<ChatMessagesProps> = ({
  messages: propMessages,
}) => {
  const stateMessages = useAppSelector(
    (state: RootState) => state.chat.messages
  );
  const messages = propMessages ?? stateMessages;

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // 👇 Auto scroll to bottom whenever messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className=" flex max-w-4xl w-full min-w-4xl flex-col gap-3 mt-5">
      {messages.map((msg: ChatMessage) => {
        if (msg.role === "assistant") {
          const formatted_message = JSON.parse(msg.content);
          console.log(formatted_message);

          return (
            <div key={msg.id} className="flex gap-2 justify-start w-full">
              <Avatar className="h-[2.3rem] w-[2.3rem] mt-1">
                <AvatarFallback>AI</AvatarFallback>
              </Avatar>
              {/* <div>{formatted_message?.ui_components}</div> */}
              <div className="">
                <div className="bg-accent/20 p-2 text-sm border max-w-2xl px-4 flex w-fit items-center gap-2 rounded-lg">
                  {formatted_message.text_response}
                </div>
              </div>
            </div>
          );
        } else {
          return (
            <div key={msg.id} className="flex gap-2 justify-end w-full">
              <div className="p-2 border text-sm bg-accent/20 flex px-4 items-center gap-2 rounded-lg">
                <div>{msg.content}</div>
              </div>
              <Avatar className="h-[2.3rem] w-[2.3rem] mt-1">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </div>
          );
        }
      })}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessages;
