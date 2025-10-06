import React from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import {
  ArrowDownCircle,
  Copy,
  Share2,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";
import RenderGenUiComponent from "./gen_ui/RenderGenUiComponent";
import type { AiResponse, ChatMessage } from "@/redux/slices/chat/types";
import { Dialog, DialogTrigger } from "../ui/dialog";
import ShareChatMessage from "./ShareChatMessage";
import { useAppDispatch, useAppSelector, type RootState } from "@/redux/store";
import { clickShareMessage } from "@/redux/slices/chat/chat.slice";
import SuggestedQueries from "./gen_ui/suggested_queries";
import { useSendMessageHandler } from "@/hooks/useSendMessageHandler";
import { toast } from "sonner";

// Adjust this type to your actual AiResponse type

interface AssistantMessageProps {
  message: ChatMessage;
}

const AssistantMessage: React.FC<AssistantMessageProps> = ({ message }) => {
  const parsedMsg = JSON.parse(message.content) as AiResponse;
  const dispatch = useAppDispatch();
  const { submitMessage } = useSendMessageHandler();

  const handleCopy = () => {
    // A simple copy function for the text response
    navigator.clipboard.writeText(parsedMsg.text_response);
    toast.success("Copied to clipboard!");
  };

  const handleDownload = async () => {
    console.log("Download");
  };

  const onOptionClick = (query: string) => {
    submitMessage(query);
    console.log("Option clicked, sending query:", query);
  };

  return (
    <div key={message.id} className="flex gap-2 justify-start w-full">
      <Avatar className="h-[2.3rem] hidden sm:block w-[2.3rem] mt-1">
        <AvatarFallback>AI</AvatarFallback>
      </Avatar>

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
              {parsedMsg.ui_components.map((comp, index) => (
                <div>
                  <RenderGenUiComponent
                    key={index}
                    data={comp?.data}
                    title={comp?.title!}
                    type={comp?.type}
                  />
                  <div>
                    {comp.type === "suggested_queries" && (
                      <SuggestedQueries
                        title={comp.title}
                        data={comp.data}
                        onOptionClick={onOptionClick}
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
          <div>
            <div className="flex items-center mt-2">
              <Dialog>
                <DialogTrigger
                  onClick={() => dispatch(clickShareMessage(message))}
                  className="text-gray-400 p-2 hover:bg-muted rounded-md hover:text-gray-200 transition-colors duration-200"
                  aria-label="Share"
                >
                  <Share2 size={18} />
                </DialogTrigger>
                <ShareChatMessage />
              </Dialog>

              <button
                onClick={handleDownload}
                className="text-gray-400 p-2 hover:bg-muted rounded-md hover:text-gray-200 transition-colors duration-200"
                aria-label="Download"
              >
                <ArrowDownCircle size={18} />
              </button>

              <button
                className="text-gray-400 p-2 hover:bg-muted rounded-md hover:text-gray-200 transition-colors duration-200"
                aria-label="Like"
              >
                <ThumbsUp size={18} />
              </button>

              <button
                className="text-gray-400 p-2 hover:bg-muted rounded-md hover:text-gray-200 transition-colors duration-200"
                aria-label="Dislike"
              >
                <ThumbsDown size={18} />
              </button>

              <button
                onClick={handleCopy}
                className="text-gray-400 p-2 hover:bg-muted rounded-md hover:text-gray-200 transition-colors duration-200"
                aria-label="Copy"
              >
                <Copy size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssistantMessage;
