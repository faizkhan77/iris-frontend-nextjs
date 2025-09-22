import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ShareholdingPieChart } from "../../charts/ShareholdingPieChart";
import ReactMarkdown from "react-markdown";

// --- Sub-Components (NEW Collapsible News Item) ---

interface NewsListItemProps {
  headline: string;
  caption: string;
  details: string;
  sentiment: "bullish" | "bearish" | "neutral";
}

const NewsListItem = ({
  headline,
  caption,
  details,
  sentiment,
}: NewsListItemProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const sentimentConfig = {
    bullish: { color: "bg-green-500", label: "Positive" },
    bearish: { color: "bg-red-500", label: "Negative" },
    neutral: { color: "bg-yellow-500", label: "Neutral" },
  };

  return (
    <div className="border-b border-element-bg last:border-b-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 py-2 w-full text-left"
      >
        <TooltipProvider delayDuration={100}>
          <Tooltip>
            <TooltipTrigger>
              <div
                className={cn(
                  "w-2 h-2 rounded-full flex-shrink-0",
                  sentimentConfig[sentiment]?.color || "bg-gray-400"
                )}
              />
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>{sentimentConfig[sentiment]?.label || "Unknown"} Sentiment</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <p className="text-xs text-text-secondary flex-grow">{headline}</p>
        <ChevronDown
          size={14}
          className={cn("transition-transform flex-shrink-0", {
            "rotate-180": isOpen,
          })}
        />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0, marginTop: 0 }}
            animate={{ height: "auto", opacity: 1, marginTop: "0.5rem" }}
            exit={{ height: 0, opacity: 0, marginTop: 0 }}
            className="overflow-hidden"
          >
            <div className="pb-3 pl-5 pr-2 text-xs text-text-tertiary space-y-2">
              {caption && <p className="font-semibold">{caption}</p>}
              {details && <p className="leading-relaxed">{details}</p>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
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

interface SentimentAnalysisCardProps {
  title: string;
  data: SentimentAnalysisData;
}

// --- Main Component ---

export function SentimentAnalysisCard({
  title,
  data,
}: SentimentAnalysisCardProps) {
  // Your existing main component logic is fine and doesn't need changes.
  // The magic happens in the new NewsListItem sub-component.
  const [isPieChartOpen, setIsPieChartOpen] = useState(true);
  const [isNewsListOpen, setIsNewsListOpen] = useState(true);

  const verdictColorMap: { [key: string]: string } = {
    Positive: "bg-green-500 text-green-950",
    Negative: "bg-red-500 text-red-950",
    Mixed: "bg-yellow-500 text-yellow-950",
    Neutral: "bg-gray-500 text-gray-950",
  };

  return (
    <div className="w-full my-2  rounded-lg text-sm">
      <h2 className="text-lg font-semibold text-text-primary mb-3">{title}</h2>
      <p className="text-text-secondary mb-4">{data?.summaryText}</p>

      {/* Pie Chart Collapsible (Only render if data exists) */}
      {data?.pieChartData && data.pieChartData.length > 0 && (
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
                    title="Sentiment Breakdown"
                    description="Based on analysis of recent news headlines"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* News List Collapsible */}
      <div className="border-y border-element-border">
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
          {isNewsListOpen && data?.newsList && (
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
        {data?.finalVerdict && (
          <>
            <h3 className="text-base font-semibold text-text-primary mb-1">
              Final Verdict
            </h3>
            <div className="flex items-center gap-2 mb-2">
              <span
                className={cn(
                  "px-2 py-0.5 rounded-md text-xs font-bold",
                  verdictColorMap[data.finalVerdict] ||
                    verdictColorMap["Neutral"]
                )}
              >
                {data.finalVerdict}
              </span>
            </div>
          </>
        )}

        {data?.recommendation && (
          <>
            <h3 className="text-base font-semibold text-text-primary mt-4 mb-1">
              Detailed Recommendation
            </h3>
            <div className="text-text-secondary prose prose-sm max-w-none prose-p:my-1">
              <ReactMarkdown>{data.recommendation}</ReactMarkdown>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
