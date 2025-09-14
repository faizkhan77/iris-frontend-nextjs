import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Info } from "lucide-react";
import { cn } from "@/lib/utils"; // Assuming you have a `cn` utility for classnames
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"; // Assuming you have a Tooltip component
import ReactMarkdown from "react-markdown";
import type { HistoricalPerformanceProps, IndicatorGaugeProps } from "./constant";

// --- Sub-Components (kept in the same file for simplicity) ---

interface InfoTooltipProps {
  text: string;
}
const InfoTooltip = ({ text }: InfoTooltipProps) => (
  <TooltipProvider delayDuration={150}>
    <Tooltip>
      <TooltipTrigger asChild>
        <button className="ml-1.5 text-gray-500 hover:text-gray-700 transition-colors">
          <Info size={12} />
        </button>
      </TooltipTrigger>
      <TooltipContent className="max-w-xs text-xs bg-gray-800 text-white p-2 rounded">
        <p>{text}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);


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
    <div className="rounded-lg border border-gray-200 bg-white p-3">
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs font-medium text-gray-600">
          {indicator.toUpperCase()}
        </span>
        <span className="text-xs font-bold text-gray-900 bg-gray-100 px-1.5 py-0.5 rounded">
          {value} ({currentZoneLabel})
        </span>
      </div>
      <div className="relative h-2 w-full rounded-full overflow-hidden bg-gray-200">
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
          className="absolute top-0 h-full w-1 bg-black rounded-full shadow-md transform -translate-x-1/2"
          initial={{ left: "0%" }}
          animate={{ left: `${clampedPercentage}%` }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        />
      </div>
      <p className="text-xs text-gray-500 mt-2">{interpretation}</p>
    </div>
  );
};


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
    <div className="border-y border-gray-200">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full justify-between items-center py-3 text-left text-blue-600 hover:text-blue-500 transition-colors"
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
                  className="text-center p-2 rounded-md bg-gray-50"
                >
                  <div className="text-xs text-gray-600 flex items-center justify-center">
                    {stat.label}
                    <InfoTooltip text={stat.tooltip} />
                  </div>
                  <p className="text-lg font-bold text-gray-900">
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


// --- Main Component ---

export function TechnicalSummaryCard({
  data,
  title,
}: {
  title: string;
  data: TechnicalSummaryData;
}) {
  const [isDetailsOpen, setIsDetailsOpen] = useState(true);

  const sentimentColorMap = {
    positive: "bg-green-500",
    negative: "bg-red-500",
    neutral: "bg-yellow-500",
  };

  const verdictColorMap: { [key: string]: string } = {
    Buy: "bg-green-500 text-green-900",
    "Strong Buy": "bg-green-400 text-green-900",
    Sell: "bg-red-500 text-red-900",
    "Strong Sell": "bg-red-400 text-red-900",
    Hold: "bg-yellow-500 text-yellow-900",
    Neutral: "bg-gray-500 text-gray-900",
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-card rounded-xl shadow-md text-sm text-card-foreground">
      <h2 className="text-lg font-semibold mb-4">{title}</h2>
      <p className="text-muted-foreground mb-6">{data.summaryText}</p>

      <HistoricalPerformance data={data.historicalPerformance} />

      {/* Details Table */}
      <div className="border-t border-border">
        <button
          onClick={() => setIsDetailsOpen(!isDetailsOpen)}
          className="flex w-full justify-between items-center py-3 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
        >
          <span>{isDetailsOpen ? "Collapse Details" : "Expand Details"}</span>
          <ChevronDown
            size={18}
            className={cn("transition-transform", {
              "rotate-180": isDetailsOpen,
            })}
          />
        </button>
        <AnimatePresence initial={false}>
          {isDetailsOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-2 gap-x-4 gap-y-3 p-3">
                {data.detailsTable.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center border-b border-border pb-2 last:border-b-0"
                  >
                    <div className="flex items-center text-muted-foreground text-xs space-x-1">
                      <div
                        className={cn(
                          "w-2 h-2 rounded-full",
                          sentimentColorMap[item.sentiment]
                        )}
                      />
                      <span>{item.indicator.toUpperCase()}</span>
                      <InfoTooltip text={item.tooltip} />
                    </div>
                    <span className="font-medium text-card-foreground text-xs">
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
        <div className="mt-6">
          <h3 className="text-sm font-semibold mb-3">Momentum Gauges</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.gaugeIndicators.map((gauge, index) => (
              <IndicatorGauge key={index} {...gauge} />
            ))}
          </div>
        </div>
      )}

      {/* Final Verdict */}
      <div className="mt-6">
        <h3 className="text-sm font-semibold mb-2">Final Verdict</h3>
        <div className="flex items-center gap-2 mb-3">
          <span
            className={cn(
              "px-2 py-0.5 rounded-md text-xs font-semibold",
              verdictColorMap[data.finalVerdict.verdict] ||
                verdictColorMap["Neutral"]
            )}
          >
            {data.finalVerdict.verdict}
          </span>
        </div>
        <p className="text-muted-foreground text-sm">{data.finalVerdict.reasoning}</p>

        <h3 className="text-sm font-semibold mt-5 mb-2">Detailed Recommendation</h3>
        <div className="text-muted-foreground prose prose-sm max-w-none">
          <ReactMarkdown>{data.recommendation}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
