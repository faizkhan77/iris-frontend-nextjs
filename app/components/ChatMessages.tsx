"use client";

import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import TypingAnimation from "./TypingAnimation";
import LoadingJourney from "./LoadingJourney";
import { User, BotMessageSquare } from "lucide-react";
import ClarificationTabs from "./ClarificationTabs";
import { cn } from "@/lib/utils";
import { Share2, Download } from "lucide-react";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

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

import {
  TechnicalSummaryCard,
  type TechnicalSummaryData,
} from "./genui/TechnicalSummaryCard";

import {
  SentimentAnalysisCard,
  type SentimentAnalysisData,
} from "./genui/SentimentAnalysisCard";
import {
  FundamentalAnalysisCard,
  type FundamentalAnalysisData,
} from "./genui/FundamentalAnalysisCard";

import {
  CrossAgentAnalysisCard,
  type CrossAgentAnalysisData,
} from "./genui/CrossAgentAnalysisCard";

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
    }
  | {
      type: "technical_summary_card";
      title: string;
      data: TechnicalSummaryData;
    }
  | {
      type: "sentiment_analysis_card";
      title: string;
      data: SentimentAnalysisData;
    }
  | {
      type: "fundamental_analysis_card";
      title: string;
      data: FundamentalAnalysisData;
    }
  | {
      type: "cross_agent_analysis_card";
      title: string;
      data: CrossAgentAnalysisData;
    };

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  isThinkingPlaceholder?: boolean;
  uiComponents?: UiComponent[];
  messageId?: number;
  route?: string;
}

interface ChatMessagesProps {
  messages: Message[];
  onClarificationOptionClick: (query: string) => void;
  onShareClick: (message: Message) => void;
  onDownloadClick: (message: Message) => void;
  isDownloading: boolean;
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
    case "technical_summary_card":
      return (
        <TechnicalSummaryCard
          key={index}
          title={component.title}
          data={component.data}
        />
      );
    case "sentiment_analysis_card":
      return (
        <SentimentAnalysisCard
          key={index}
          title={component.title}
          data={component.data}
        />
      );
    case "fundamental_analysis_card":
      return (
        <FundamentalAnalysisCard
          key={index}
          title={component.title}
          data={component.data}
        />
      );
    case "cross_agent_analysis_card":
      return (
        <CrossAgentAnalysisCard
          key={index}
          title={component.title}
          data={component.data}
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
  onShareClick,
  onDownloadClick,
  isDownloading,
}: ChatMessagesProps) {
  return (
    <main className="w-full max-w-4xl px-4 md:px-6 py-6 space-y-8 flex-grow self-center">
      <AnimatePresence initial={false}>
        {messages.map((msg) => {
          const isGenUiOnlyMessage =
            msg.uiComponents &&
            msg.uiComponents.length === 1 &&
            (msg.uiComponents[0].type === "technical_summary_card" ||
              msg.uiComponents[0].type === "fundamental_analysis_card" ||
              msg.uiComponents[0].type === "cross_agent_analysis_card");

          return (
            <motion.div
              key={msg.id}
              layout
              variants={messageVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className={cn("flex w-full items-start gap-3 group", {
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
                {/* --- RENDER UI COMPONENTS --- */}
                {msg.uiComponents && msg.uiComponents.length > 0 && (
                  <div className="space-y-4">
                    {msg.uiComponents.map((comp, i) =>
                      renderUiComponent(comp, i, onClarificationOptionClick)
                    )}
                  </div>
                )}

                {/* --- MODIFIED RENDER LOGIC FOR TEXT --- */}
                {/* Only render the text block if it's a thinking placeholder OR
                    if it's a standard message (not our special GenUI card) */}
                {(msg.isThinkingPlaceholder ||
                  (!isGenUiOnlyMessage && msg.content)) && (
                  <div
                    className={cn({
                      // Add margin-top only if there are other UI components (like clarification tabs)
                      "mt-4":
                        msg.uiComponents &&
                        msg.uiComponents.length > 0 &&
                        !isGenUiOnlyMessage,
                    })}
                  >
                    {msg.isThinkingPlaceholder ? (
                      msg.route ? (
                        <LoadingJourney route={msg.route || "unknown"} />
                      ) : (
                        <TypingAnimation />
                      )
                    ) : (
                      <>
                        <div className="prose prose-sm md:prose-base max-w-none prose-p:my-2 prose-headings:my-3">
                          <div className="overflow-x-auto">
                            <ReactMarkdown
                              remarkPlugins={[remarkGfm, remarkMath]}
                              rehypePlugins={[rehypeKatex]}
                            >
                              {msg.content}
                            </ReactMarkdown>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                )}

                {/* --- TIMESTAMP LOGIC --- */}
                {/* Always show the timestamp, unless it's a thinking placeholder */}
                {!msg.isThinkingPlaceholder && (
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
                )}
              </div>

              {/* --- NEW: ACTION ICONS FOR ASSISTANT MESSAGES --- */}
              {msg.role === "assistant" &&
                !msg.isThinkingPlaceholder &&
                msg.messageId && (
                  <div className="flex self-end items-center gap-1.5 ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button
                      onClick={() => onShareClick(msg)}
                      disabled={isDownloading}
                      title="Share"
                      // --- MODIFIED CLASSES ---
                      className="p-1.5 text-text-tertiary rounded-md transition-all duration-200 ease-in-out transform hover:scale-110 hover:text-cyan-400 disabled:scale-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Share2 size={14} />
                    </button>
                    <button
                      onClick={() => onDownloadClick(msg)}
                      title="Download as PDF"
                      disabled={isDownloading}
                      // --- MODIFIED CLASSES ---
                      className="p-1.5 text-text-tertiary rounded-md transition-all duration-200 ease-in-out transform hover:scale-110 hover:text-cyan-400 disabled:scale-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Download size={14} />
                    </button>
                  </div>
                )}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </main>
  );
}
