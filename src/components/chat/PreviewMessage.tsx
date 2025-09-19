import React from "react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import type { AiResponse, ChatMessage } from "@/redux/slices/chat/types";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import RenderGenUiComponent from "./gen_ui/RenderGenUiComponent";

interface PreviewMessageProps {
  message: ChatMessage;
}

const PreviewMessage: React.FC<PreviewMessageProps> = ({ message }) => {
  const parsedMsg = JSON.parse(message.content) as AiResponse;
  return (
    <div>
      <div key={message.id} className="flex gap-2 justify-start w-full">
        <div className="w-full overflow-hidden">
          <div className="bg-accent/20 p-3 text-sm border max-w-full px-4 flex w-fit items-center rounded-lg">
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkMath]}
                rehypePlugins={[rehypeKatex]}
              >
                {parsedMsg.text_response}
              </ReactMarkdown>
            </div>
          </div>

          <div className="mt-2">
            {parsedMsg.ui_components.length > 0 && (
              <div className="flex flex-col gap-3 rounded-md">
                {parsedMsg.ui_components.map((comp, index) =>
                  comp.type === "suggested_queries" ? null : (
                    <RenderGenUiComponent
                      key={index}
                      data={comp?.data}
                      title={comp?.title!}
                      type={comp?.type}
                    />
                  )
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewMessage;
