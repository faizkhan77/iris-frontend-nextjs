"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ShareholdingPieChart } from "../charts/ShareholdingPieChart"; // We can reuse this!

// --- Sub-Components ---

interface NewsListItemProps {
  headline: string;
  url: string;
  sentiment: "bullish" | "bearish" | "neutral";
}
const NewsListItem = ({ headline, url, sentiment }: NewsListItemProps) => {
  const sentimentConfig = {
    bullish: { color: "bg-green-500", label: "Positive" },
    bearish: { color: "bg-red-500", label: "Negative" },
    neutral: { color: "bg-yellow-500", label: "Neutral" },
  };

  return (
    <div className="flex items-center gap-3 py-2 border-b border-element-bg">
      <TooltipProvider delayDuration={100}>
        <Tooltip>
          <TooltipTrigger>
            <div
              className={cn(
                "w-2 h-2 rounded-full",
                sentimentConfig[sentiment].color
              )}
            />
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>{sentimentConfig[sentiment].label} Sentiment</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <p className="text-xs text-text-secondary flex-grow line-clamp-1">
        {headline}
      </p>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-text-tertiary hover:text-cyan-400 transition-colors"
        title="Read full article"
      >
        <ExternalLink size={14} />
      </a>
    </div>
  );
};

// --- Main Component Data Structure ---

export interface SentimentAnalysisData {
  summaryText: string;
  pieChartData: { name: string; value: number }[];
  newsList: NewsListItemProps[];
  finalVerdict: string;
  recommendation: string;
}

// --- Main Component ---

export function SentimentAnalysisCard({
  data,
}: {
  title: string;
  data: SentimentAnalysisData;
}) {
  const [isPieChartOpen, setIsPieChartOpen] = useState(true);
  const [isNewsListOpen, setIsNewsListOpen] = useState(true);

  const verdictColorMap: { [key: string]: string } = {
    Positive: "bg-green-500 text-green-950",
    Negative: "bg-red-500 text-red-950",
    Mixed: "bg-yellow-500 text-yellow-950",
    Neutral: "bg-gray-500 text-gray-950",
  };

  return (
    <div className="w-full text-sm">
      <p className="text-text-secondary mb-4">{data.summaryText}</p>

      {/* Pie Chart Collapsible */}
      <div className="border-t border-element-border">
        <button
          onClick={() => setIsPieChartOpen(!isPieChartOpen)}
          className="flex w-full justify-between items-center py-3 text-left font-medium text-text-primary"
        >
          Sentiment Breakdown
          <ChevronDown
            size={18}
            className={cn("transition-transform", {
              "rotate-180": isPieChartOpen,
            })}
          />
        </button>
        <AnimatePresence>
          {isPieChartOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="pb-4">
                <ShareholdingPieChart
                  data={data.pieChartData}
                  title="Sentiment Breakdown" // A more generic title for the chart itself
                  description="Based on analysis of recent news headlines"
                  animationDuration={500}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* News List Collapsible */}
      <div className="border-t border-element-border">
        <button
          onClick={() => setIsNewsListOpen(!isNewsListOpen)}
          className="flex w-full justify-between items-center py-3 text-left font-medium text-text-primary"
        >
          Recent Headlines
          <ChevronDown
            size={18}
            className={cn("transition-transform", {
              "rotate-180": isNewsListOpen,
            })}
          />
        </button>
        <AnimatePresence>
          {isNewsListOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="pb-2">
                {data.newsList.map((newsItem, index) => (
                  <NewsListItem key={index} {...newsItem} />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Final Verdict & Recommendation */}
      <div className="mt-6">
        <h3 className="text-base font-semibold text-text-primary mb-1">
          Final Verdict
        </h3>
        <div className="flex items-center gap-2 mb-2">
          <span
            className={cn(
              "px-2 py-0.5 rounded-md text-xs font-bold",
              verdictColorMap[data.finalVerdict] || verdictColorMap["Neutral"]
            )}
          >
            {data.finalVerdict}
          </span>
        </div>
        <h3 className="text-base font-semibold text-text-primary mt-4 mb-1">
          Detailed Recommendation
        </h3>
        <p className="text-text-secondary">{data.recommendation}</p>
      </div>
    </div>
  );
}
