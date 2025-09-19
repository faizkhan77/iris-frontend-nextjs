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
import ReactMarkdown from "react-markdown";
import { useTheme } from "../../providers/ThemeProvider";
import { StockPriceChart } from "../../charts/StockPriceChart";

// Tooltip Component
const InfoTooltip = ({ text }: { text: string }) => (
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

type DetailItem = {
  label: string;
  value: string | number;
  tooltip?: string;
};

export type FundamentalAnalysisCardProps = {
  title: string;
  data: {
    chartInterpretation?: string;
    priceChartData?: any[];
    detailsTable?: DetailItem[];
    finalVerdict?: string;
    recommendation?: string;
  };
};

export function FundamentalAnalysisCard({
  title,
  data,
}: FundamentalAnalysisCardProps) {
  const { theme } = useTheme();
  const [isChartOpen, setIsChartOpen] = useState(true);
  const [isDetailsOpen, setIsDetailsOpen] = useState(true);

  // console.log(data);

  // Helper to format values
  const formatValue = (label: string, value: string | number) => {
    if (typeof value !== "number") return value;
    if (label.toLowerCase().includes("cap")) {
      if (value >= 1_00_00_000) return `${(value / 1_00_00_000).toFixed(2)} Cr`;
      if (value >= 1_00_000) return `${(value / 1_00_000).toFixed(2)} L`;
    }
    if (
      ["holding", "yield", "roce", "roe"].some((term) =>
        label.toLowerCase().includes(term)
      )
    ) {
      return `${value.toFixed(2)}%`;
    }
    return value.toLocaleString("en-IN", { maximumFractionDigits: 2 });
  };

  return (
    <div className="w-full p-5 rounded-lg bg-accent/20 border my-2 text-sm">
      {/* Title */}
      <h2 className="text-lg font-semibold text-text-primary mb-3">{title}</h2>

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
                <p className="text-xs text-text-secondary mb-5">
                  {data?.chartInterpretation}
                </p>
                {data?.priceChartData && data?.priceChartData.length > 0 && (
                  <StockPriceChart
                    data={data?.priceChartData}
                    title="Price vs Moving Averages"
                  />
                )}
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
          {isDetailsOpen &&
            data?.detailsTable &&
            data?.detailsTable.length > 0 && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-2 gap-x-6 gap-y-3 p-3">
                  {data?.detailsTable.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center text-xs"
                    >
                      <div className="flex items-center text-text-secondary">
                        {item.label}
                        {item.tooltip && <InfoTooltip text={item.tooltip} />}
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
        {data?.finalVerdict && (
          <>
            <h3 className="text-base font-semibold text-text-primary mb-1">
              Final Verdict
            </h3>
            <p className="text-text-secondary prose prose-sm max-w-none prose-p:my-1">
              {data?.finalVerdict}
            </p>
          </>
        )}

        {data?.recommendation && (
          <>
            <h3 className="text-base font-semibold text-text-primary mt-4 mb-1">
              Detailed Recommendation
            </h3>
            <div className="text-text-secondary prose prose-sm max-w-none prose-p:my-1">
              <ReactMarkdown>{data?.recommendation}</ReactMarkdown>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
