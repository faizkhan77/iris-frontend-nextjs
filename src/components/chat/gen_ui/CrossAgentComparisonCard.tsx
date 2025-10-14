// components/gen-ui/cards/CrossAgentComparisonCard.tsx

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart2,
  Zap,
  Newspaper,
  TrendingUp,
  TrendingDown,
  Eye,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";

import {
  FundamentalComparisonCard,
  type FundamentalComparisonCardProps,
} from "./FundamentalComparisonCard";
import {
  TechnicalComparisonCard,
  type TechnicalComparisonCardProps,
} from "./TechnicalComparisonCard";
import {
  SentimentComparisonCard,
  type SentimentComparisonCardProps,
} from "./SentimentComparisonCard";

interface CrossAgentComparisonData {
  company_names: [string, string];
  fundamental_data: FundamentalComparisonCardProps["data"] | null;
  technical_data: TechnicalComparisonCardProps["data"] | null;
  sentiment_data: SentimentComparisonCardProps["data"] | null;
  swot: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
  };
  recommendation: string;
  preferredCompany: string;
}

const InsightCard = ({ title, points, icon: Icon, iconClass, delay }: any) => (
  <motion.div
    className="rounded-2xl border border-border/50 p-4 h-full shadow-sm hover:shadow-md transition-shadow duration-200 bg-transparent backdrop-blur-sm"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, ease: "easeOut", delay }}
  >
    <div className="flex items-center gap-3 mb-3">
      <div
        className={cn(
          "flex h-8 w-8 items-center justify-center rounded-full",
          iconClass,
          "text-background dark:text-foreground"
        )}
      >
        <Icon size={18} />
      </div>
      <h4 className="text-base font-semibold text-foreground">{title}</h4>
    </div>
    <ul className="space-y-2 text-xs text-muted-foreground list-disc pl-4">
      {(points || []).map((point: string, i: number) => (
        <li key={i}>{point}</li>
      ))}
    </ul>
  </motion.div>
);

const AnalysisErrorCard = ({ type }: { type: string }) => (
  <div className="flex flex-col items-center justify-center min-h-[300px] rounded-lg border-2 border-dashed border-destructive/30 p-6 text-center">
    <AlertTriangle className="h-10 w-10 text-destructive/80" />
    <p className="mt-4 font-semibold text-destructive">Analysis Failed</p>
    <p className="mt-1 text-sm text-muted-foreground">
      The {type} analysis for one or both stocks could not be completed due to
      an internal error.
    </p>
  </div>
);

export function CrossAgentComparisonCard({
  title,
  data,
}: {
  title: string;
  data: CrossAgentComparisonData;
}) {
  const [activeTab, setActiveTab] = React.useState("fundamentals");

  if (!data || !data.company_names) {
    return (
      <div className="text-muted-foreground">
        Missing data for 360° comparison.
      </div>
    );
  }

  const {
    fundamental_data,
    technical_data,
    sentiment_data,
    swot,
    recommendation,
    preferredCompany,
  } = data;

  const tabContent = React.useMemo(() => {
    const c: Record<string, React.ReactNode> = {};

    c.fundamentals = fundamental_data ? (
      <FundamentalComparisonCard data={fundamental_data} title="" />
    ) : (
      <AnalysisErrorCard type="Fundamental" />
    );

    c.technicals = technical_data ? (
      <TechnicalComparisonCard data={technical_data} title="" />
    ) : (
      <AnalysisErrorCard type="Technical" />
    );

    c.sentiment = sentiment_data ? (
      <SentimentComparisonCard data={sentiment_data} title="" />
    ) : (
      <AnalysisErrorCard type="Sentiment" />
    );

    return c;
  }, [fundamental_data, technical_data, sentiment_data]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full space-y-10"
    >
      <h2 className="text-xl font-bold text-foreground text-center">{title}</h2>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 h-11 bg-transparent border border-border/50 rounded-xl">
          <TabsTrigger value="fundamentals">
            <BarChart2 className="mr-2 h-4 w-4" />
            Fundamentals
          </TabsTrigger>
          <TabsTrigger value="technicals">
            <Zap className="mr-2 h-4 w-4" />
            Technicals
          </TabsTrigger>
          <TabsTrigger value="sentiment">
            <Newspaper className="mr-2 h-4 w-4" />
            Sentiment
          </TabsTrigger>
        </TabsList>

        <div className="mt-4 rounded-xl border border-border/50 p-2 md:p-3 shadow-inner">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              {tabContent[activeTab]}
            </motion.div>
          </AnimatePresence>
        </div>
      </Tabs>

      {/* ====== IRIS Dashboard Section ====== */}
      <section className="pt-8 border-t border-border/30">
        <h3 className="text-lg font-semibold text-center mb-6">
          <span className="text-iris-500 dark:text-iris-400">
            IRIS Insight Dashboard
          </span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <InsightCard
            title="Strengths"
            points={swot.strengths}
            icon={TrendingUp}
            iconClass="bg-green-500 dark:bg-green-600"
            delay={0.2}
          />
          <InsightCard
            title="Weaknesses"
            points={swot.weaknesses}
            icon={TrendingDown}
            iconClass="bg-red-500 dark:bg-red-600"
            delay={0.4}
          />
          <InsightCard
            title="Watchlist"
            points={swot.opportunities}
            icon={Eye}
            iconClass="bg-blue-500 dark:bg-blue-600"
            delay={0.6}
          />
        </div>
      </section>

      {/* ====== Final IRIS Recommendation ====== */}
      <section className="pt-6 border-t border-dashed border-border/40">
        <motion.div
          className="text-center rounded-2xl border border-green-500/40 dark:border-green-400/30 p-5 shadow-md backdrop-blur-sm"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <h4 className="text-base font-semibold text-green-700 dark:text-green-300 mb-3 flex items-center justify-center gap-2">
            <CheckCircle size={18} />
            IRIS Final Recommendation:{" "}
            <span className="font-bold text-green-800 dark:text-green-200">
              {preferredCompany}
            </span>
          </h4>
          <div className="text-green-900/80 dark:text-green-200/80 prose prose-sm max-w-none">
            <ReactMarkdown>{recommendation}</ReactMarkdown>
          </div>
        </motion.div>
      </section>
    </motion.div>
  );
}
