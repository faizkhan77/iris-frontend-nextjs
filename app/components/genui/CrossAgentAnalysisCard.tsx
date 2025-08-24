"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart2,
  Zap,
  Newspaper,
  TrendingUp,
  TrendingDown,
  Eye,
} from "lucide-react";
import ReactMarkdown from "react-markdown";

// Import the child components and their data types
import {
  FundamentalAnalysisCard,
  FundamentalAnalysisData,
} from "./FundamentalAnalysisCard";
import {
  TechnicalSummaryCard,
  TechnicalSummaryData,
} from "./TechnicalSummaryCard";
import {
  SentimentAnalysisCard,
  SentimentAnalysisData,
} from "./SentimentAnalysisCard";

// --- Data Structures ---
type TabData =
  | { label: "Fundamentals"; verdict: string; data: FundamentalAnalysisData }
  | { label: "Technicals"; verdict: string; data: TechnicalSummaryData }
  | { label: "Sentiment"; verdict: string; data: SentimentAnalysisData };

export interface CrossAgentAnalysisData {
  tabs: TabData[];
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  recommendation: string;
}

// --- NEW InsightCard Sub-Component ---
interface InsightCardProps {
  title: string;
  points: string[];
  icon: React.ElementType;
  iconClass: string;
  delay: number;
}

const InsightCard = ({
  title,
  points,
  icon: Icon,
  iconClass,
  delay,
}: InsightCardProps) => (
  <motion.div
    className="rounded-xl border border-element-border bg-element-bg p-4"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, ease: "easeOut", delay }}
  >
    <div className="flex items-center gap-3 mb-3">
      <div
        className={cn(
          "flex h-8 w-8 items-center justify-center rounded-full",
          iconClass
        )}
      >
        <Icon size={18} className="text-white" />
      </div>
      <h4 className="text-base font-semibold text-text-primary">{title}</h4>
    </div>
    <ul className="space-y-2 text-xs text-text-secondary list-disc pl-4">
      {(points || []).map((point, index) => (
        <li key={index}>{point}</li>
      ))}
    </ul>
  </motion.div>
);

const ICONS: { [key: string]: React.ElementType } = {
  Fundamentals: BarChart2,
  Technicals: Zap,
  Sentiment: Newspaper,
};

const VERDICT_STYLES: { [key: string]: string } = {
  Positive: "text-green-400 border-green-400",
  Buy: "text-green-400 border-green-400",
  "Strong Buy": "text-green-300 border-green-300",
  Negative: "text-red-400 border-red-400",
  Sell: "text-red-400 border-red-400",
  "Strong Sell": "text-red-300 border-red-300",
  Mixed: "text-yellow-400 border-yellow-400",
  Neutral: "text-gray-400 border-gray-400",
  Hold: "text-yellow-400 border-yellow-400",
  "N/A": "text-gray-500 border-gray-500",
};

// --- Main Component ---
export function CrossAgentAnalysisCard({
  data,
}: {
  title: string;
  data: CrossAgentAnalysisData;
}) {
  const [activeTab, setActiveTab] = useState(data.tabs[0].label);
  const activeTabData = data.tabs.find((tab) => tab.label === activeTab);

  const renderActiveTabContent = () => {
    if (!activeTabData) return null;

    switch (activeTabData.label) {
      case "Fundamentals":
        return <FundamentalAnalysisCard title="" data={activeTabData.data} />;
      case "Technicals":
        return <TechnicalSummaryCard title="" data={activeTabData.data} />;
      case "Sentiment":
        return <SentimentAnalysisCard title="" data={activeTabData.data} />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full">
      {/* Tab Headers */}
      <div className="flex space-x-2 border-b border-element-border mb-4">
        {data.tabs.map((tab) => {
          const Icon = ICONS[tab.label];
          const isActive = activeTab === tab.label;
          return (
            <button
              key={tab.label}
              onClick={() => setActiveTab(tab.label)}
              className={cn(
                "flex-1 p-3 text-sm font-medium transition-colors text-text-secondary hover:text-text-primary",
                { "text-cyan-400 border-b-2 border-cyan-400": isActive }
              )}
            >
              <div className="flex items-center justify-center gap-2">
                <Icon size={16} />
                <span>{tab.label}</span>
                <span
                  className={cn(
                    "text-xs font-bold px-1.5 py-0.5 border rounded-full",
                    VERDICT_STYLES[tab.verdict] || VERDICT_STYLES["N/A"]
                  )}
                >
                  {tab.verdict}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -10, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {renderActiveTabContent()}
        </motion.div>
      </AnimatePresence>

      {/* Final Verdict & Recommendation */}
      <div className="mt-8 pt-6 border-t border-dashed border-element-border">
        <h3 className="text-lg font-semibold text-text-primary text-center mb-4">
          IRIS Insight Dashboard
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <InsightCard
            title="Strengths"
            points={data.strengths}
            icon={TrendingUp}
            iconClass="bg-green-500/80"
            delay={0.2}
          />
          <InsightCard
            title="Weaknesses"
            points={data.weaknesses}
            icon={TrendingDown}
            iconClass="bg-red-500/80"
            delay={0.4}
          />
          <InsightCard
            title="Watchlist"
            points={data.opportunities}
            icon={Eye}
            iconClass="bg-blue-500/80"
            delay={0.6}
          />
        </div>

        <motion.div
          className="mt-6 text-center rounded-xl border border-element-border bg-sidebar-secondary-bg p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <h4 className="text-base font-semibold text-text-primary mb-2">
            IRIS Recommendation
          </h4>
          <div className="text-text-secondary prose prose-sm max-w-none prose-p:my-1 prose-strong:text-text-primary">
            <ReactMarkdown>{data.recommendation}</ReactMarkdown>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
