import React, { useEffect, useMemo, useRef, useState } from "react";
import type { AiResponse } from "@/redux/slices/chat/types";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useAppSelector, type RootState } from "@/redux/store";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import RenderGenUiComponent from "./gen_ui/RenderGenUiComponent";
import LoadingJourney from "./LoadingJourney";
import ActionButtons from "./ActionButtons";

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
    return keywords.some(keyword => lowerCaseMessage.includes(keyword));
  };
  
    useEffect(() => {
      if (chatloading) {
        const lastUserMessage = [...messages]
          .reverse()
          .find((msg) => msg.role === "user");
  
        if (lastUserMessage && typeof lastUserMessage.content === "string") {
          const content = lastUserMessage.content;
          if (messageContains(content, ["shareholding", "promoter", "who owns", "ownership"])) {
            setCurrentJourneyRoute("shareholding");
          } else if (messageContains(content, ["compare", "vs", "versus", "analyze both"])) {
            setCurrentJourneyRoute("cross_agent_reasoning");
          } else if (messageContains(content, ["fundamentals", "balance sheet", "p/e ratio", "roe"])) {
            setCurrentJourneyRoute("fundamentals");
          } else if (messageContains(content, ["technicals", "chart", "rsi", "macd", "candlesticks"])) {
            setCurrentJourneyRoute("technicals");
          } else if (messageContains(content, ["sentiment", "news", "headlines", "market mood"])) {
            setCurrentJourneyRoute("sentiment");
          } else if (messageContains(content, ["what is", "explain", "define", "tell me about"])) {
            setCurrentJourneyRoute("knowledge_base");
          } else {
            setCurrentJourneyRoute("unknown");
          }
        }
      }
    }, [chatloading, messages]);
    console.log("sortedMessages:", sortedMessages);


  return (
    <div className="flex max-w-2xl w-full flex-col gap-3 mt-5">
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
          const parsedMsg = JSON.parse(msg?.content) as AiResponse;
          console.log("parsedMsg:", parsedMsg);
          return (
            <div key={msg.id} className="flex gap-2 justify-start w-full">
              <Avatar className="h-[2.3rem] w-[2.3rem] mt-1">
                <AvatarFallback>AI</AvatarFallback>
              </Avatar>

              <div className="w-full overflow-hidden"> 
                <div className="bg-accent/20 p-3 text-sm border max-w-full px-4 flex w-fit items-center gap-2 rounded-lg">
 <div className="prose prose-sm dark:prose-invert max-w-none">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm, remarkMath]}
                      rehypePlugins={[rehypeKatex]}
                    >
                      {parsedMsg.text_response}
                    </ReactMarkdown>
                  </div>
                </div>
                {parsedMsg.ui_components.length > 0 && (
                  <div className="mt-2 p-3 sm:p-5 rounded-md">
                    {parsedMsg.ui_components.map((comp, index) => {
                      return (
                        <RenderGenUiComponent
                          key={index}
                          data={comp?.data}
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
          <LoadingJourney route={currentJourneyRoute} />
        </div>
      )}
      <ActionButtons/>
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessages;