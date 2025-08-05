// components/ChatMessages.tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm"; // This plugin is essential for tables
import TypingAnimation from "./TypingAnimation";
import { User } from "lucide-react";
import IrisLogo from "./IrisLogo";
import ClarificationTabs from "./ClarificationTabs";

// Import ALL chart components and their data types
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

// Define a comprehensive UiComponent type
export type UiComponent =
  | {
      type: "stock_price_chart";
      title: string;
      data: StockPriceDataPoint[];
    }
  | {
      type: "ranking_bar_chart";
      title: string;
      data: RankingBarDataPoint[];
      labelKey: string;
      valueKey: string;
    }
  | {
      type: "pie_chart";
      title: string;
      data: ShareholdingDataItem[];
    }
  | {
      // <!--- THIS IS THE NEW TYPE
      type: "clarification_options";
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
  onClarificationOptionClick: (query: string) => void; // <!--- ADD THIS
}

const messageVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
  exit: { y: -20, opacity: 0 },
};

const UserIcon = () => (
  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gray-600 text-gray-300">
    <User size={18} />
  </div>
);

const renderUiComponent = (
  component: UiComponent,
  index: number,
  onOptionClick: (query: string) => void
) => {
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
      return null; // Placeholder
    case "clarification_options":
      return (
        <ClarificationTabs
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
    <main className="w-full max-w-3xl px-4 md:px-6 py-6 space-y-6 flex-grow self-center">
      <AnimatePresence>
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            layout
            variants={messageVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={`flex w-full items-end gap-3 ${
              msg.role === "user" ? "flex-row-reverse" : "flex-row"
            }`}
          >
            {msg.role === "user" ? <UserIcon /> : <IrisLogo />}

            <div
              className={`max-w-[85%] md:max-w-[75%] rounded-2xl break-words
                        backdrop-blur-md border border-[var(--glass-border-color)] shadow-lg
                        ${
                          msg.role === "user"
                            ? "bg-[var(--chat-bubble-user)] text-white rounded-br-none"
                            : "bg-[var(--chat-bubble-ai)] text-gray-200 rounded-bl-none"
                        }`}
            >
              {msg.uiComponents && msg.uiComponents.length > 0 && (
                <div className="p-3">
                  {msg.uiComponents.map((comp, i) =>
                    // --- PASS THE HANDLER HERE ---
                    renderUiComponent(comp, i, onClarificationOptionClick)
                  )}
                </div>
              )}

              {(msg.content || msg.isThinkingPlaceholder) && (
                <div className="px-4 py-2">
                  {msg.isThinkingPlaceholder ? (
                    <TypingAnimation />
                  ) : (
                    <>
                      {/* --- THIS IS THE FIX --- */}
                      <div
                        className="prose prose-invert prose-sm md:prose-base max-w-none 
                                   prose-p:my-2 prose-headings:my-3
                                   prose-table:w-full prose-table:text-sm 
                                   prose-th:p-2 prose-th:font-semibold prose-th:text-left
                                   prose-td:p-2 prose-td:border-t prose-td:border-gray-700"
                      >
                        <div className="overflow-x-auto">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {msg.content}
                          </ReactMarkdown>
                        </div>
                      </div>
                      <p
                        className={`text-xs mt-2 opacity-70 ${
                          msg.role === "user" ? "text-right" : "text-left"
                        }`}
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
