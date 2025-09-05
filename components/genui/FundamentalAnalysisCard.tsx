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
import { StockPriceChart, ChartDataPoint } from "../charts/StockPriceChart";
import ReactMarkdown from "react-markdown";

// --- Sub-Components ---
interface InfoTooltipProps {
  text: string;
}
const InfoTooltip = ({ text }: InfoTooltipProps) => (
  <TooltipProvider delayDuration={150}>
    <Tooltip>
      <TooltipTrigger asChild>
        <button className="ml-1.5 text-text-tertiary hover:text-text-secondary">
          <Info size={12} />
        </button>
      </TooltipTrigger>
      <TooltipContent className="max-w-xs text-xs">
        <p>{text}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

// --- Data Structures ---
interface FundamentalDetail {
  label: string;
  value: string | number;
  tooltip: string;
}

export interface FundamentalAnalysisData {
  chartInterpretation: string;
  priceChartData: ChartDataPoint[];
  detailsTable: FundamentalDetail[];
  finalVerdict: string;
  recommendation: string;
}

// --- Main Component ---
export function FundamentalAnalysisCard({
  title,
  data,
}: {
  title: string;
  data: FundamentalAnalysisData;
}) {
  const [isChartOpen, setIsChartOpen] = useState(true);
  const [isDetailsOpen, setIsDetailsOpen] = useState(true);

  // Helper to format large numbers for display
  const formatValue = (label: string, value: string | number) => {
    if (typeof value !== "number") return value;
    if (label.toLowerCase().includes("cap")) {
      if (value >= 1_00_00_000) return `${(value / 1_00_00_000).toFixed(2)} Cr`;
      if (value >= 1_00_000) return `${(value / 1_00_000).toFixed(2)} L`;
    }
    if (
      label.toLowerCase().includes("holding") ||
      label.toLowerCase().includes("yield") ||
      label.toLowerCase().includes("roce") ||
      label.toLowerCase().includes("roe")
    ) {
      return `${value.toFixed(2)}%`;
    }
    return value.toLocaleString("en-IN", { maximumFractionDigits: 2 });
  };

  return (
    <div className="w-full text-sm">
      {/* Price Chart Section */}
      <div className="border-b border-element-border">
        <button
          onClick={() => setIsChartOpen(!isChartOpen)}
          className="flex w-full justify-between items-center py-3 text-left font-medium text-text-primary"
        >
          Price Chart Analysis
          <ChevronDown
            size={18}
            className={cn("transition-transform", {
              "rotate-180": isChartOpen,
            })}
          />
        </button>
        <AnimatePresence>
          {isChartOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="pb-4">
                <p className="text-xs text-text-secondary px-2 mb-2">
                  {data.chartInterpretation}
                </p>
                <StockPriceChart data={data.priceChartData} title="" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Fundamental Details Section */}
      <div className="border-b border-element-border">
        <button
          onClick={() => setIsDetailsOpen(!isDetailsOpen)}
          className="flex w-full justify-between items-center py-3 text-left font-medium text-text-primary"
        >
          Fundamental Details
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
              <div className="grid grid-cols-2 gap-x-6 gap-y-3 p-3">
                {data.detailsTable.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center text-xs"
                  >
                    <div className="flex items-center text-text-secondary">
                      {item.label}
                      <InfoTooltip text={item.tooltip} />
                    </div>
                    <span className="font-semibold text-text-primary">
                      {formatValue(item.label, item.value)}
                    </span>
                  </div>
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
        <p className="text-text-secondary prose prose-sm max-w-none prose-p:my-1">
          {data.finalVerdict}
        </p>

        <h3 className="text-base font-semibold text-text-primary mt-4 mb-1">
          Detailed Recommendation
        </h3>
        <div className="text-text-secondary prose prose-sm max-w-none prose-p:my-1">
          <ReactMarkdown>{data.recommendation}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
