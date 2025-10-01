// components/gen-ui/cards/SentimentComparisonCard.tsx

import React, { useEffect, useMemo } from "react";
import {
  motion,
  AnimatePresence,
  useSpring,
  useTransform,
} from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Crown,
  TrendingUp,
  TrendingDown,
  Minus,
  ChevronDown,
  ShoppingCart,
  Sparkles, // New icon
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";

// --- Types (no changes) ---
type NewsListItemProps = {
  headline: string;
  caption: string;
  details: string;
  sentiment: "bullish" | "bearish" | "neutral";
};
type SentimentAnalysisData = {
  companyName: string;
  summaryText: string;
  pieChartData: { name: string; value: number }[];
  newsList: NewsListItemProps[];
  finalVerdict: "Positive" | "Negative" | "Neutral";
  recommendation: string;
};
export type SentimentComparisonCardProps = {
  title: string;
  data: {
    comparisonData: [SentimentAnalysisData, SentimentAnalysisData];
    finalSuggestion: string;
    preferredCompany: string;
  };
};

// --- Sub-Components (News Item - minor style tweaks) ---
const CollapsibleNewsItem = ({
  headline,
  caption,
  details,
  sentiment,
}: NewsListItemProps) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const sentimentConfig = {
    bullish: {
      color: "bg-green-500",
      label: "Positive",
      textColor: "text-green-500",
    },
    bearish: {
      color: "bg-red-500",
      label: "Negative",
      textColor: "text-red-500",
    },
    neutral: {
      color: "bg-amber-500",
      label: "Neutral",
      textColor: "text-amber-500",
    },
  };

  return (
    <div className="border-b border-border/60 last:border-b-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 py-2 w-full text-left transition-colors hover:bg-muted/50 rounded-md px-2 -mx-2"
      >
        <TooltipProvider delayDuration={150}>
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                className={cn(
                  "w-2 h-2 rounded-full flex-shrink-0",
                  sentimentConfig[sentiment]?.color
                )}
              />
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>{sentimentConfig[sentiment]?.label} Sentiment</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <p className="text-xs text-muted-foreground flex-grow">{headline}</p>
        <ChevronDown
          size={14}
          className={cn(
            "transition-transform flex-shrink-0 text-muted-foreground",
            {
              "rotate-180": isOpen,
            }
          )}
        />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="pb-3 pl-5 pr-2 text-xs text-muted-foreground/80 space-y-2">
              {caption && (
                <p className="font-semibold text-foreground/90">{caption}</p>
              )}
              {details && <p className="leading-relaxed">{details}</p>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- NEW: Redesigned and Animated Sentiment Gauge ---
const AnimatedSentimentGauge = ({
  verdict,
  score, // Score from 0 to 100
}: {
  verdict: string;
  score: number;
}) => {
  const scoreSpring = useSpring(0, { stiffness: 100, damping: 20, mass: 1 });
  const rotation = useTransform(scoreSpring, [0, 100], [-90, 90]);
  const color =
    verdict === "Positive"
      ? "#22c55e" // green-500
      : verdict === "Negative"
      ? "#ef4444" // red-500
      : "#f59e0b"; // amber-500

  useEffect(() => {
    scoreSpring.set(score);
  }, [score, scoreSpring]);

  const VerdictIcon =
    verdict === "Positive"
      ? TrendingUp
      : verdict === "Negative"
      ? TrendingDown
      : Minus;

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <div className="relative w-40 h-20">
        <svg
          width="160"
          height="80"
          viewBox="0 0 160 80"
          className="w-full h-full"
        >
          {/* Background Arc */}
          <path
            d="M 10 70 A 60 60 0 0 1 150 70"
            stroke="hsl(var(--muted))"
            strokeWidth="12"
            fill="none"
            strokeLinecap="round"
          />
          {/* Gradient Arc */}
          <defs>
            <linearGradient
              id="gaugeGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor="#ef4444" />
              <stop offset="50%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#22c55e" />
            </linearGradient>
          </defs>
          <path
            d="M 10 70 A 60 60 0 0 1 150 70"
            stroke="url(#gaugeGradient)"
            strokeWidth="12"
            fill="none"
            strokeLinecap="round"
          />
        </svg>

        {/* Needle */}
        <motion.div
          className="absolute bottom-2 left-1/2 w-0.5 h-[56px] bg-foreground origin-bottom"
          style={{ rotate: rotation }}
        >
          <div className="absolute -top-1 -left-[5px] w-3 h-3 rounded-full bg-foreground" />
        </motion.div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-6 h-6 bg-background border-4 border-foreground rounded-full" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex flex-col items-center"
      >
        <div
          className="flex items-center gap-1.5 font-bold text-lg"
          style={{ color }}
        >
          <VerdictIcon size={20} strokeWidth={2.5} />
          <span>{verdict}</span>
        </div>
        <p className="text-xs text-muted-foreground">
          Sentiment Score: {score.toFixed(0)}
        </p>
      </motion.div>
    </div>
  );
};

// --- NEW: Company Card Sub-Component for cleaner structure ---
const CompanyCard = ({
  company,
  isPreferred,
}: {
  company: SentimentAnalysisData;
  isPreferred: boolean;
}) => {
  const [newsOpen, setNewsOpen] = React.useState(false);
  const getScore = (d: SentimentAnalysisData) => {
    const bullish =
      d.pieChartData.find((p) => p.name.toLowerCase() === "bullish")?.value ??
      0;
    const bearish =
      d.pieChartData.find((p) => p.name.toLowerCase() === "bearish")?.value ??
      0;
    return 50 + bullish / 2 - bearish / 2;
  };

  return (
    <motion.div
      whileHover={!isPreferred ? { y: -5, scale: 1, opacity: 1 } : {}}
      className={cn(
        "w-full rounded-2xl p-4 transition-all duration-300 ease-in-out flex flex-col items-center text-center relative",
        isPreferred
          ? "opacity-100 md:scale-105 bg-background shadow-2xl shadow-green-500/20 dark:shadow-green-500/10 z-10 border-2 border-green-500"
          : "opacity-80 md:opacity-70 md:scale-95 bg-muted/30 dark:bg-slate-800/30 border-2 border-transparent hover:border-border"
      )}
    >
      {isPreferred && (
        <div className="absolute top-3 right-3 flex items-center gap-1 text-xs font-medium text-green-700 dark:text-green-300 bg-green-500/10 px-2.5 py-1 rounded-full">
          <Crown size={14} />
          <span>Preferred</span>
        </div>
      )}
      <h4 className="text-xl font-bold mb-4">{company.companyName}</h4>

      <div className="mb-4 w-full">
        <AnimatedSentimentGauge
          verdict={company.finalVerdict}
          score={getScore(company)}
        />
      </div>

      <p className="text-xs text-muted-foreground mb-4 h-12 flex items-center">
        {company.summaryText}
      </p>

      <div className="w-full mt-auto bg-background/50 dark:bg-slate-900/50 p-2 rounded-lg">
        <button
          onClick={() => setNewsOpen(!newsOpen)}
          className="flex w-full justify-between items-center py-2 text-left text-xs font-semibold text-foreground"
        >
          Recent Headlines ({company.newsList.length})
          <ChevronDown
            size={16}
            className={cn("transition-transform", { "rotate-180": newsOpen })}
          />
        </button>
        <AnimatePresence>
          {newsOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="border-t border-border/60 pt-2">
                {company.newsList.map((news, idx) => (
                  <CollapsibleNewsItem key={idx} {...news} />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

// -----------------------------
// Main Component (Redesigned)
// -----------------------------
export function SentimentComparisonCard({
  title,
  data,
}: SentimentComparisonCardProps) {
  const { comparisonData, finalSuggestion, preferredCompany } = data;

  if (!comparisonData || comparisonData.length < 2) {
    return (
      <div className="text-destructive p-3 rounded-md bg-red-50 dark:bg-red-900/30">
        Error: Comparison data is incomplete.
      </div>
    );
  }

  const formattedSuggestion = useMemo(() => {
    if (!finalSuggestion || !preferredCompany) return finalSuggestion;
    const regex = new RegExp(`\\b(${preferredCompany})\\b`, "gi");
    return finalSuggestion.replace(regex, `**$1**`);
  }, [finalSuggestion, preferredCompany]);

  const [companyA, companyB] = comparisonData;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full max-w-4xl rounded-2xl border bg-background p-4 md:p-6 shadow-sm dark:bg-black dark:border-slate-800"
    >
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold tracking-tight">{title}</h3>
        <p className="text-sm text-muted-foreground">
          Sentiment Head-to-Head Analysis
        </p>
      </div>

      <div className="flex flex-col md:flex-row items-stretch gap-4 md:gap-0">
        <CompanyCard
          company={companyA}
          isPreferred={preferredCompany === companyA.companyName}
        />

        <div className="flex md:flex-col items-center justify-center shrink-0 py-2 md:py-0 md:px-6">
          <div className="w-full md:w-px h-px md:h-full bg-border" />
          <span className="mx-4 md:my-4 px-3 py-1 text-xs font-bold tracking-widest text-muted-foreground bg-background rounded-full border">
            VS
          </span>
          <div className="w-full md:w-px h-px md:h-full bg-border" />
        </div>

        <CompanyCard
          company={companyB}
          isPreferred={preferredCompany === companyB.companyName}
        />
      </div>

      {finalSuggestion && (
        <div className="mt-8 text-center rounded-xl bg-muted/40 dark:bg-slate-900/50 p-4 border border-dashed">
          <div className="inline-flex items-center gap-2 mb-2">
            <Sparkles className="h-5 w-5 text-amber-500" />
            <h4 className="font-semibold text-foreground text-base">
              Analyst's Final Suggestion
            </h4>
          </div>
          <div className="prose prose-sm dark:prose-invert max-w-none mx-auto text-center">
            <ReactMarkdown
              components={{
                p: ({ node, ...props }) => (
                  <p className="text-muted-foreground" {...props} />
                ),
                strong: ({ node, ...props }) => (
                  <strong className="text-foreground" {...props} />
                ),
              }}
            >
              {formattedSuggestion}
            </ReactMarkdown>
          </div>
          <div className="mt-4 flex flex-col sm:flex-row gap-2 justify-center max-w-sm mx-auto">
            {comparisonData.map((company) => (
              <Button
                key={company.companyName}
                variant={
                  preferredCompany === company.companyName
                    ? "success"
                    : "outline"
                }
                size="sm"
                className="flex-1 transition-transform active:scale-95"
                onClick={() =>
                  alert(`Initiating action for ${company.companyName}`)
                }
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                Buy {company.companyName}
              </Button>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
