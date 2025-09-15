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
import { ShareholdingPieChart } from "../../charts/ShareholdingPieChart"; 

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

// --- Static Dummy Data ---
const dummyData: SentimentAnalysisData = {
  summaryText: "Market sentiment analysis shows mixed signals with 45% positive sentiment driven by strong quarterly earnings and new product launches, while 30% negative sentiment reflects concerns about inflation and supply chain disruptions. The remaining 25% neutral sentiment indicates cautious optimism among investors.",
  pieChartData: [
    { name: "Positive", value: 45 },
    { name: "Negative", value: 30 },
    { name: "Neutral", value: 25 }
  ],
  newsList: [
    {
      headline: "Company reports record Q3 earnings, beating analyst expectations by 15%",
      url: "https://example.com/news/q3-earnings",
      sentiment: "bullish"
    },
    {
      headline: "New AI product launch generates significant market buzz and pre-orders",
      url: "https://example.com/news/ai-launch",
      sentiment: "bullish"
    },
    {
      headline: "Supply chain concerns impact production timeline for upcoming quarter",
      url: "https://example.com/news/supply-chain",
      sentiment: "bearish"
    },
    {
      headline: "Federal Reserve hints at potential interest rate adjustments",
      url: "https://example.com/news/fed-rates",
      sentiment: "bearish"
    },
    {
      headline: "Industry analysts maintain neutral outlook pending market stabilization",
      url: "https://example.com/news/analyst-outlook",
      sentiment: "neutral"
    },
    {
      headline: "Partnership announcement with major tech company boosts investor confidence",
      url: "https://example.com/news/partnership",
      sentiment: "bullish"
    }
  ],
  finalVerdict: "Mixed",
  recommendation: "Given the mixed sentiment landscape, we recommend a cautious but opportunistic approach. The strong earnings performance and positive product developments suggest underlying business strength, but macroeconomic headwinds warrant careful position sizing. Consider taking profits on recent gains while maintaining core positions for long-term growth potential. Monitor upcoming earnings calls and Federal Reserve announcements for clearer directional signals."
};

// --- Main Component ---

export function SentimentAnalysisCard() {
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
      <p className="text-text-secondary mb-4">{dummyData.summaryText}</p>

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
                  data={dummyData.pieChartData}
                  title="Sentiment Breakdown" 
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
                {dummyData.newsList.map((newsItem, index) => (
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
              verdictColorMap[dummyData.finalVerdict] || verdictColorMap["Neutral"]
            )}
          >
            {dummyData.finalVerdict}
          </span>
        </div>
        <h3 className="text-base font-semibold text-text-primary mt-4 mb-1">
          Detailed Recommendation
        </h3>
        <p className="text-text-secondary">{dummyData.recommendation}</p>
      </div>
    </div>
  );
}