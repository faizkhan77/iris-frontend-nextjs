// components/ChatMessages.tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import TypingAnimation from "./TypingAnimation";
// --- NEW: Import the chart component ---
import { StockPriceChart } from "./charts/StockPriceChart";
import { RankingBarChart } from "./charts/RankingBarChart";
import { User } from "lucide-react";
import IrisLogo from "./IrisLogo";

// Define a type for our specific UI components
export interface UiComponent {
  type: "stock_price_chart" | "ranking_bar_chart"; // Add the new type
  title: string;
  data: any[];
  // Add optional keys for the bar chart
  labelKey?: string;
  valueKey?: string;
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  isThinkingPlaceholder?: boolean;
  // --- NEW: Add uiComponents to the message type ---
  uiComponents?: UiComponent[];
}

interface ChatMessagesProps {
  messages: Message[];
}

const messageVariants = {
  // ... (keep this the same)
};

const UserIcon = () => (
  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gray-600 text-gray-300">
    <User size={18} />
  </div>
);

const renderUiComponent = (component: UiComponent, index: number) => {
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
      // Ensure the required keys are present before rendering
      if (!component.labelKey || !component.valueKey) return null;
      return (
        <RankingBarChart
          key={index}
          data={component.data}
          title={component.title}
          labelKey={component.labelKey}
          valueKey={component.valueKey}
        />
      );
    default:
      return null;
  }
};

export default function ChatMessages({ messages }: ChatMessagesProps) {
  return (
    <main className="w-full max-w-3xl px-4 md:px-6 py-6 space-y-6 flex-grow self-center">
      <AnimatePresence>
        {messages.map((msg) => (
          // --- MODIFIED: Changed layout to a row with icons ---
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
            {/* Render Icon */}
            {msg.role === "user" ? <UserIcon /> : <IrisLogo />}

            {/* Message Bubble */}
            <div
              className={`max-w-[85%] md:max-w-[75%] px-1 py-1 rounded-2xl shadow-md break-words ${
                msg.role === "user"
                  ? "bg-[var(--chat-bubble-user)] text-white rounded-br-none"
                  : "bg-[var(--chat-bubble-ai)] text-gray-200 rounded-bl-none"
              }`}
            >
              {/* Render UI components first */}
              {msg.uiComponents && msg.uiComponents.length > 0 && (
                <div className="p-2">
                  {" "}
                  {/* Padding around the chart */}
                  {msg.uiComponents.map(renderUiComponent)}
                </div>
              )}

              {/* Conditionally render content area ONLY if there is content or it's a placeholder */}
              {(msg.content || msg.isThinkingPlaceholder) && (
                <div className="px-4 py-2">
                  {" "}
                  {/* Consistent padding for text */}
                  {msg.isThinkingPlaceholder ? (
                    <TypingAnimation />
                  ) : (
                    <>
                      {/* This 'prose' div is essential for Markdown styling */}
                      <div className="prose prose-invert prose-sm md:prose-base max-w-none prose-p:my-2 prose-headings:my-3">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {msg.content}
                        </ReactMarkdown>
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
