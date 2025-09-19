import React, { useEffect, useMemo, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useAppSelector, type RootState } from "@/redux/store";
import LoadingJourney from "./LoadingJourney";
import TypingAnimation from "./TypingAnimation";
import AssistantMessage from "./AssitantMessage";

const ROUTE_KEYWORDS: Record<string, string[]> = {
  shareholding: ["shareholding", "promoter", "who owns", "ownership"],
  cross_agent_reasoning: ["compare", "vs", "versus", "analyze both"],
  fundamentals: ["fundamentals", "balance sheet", "p/e ratio", "roe"],
  technicals: ["technicals", "chart", "rsi", "macd", "candlesticks"],
  sentiment: ["sentiment", "news", "headlines", "market mood"],
  knowledge_base: ["what is", "explain", "define", "tell me about"],
};

const ChatMessages: React.FC = () => {
  const messages = useAppSelector((state: RootState) => state.chat.messages);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const chatloading = useAppSelector((state: RootState) => state.chat.loading);
  const [currentJourneyRoute, setCurrentJourneyRoute] = useState("unknown");

  const sortedMessages = useMemo(() => {
    return [...messages].sort((a, b) => {
      const timeDiff =
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime();

      if (timeDiff !== 0) return timeDiff;
      if (a.role === "user" && b.role === "assistant") return -1;
      if (a.role === "assistant" && b.role === "user") return 1;
      return a.id.localeCompare(b.id);
    });
  }, [messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [sortedMessages]);

  const messageContains = (message: string, keywords: string[]): boolean => {
    const lowerCaseMessage = message.toLowerCase();
    return keywords.some((keyword) => lowerCaseMessage.includes(keyword));
  };

 useEffect(() => {
  if (!chatloading) return;

  const lastUserMessage = [...messages].reverse().find(m => m.role === "user");
  if (!lastUserMessage || typeof lastUserMessage.content !== "string") return;

  const content = lastUserMessage.content;

  for (const [route, keywords] of Object.entries(ROUTE_KEYWORDS)) {
    if (messageContains(content, keywords)) {
      setCurrentJourneyRoute(route);
      return;
    }
  }

  setCurrentJourneyRoute("unknown");
}, [chatloading, messages]);
  console.log("sortedMessages:", sortedMessages);

  return (
    <div className="flex max-w-3xl w-full flex-col gap-5 mt-5">
      {sortedMessages?.map((msg) => {
        if (msg.role === "user") {
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
          return <AssistantMessage message={msg} />;
        }
      })}
      {chatloading && (
        <div className="flex gap-2  items-start justify-start w-full">
          <Avatar className="h-[2.3rem] w-[2.3rem]">
            <AvatarFallback>AI</AvatarFallback>
          </Avatar>
          <div className="">
            <TypingAnimation />
            <LoadingJourney route={currentJourneyRoute} />
          </div>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessages;
