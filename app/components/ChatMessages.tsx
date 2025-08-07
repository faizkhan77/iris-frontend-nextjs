"use client";

import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import TypingAnimation from "./TypingAnimation";
import { User, BotMessageSquare } from "lucide-react";
import ClarificationTabs from "./ClarificationTabs";
import { cn } from "@/lib/utils";

import VerticalSuggestionTabs from "../analysis_components/VerticalSuggestionTabs";

// Import ALL chart components and their data types (assuming these exist)
import {
  StockPriceChart,
  type ChartDataPoint as StockPriceDataPoint,
} from "./charts/StockPriceChart";
import {
  RankingBarChart,
  type ChartDataItem as RankingBarDataPoint,
} from "./charts/RankingBarChart";
import {
  ShareholdingPieChart,
  type ShareholdingDataItem,
} from "./charts/ShareholdingPieChart";

// The UI Component and Message types remain unchanged
export type UiComponent =
  | { type: "stock_price_chart"; title: string; data: StockPriceDataPoint[] }
  | {
      type: "ranking_bar_chart";
      title: string;
      data: RankingBarDataPoint[];
      labelKey: string;
      valueKey: string;
    }
  | { type: "pie_chart"; title: string; data: ShareholdingDataItem[] }
  | {
      type: "clarification_options";
      title: string;
      options: { label: string; query: string }[];
    }
  | {
      type: "vertical_suggestions";
      title: string;
      options: { label: string; query: string }[];
    };

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  isThinkingPlaceholder?: boolean;
  uiComponents?: UiComponent[];
}

interface ChatMessagesProps {
  messages: Message[];
  onClarificationOptionClick: (query: string) => void;
}

const messageVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.3, ease: "easeOut" } },
  exit: { opacity: 0 },
};

// --- NEW THEME-AWARE ICONS ---
const UserIcon = () => (
  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-element-bg text-text-secondary">
    <User size={18} />
  </div>
);

const IrisIcon = () => (
  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-element-bg text-text-secondary">
    <BotMessageSquare size={18} />
  </div>
);

const renderUiComponent = (
  component: UiComponent,
  index: number,
  onOptionClick: (query: string) => void
) => {
  // This function remains unchanged as it renders functional components
  switch (component.type) {
    case "stock_price_chart":
      return (
        <StockPriceChart
          key={index}
          data={component.data}
          title={component.title}
        />
      );
    case "ranking_bar_chart":
      return (
        <RankingBarChart
          key={index}
          data={component.data}
          title={component.title}
          labelKey={component.labelKey}
          valueKey={component.valueKey}
        />
      );
    case "pie_chart":
      return (
        <ShareholdingPieChart
          key={index}
          data={component.data}
          title={component.title}
        />
      );
    case "clarification_options":
      return (
        <ClarificationTabs
          key={index}
          title={component.title}
          options={component.options}
          onOptionClick={onOptionClick}
        />
      );
    case "vertical_suggestions":
      return (
        <VerticalSuggestionTabs
          key={index}
          title={component.title}
          options={component.options}
          onOptionClick={onOptionClick}
        />
      );
    default:
      const _exhaustiveCheck: never = component;
      return null;
  }
};

export default function ChatMessages({
  messages,
  onClarificationOptionClick,
}: ChatMessagesProps) {
  return (
    <main className="w-full max-w-4xl px-4 md:px-6 py-6 space-y-8 flex-grow self-center">
      <AnimatePresence initial={false}>
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            layout
            variants={messageVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={cn("flex w-full items-start gap-3", {
              "flex-row-reverse justify-start": msg.role === "user",
              "flex-row": msg.role === "assistant",
            })}
          >
            {msg.role === "user" ? <UserIcon /> : <IrisIcon />}

            <div
              className={cn("max-w-[85%] rounded-2xl p-4 break-words", {
                "bg-accent text-black rounded-br-none": msg.role === "user",
                "bg-element-bg text-text-primary rounded-bl-none":
                  msg.role === "assistant",
              })}
            >
              {msg.uiComponents && msg.uiComponents.length > 0 && (
                <div className="space-y-4">
                  {msg.uiComponents.map((comp, i) =>
                    renderUiComponent(comp, i, onClarificationOptionClick)
                  )}
                </div>
              )}

              {(msg.content || msg.isThinkingPlaceholder) && (
                <div
                  className={cn({
                    "mt-4": msg.uiComponents && msg.uiComponents.length > 0,
                  })}
                >
                  {msg.isThinkingPlaceholder ? (
                    <TypingAnimation />
                  ) : (
                    <>
                      <div className="prose prose-sm md:prose-base max-w-none prose-p:my-2 prose-headings:my-3">
                        <div className="overflow-x-auto">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {msg.content}
                          </ReactMarkdown>
                        </div>
                      </div>
                      <p
                        className={cn("text-xs mt-2 text-text-secondary", {
                          "text-right": msg.role === "user",
                          "text-left": msg.role === "assistant",
                        })}
                      >
                        {msg.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </main>
  );
}
