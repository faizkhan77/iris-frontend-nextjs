"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// --- Sub-Components (kept in the same file for simplicity) ---

interface InfoTooltipProps {
  text: string;
}
const InfoTooltip = ({ text }: InfoTooltipProps) => (
  <TooltipProvider delayDuration={150}>
    <Tooltip>
      <TooltipTrigger asChild>
        <button className="ml-1.5 text-text-tertiary hover:text-text-secondary transition-colors">
          <Info size={12} />
        </button>
      </TooltipTrigger>
      <TooltipContent className="max-w-xs text-xs">
        <p>{text}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

interface IndicatorGaugeProps {
  indicator: string;
  value: number;
  min: number;
  max: number;
  zones: { label: string; color: string; start: number; end: number }[];
  interpretation: string;
  currentZoneLabel: string;
}
const IndicatorGauge = ({
  indicator,
  value,
  min,
  max,
  zones,
  interpretation,
  currentZoneLabel,
}: IndicatorGaugeProps) => {
  const range = max - min;
  const valuePercentage = ((value - min) / range) * 100;
  const clampedPercentage = Math.max(0, Math.min(100, valuePercentage));

  return (
    <div className="rounded-lg border border-element-border bg-element-bg p-3">
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs font-medium text-text-secondary">
          {indicator}
        </span>
        {/* --- NEW: Display current zone label --- */}
        <span className="text-xs font-bold text-text-primary bg-background px-1.5 py-0.5 rounded">
          {value} ({currentZoneLabel})
        </span>
      </div>
      <div className="relative h-2 w-full rounded-full overflow-hidden bg-background">
        {zones.map((zone, i) => {
          const zoneWidth = ((zone.end - zone.start) / range) * 100;
          return (
            <div
              key={i}
              className={cn("absolute h-full", zone.color)}
              style={{
                left: `${((zone.start - min) / range) * 100}%`,
                width: `${zoneWidth}%`,
              }}
            />
          );
        })}
        <motion.div
          className="absolute top-0 h-full w-1 bg-white rounded-full shadow-md transform -translate-x-1/2"
          initial={{ left: "0%" }}
          animate={{ left: `${clampedPercentage}%` }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        />
      </div>
      <p className="text-xs text-text-tertiary mt-2">{interpretation}</p>
    </div>
  );
};

// --- NEW: Historical Data Component ---
interface HistoricalPerformanceProps {
  data: {
    score?: number;
    cagr?: number;
    volatility?: number;
    sharpe_ratio?: number;
  } | null;
}
const HistoricalPerformance = ({ data }: HistoricalPerformanceProps) => {
  if (!data) return null;
  const [isOpen, setIsOpen] = useState(false);

  const stats = [
    {
      label: "Tech Score",
      value: data.score?.toFixed(2) ?? "N/A",
      tooltip:
        "Overall technical score combining historical trends and current indicators.",
    },
    {
      label: "Price CAGR (1Y)",
      value: `${data.cagr?.toFixed(2) ?? "N/A"}%`,
      tooltip:
        "Compound Annual Growth Rate of the stock price over the last year.",
    },
    {
      label: "Volatility (1Y)",
      value: `${data.volatility?.toFixed(2) ?? "N/A"}%`,
      tooltip:
        "Annualized standard deviation of daily returns, a measure of risk.",
    },
    {
      label: "Sharpe Ratio",
      value: data.sharpe_ratio?.toFixed(2) ?? "N/A",
      tooltip: "Measures risk-adjusted return. Higher is better.",
    },
  ];

  return (
    <div className="border-y border-element-border">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full justify-between items-center py-3 text-left text-cyan-400 hover:text-cyan-300 transition-colors"
      >
        <span className="font-medium">Historical Performance (1Y)</span>
        <ChevronDown
          size={18}
          className={cn("transition-transform", { "rotate-180": isOpen })}
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
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-2 py-3">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="text-center p-2 rounded-md bg-element-bg"
                >
                  <div className="text-xs text-text-secondary flex items-center justify-center">
                    {stat.label}
                    <InfoTooltip text={stat.tooltip} />
                  </div>
                  <p className="text-lg font-bold text-text-primary">
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- Main Component Data Structure (Type Definition) ---

export interface TechnicalSummaryData {
  summaryText: string;
  historicalPerformance: HistoricalPerformanceProps["data"];
  detailsTable: {
    indicator: string;
    value: string | number;
    tooltip: string;
    sentiment: "positive" | "negative" | "neutral";
  }[];
  gaugeIndicators: IndicatorGaugeProps[];
  finalVerdict: {
    verdict: string;
    reasoning: string;
  };
  recommendation: string;
}

interface TechnicalSummaryCardProps {
  title: string;
  data: TechnicalSummaryData;
}

// --- Main Component ---

export function TechnicalSummaryCard({
  data,
}: {
  title: string;
  data: TechnicalSummaryData;
}) {
  const [isDetailsOpen, setIsDetailsOpen] = useState(true); // Default to open

  const sentimentColorMap = {
    positive: "bg-green-500",
    negative: "bg-red-500",
    neutral: "bg-yellow-500",
  };

  const verdictColorMap: { [key: string]: string } = {
    Buy: "bg-green-500 text-green-950",
    "Strong Buy": "bg-green-400 text-green-950",
    Sell: "bg-red-500 text-red-950",
    "Strong Sell": "bg-red-400 text-red-950",
    Hold: "bg-yellow-500 text-yellow-950",
    Neutral: "bg-gray-500 text-gray-950",
  };

  return (
    <div className="w-full text-sm">
      <p className="text-text-secondary mb-4">{data.summaryText}</p>

      <HistoricalPerformance data={data.historicalPerformance} />

      {/* Details Table */}
      <div className="border-y border-element-border">
        <button
          onClick={() => setIsDetailsOpen(!isDetailsOpen)}
          className="flex w-full justify-between items-center py-3 text-left text-cyan-400 hover:text-cyan-300 transition-colors"
        >
          <span className="font-medium">
            {isDetailsOpen ? "Collapse Details" : "Expand Details"}
          </span>
          <ChevronDown
            size={18}
            className={cn("transition-transform", {
              "rotate-180": isDetailsOpen,
            })}
          />
        </button>
        <AnimatePresence>
          {isDetailsOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 py-3">
                {data.detailsTable.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center text-xs border-b border-element-bg pb-2"
                  >
                    <div className="flex items-center text-text-secondary">
                      <div
                        className={cn(
                          "w-1.5 h-1.5 rounded-full mr-2",
                          sentimentColorMap[item.sentiment]
                        )}
                      />
                      {item.indicator}
                      <InfoTooltip text={item.tooltip} />
                    </div>
                    <span className="font-semibold text-text-primary">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Gauge Indicators */}
      {data.gaugeIndicators.length > 0 && (
        <div className="mt-4">
          <h3 className="text-base font-semibold text-text-primary mb-2">
            Momentum Gauges
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {data.gaugeIndicators.map((gauge, index) => (
              <IndicatorGauge key={index} {...gauge} />
            ))}
          </div>
        </div>
      )}

      {/* Final Verdict & Recommendation */}
      <div className="mt-6">
        <h3 className="text-base font-semibold text-text-primary mb-1">
          Final Verdict
        </h3>
        <div className="flex items-center gap-2 mb-2">
          <span
            className={cn(
              "px-2 py-0.5 rounded-md text-xs font-bold",
              verdictColorMap[data.finalVerdict.verdict] ||
                verdictColorMap["Neutral"]
            )}
          >
            {data.finalVerdict.verdict}
          </span>
        </div>
        <p className="text-text-secondary">{data.finalVerdict.reasoning}</p>

        <h3 className="text-base font-semibold text-text-primary mt-4 mb-1">
          Detailed Recommendation
        </h3>
        <p className="text-text-secondary">{data.recommendation}</p>
      </div>
    </div>
  );
}
