// components/gen-ui/cards/TechnicalComparisonCard.tsx

import React from "react";
import { motion } from "framer-motion";
import { StockPriceChartComparison } from "../../charts/StockPriceChartComparison";
import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";
import {
  Crown,
  Zap,
  BarChart,
  ShoppingCart,
  HelpCircle,
  Info,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

// --- Types ---
type HistoricalPerformance = {
  score: number;
  cagr: number;
  volatility: number;
  sharpe_ratio: number;
};

type IndicatorDetail = {
  indicator: string;
  value: string;
  signal: string;
};

type CompanyData = {
  companyName: string;
  historicalPerformance: HistoricalPerformance;
  priceChartData: any[];
  indicatorDetails: IndicatorDetail[];
  overallVerdict: string;
  compositeScore: number;
};

// NEW TYPE for the comparative gauge data
type ComparativeGauge = {
  indicator: string;
  valueA: number;
  valueB: number;
  signalA: string;
  signalB: string;
  config: {
    min: number;
    max: number;
    zones: { label: string; color: string; start: number; end: number }[];
  };
  interpretation: string;
};

export type TechnicalComparisonCardProps = {
  title: string;
  data: {
    comparisonData: [CompanyData, CompanyData];
    finalSuggestion: string;
    preferredCompany: string;
    comparativeGauges: ComparativeGauge[]; // NEW
  };
};

// --- Sub-Components ---
const StatCard = ({
  label,
  value,
  tooltip,
  isBetter,
}: {
  label: string;
  value: string | number;
  tooltip: string;
  isBetter?: boolean;
}) => (
  <TooltipProvider delayDuration={150}>
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          className={cn(
            "rounded-lg p-2 text-center",
            isBetter ? "bg-green-500/10" : "bg-muted/50"
          )}
        >
          <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
            {label} <HelpCircle size={12} />
          </div>
          <div
            className={cn(
              "text-sm font-bold mt-1",
              isBetter && "text-green-600 dark:text-green-400"
            )}
          >
            {value}
          </div>
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <p>{tooltip}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

const VerdictDisplay = ({
  verdict,
  score,
}: {
  verdict: string;
  score: number;
}) => {
  const scoreColor =
    score > 0.5
      ? "text-green-500"
      : score < -0.5
      ? "text-red-500"
      : "text-amber-500";

  // Clamp score to range [-1, 1] for safety
  const normalizedScore = Math.max(-1, Math.min(1, score));

  return (
    <div className="text-center p-2 rounded-lg bg-background border">
      <div className="text-xs text-muted-foreground">Overall Verdict</div>
      <div className={cn("text-lg font-bold break-words", scoreColor)}>
        {verdict.replace(/_/g, " ")}
      </div>

      {/* Responsive, centered progress bar */}
      <div className="w-full bg-muted rounded-full h-1.5 mt-2 overflow-hidden">
        <div className="flex w-full">
          {/* Negative side (left) */}
          <div
            className={cn(
              "h-1.5 bg-red-500 transition-all duration-300",
              normalizedScore < 0 ? "rounded-r-full" : "rounded-none"
            )}
            style={{
              width: `${Math.abs(Math.min(normalizedScore, 0)) * 50}%`,
            }}
          />
          {/* Center divider */}
          <div className="h-1.5 w-px bg-background" />
          {/* Positive side (right) */}
          <div
            className={cn(
              "h-1.5 bg-green-500 transition-all duration-300",
              normalizedScore > 0 ? "rounded-l-full" : "rounded-none"
            )}
            style={{
              width: `${Math.abs(Math.max(normalizedScore, 0)) * 50}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
};

const ComparativeGaugeBar = ({
  gauge,
  companyAName,
  companyBName,
}: {
  gauge: ComparativeGauge;
  companyAName: string;
  companyBName: string;
}) => {
  const {
    indicator,
    valueA,
    valueB,
    signalA,
    signalB,
    config,
    interpretation,
  } = gauge;
  const range = config.max - config.min;

  const getPosition = (value: number) => {
    // Clamp the value to ensure it's within the min/max range
    const clampedValue = Math.max(config.min, Math.min(value, config.max));
    return ((clampedValue - config.min) / range) * 100;
  };

  // --- FIX #2: Unique default value for each tab group ---
  const gaugeTabValue = `gauge-${indicator.replace(/\s+/g, "-")}`;
  const interpTabValue = `interp-${indicator.replace(/\s+/g, "-")}`;

  return (
    <div className="rounded-lg border bg-background p-3">
      {/* The ENTIRE content is now wrapped in a single Tabs component */}
      <Tabs defaultValue={gaugeTabValue} className="w-full">
        <div className="flex items-center justify-between gap-4 mb-3">
          <h5 className="font-semibold text-sm">{indicator}</h5>
          <TabsList className="h-7 text-xs">
            <TabsTrigger value={gaugeTabValue} className="h-6 text-xs px-2">
              Gauge
            </TabsTrigger>
            <TabsTrigger value={interpTabValue} className="h-6 text-xs px-2">
              Analysis
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value={gaugeTabValue}>
          <div className="relative w-full h-8 pt-2">
            {/* Background Zones */}
            <div className="absolute top-1/2 -translate-y-1/2 left-0 w-full h-2 rounded-full flex overflow-hidden">
              {config.zones.map((zone) => (
                <div
                  key={zone.label}
                  className={cn("h-full", zone.color)}
                  style={{
                    width: `${((zone.end - zone.start) / range) * 100}%`,
                  }}
                />
              ))}
            </div>

            {/* Stock A Marker (Blue) */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.div
                    className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-blue-500 border-2 border-background shadow-lg z-10 cursor-pointer"
                    style={{
                      left: `${getPosition(valueA)}%`,
                      transform: "translateX(-50%)",
                    }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    {companyAName}: {valueA.toFixed(2)} (
                    {signalA.replace(/_/g, " ")})
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {/* Stock B Marker (Green) */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.div
                    className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-green-500 border-2 border-background shadow-lg z-20 cursor-pointer"
                    style={{
                      left: `${getPosition(valueB)}%`,
                      transform: "translateX(-50%)",
                    }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.4, type: "spring" }}
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    {companyBName}: {valueB.toFixed(2)} (
                    {signalB.replace(/_/g, " ")})
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <div className="flex justify-between items-center mt-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500" />{" "}
              <span>{companyAName}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />{" "}
              <span>{companyBName}</span>
            </div>
          </div>
        </TabsContent>

        <TabsContent value={interpTabValue}>
          <div className="text-xs text-muted-foreground bg-muted/30 p-2 rounded-md leading-relaxed flex items-start gap-2 h-full min-h-[64px]">
            <Info
              size={16}
              className="inline-block text-blue-500 flex-shrink-0 mt-0.5"
            />
            <span>{interpretation}</span>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// --- Main Component ---
export const TechnicalComparisonCard: React.FC<
  TechnicalComparisonCardProps
> = ({ title, data }) => {
  if (!data || !data.comparisonData || data.comparisonData.length < 2) {
    return <div className="text-destructive p-3">Error: Incomplete data.</div>;
  }
  const {
    comparisonData,
    finalSuggestion,
    preferredCompany,
    comparativeGauges,
  } = data;
  const [companyA, companyB] = comparisonData;
  const [timeRange, setTimeRange] = React.useState<"1y" | "6m" | "3m">("1y");

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full rounded-2xl border p-4 shadow-sm space-y-4"
    >
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
        <div>
          <h3 className="font-semibold text-lg">{title}</h3>
          <p className="text-xs text-muted-foreground">
            Live technical posture analysis
          </p>
        </div>
        {preferredCompany && (
          <div className="flex items-center gap-2 text-sm font-medium text-green-700 dark:text-green-300 bg-green-500/10 px-3 py-1.5 rounded-full">
            <Crown size={16} />
            <span>{preferredCompany} is Preferred</span>
          </div>
        )}
      </div>

      {/* Combined Price Chart */}
      <div className="rounded-xl border bg-muted/20 overflow-hidden">
        <StockPriceChartComparison
          companyA={{
            name: companyA.companyName,
            data: companyA.priceChartData,
          }}
          companyB={{
            name: companyB.companyName,
            data: companyB.priceChartData,
          }}
          preferredCompany={preferredCompany}
          timeRange={timeRange}
          setTimeRange={setTimeRange}
        />
      </div>

      {/* Comparison Grids */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Company A Card */}
        <div className="rounded-xl border p-3 bg-background space-y-3 flex flex-col">
          <h4 className="font-semibold text-center">{companyA.companyName}</h4>
          <VerdictDisplay
            verdict={companyA.overallVerdict}
            score={companyA.compositeScore}
          />
          <div className="grid grid-cols-2 gap-2">
            <StatCard
              label="1Y Return"
              value={`${companyA.historicalPerformance.cagr.toFixed(2)}%`}
              tooltip="Compounded Annual Growth Rate over the last year."
              isBetter={
                companyA.historicalPerformance.cagr >
                companyB.historicalPerformance.cagr
              }
            />
            <StatCard
              label="Volatility"
              value={`${companyA.historicalPerformance.volatility.toFixed(2)}%`}
              tooltip="Annualized price volatility. Lower is generally better."
              isBetter={
                companyA.historicalPerformance.volatility <
                companyB.historicalPerformance.volatility
              }
            />
            <StatCard
              label="Sharpe Ratio"
              value={companyA.historicalPerformance.sharpe_ratio.toFixed(2)}
              tooltip="Risk-adjusted return. Higher is better."
              isBetter={
                companyA.historicalPerformance.sharpe_ratio >
                companyB.historicalPerformance.sharpe_ratio
              }
            />
            <StatCard
              label="Tech Score"
              value={companyA.historicalPerformance.score.toFixed(2)}
              tooltip="Proprietary historical technical performance score."
              isBetter={
                companyA.historicalPerformance.score >
                companyB.historicalPerformance.score
              }
            />
          </div>
          {/* --- FIX #3: Buy Button --- */}
          <Button
            variant="outline"
            className={
              preferredCompany?.toLowerCase().trim() ===
              companyA.companyName?.toLowerCase().trim()
                ? "mt-auto border-green-500 text-green-700 bg-green-50 dark:bg-green-900/20"
                : "mt-auto"
            }
          >
            <ShoppingCart size={16} className="mr-2" /> Buy{" "}
            {companyA.companyName}
          </Button>
        </div>

        {/* Company B Card */}
        <div className="rounded-xl border p-3 bg-background space-y-3 flex flex-col">
          <h4 className="font-semibold text-center">{companyB.companyName}</h4>
          <VerdictDisplay
            verdict={companyB.overallVerdict}
            score={companyB.compositeScore}
          />
          <div className="grid grid-cols-2 gap-2">
            <StatCard
              label="1Y Return"
              value={`${companyB.historicalPerformance.cagr.toFixed(2)}%`}
              tooltip="Compounded Annual Growth Rate over the last year."
              isBetter={
                companyB.historicalPerformance.cagr >
                companyA.historicalPerformance.cagr
              }
            />
            <StatCard
              label="Volatility"
              value={`${companyB.historicalPerformance.volatility.toFixed(2)}%`}
              tooltip="Annualized price volatility. Lower is generally better."
              isBetter={
                companyB.historicalPerformance.volatility <
                companyA.historicalPerformance.volatility
              }
            />
            <StatCard
              label="Sharpe Ratio"
              value={companyB.historicalPerformance.sharpe_ratio.toFixed(2)}
              tooltip="Risk-adjusted return. Higher is better."
              isBetter={
                companyB.historicalPerformance.sharpe_ratio >
                companyA.historicalPerformance.sharpe_ratio
              }
            />
            <StatCard
              label="Tech Score"
              value={companyB.historicalPerformance.score.toFixed(2)}
              tooltip="Proprietary historical technical performance score."
              isBetter={
                companyB.historicalPerformance.score >
                companyA.historicalPerformance.score
              }
            />
          </div>
          {/* --- FIX #3: Buy Button --- */}
          <Button
            variant="outline"
            className={
              preferredCompany?.toLowerCase().trim() ===
              companyB.companyName?.toLowerCase().trim()
                ? "mt-auto border-green-500 text-green-700 bg-green-50 dark:bg-green-900/20"
                : "mt-auto"
            }
          >
            <ShoppingCart size={16} className="mr-2" /> Buy{" "}
            {companyB.companyName}
          </Button>
        </div>
      </div>

      {/* Indicator Gauges Section */}
      {comparativeGauges && comparativeGauges.length > 0 && (
        <div className="space-y-3 pt-2">
          <h4 className="font-semibold text-foreground flex items-center gap-2">
            <BarChart size={16} className="text-blue-500" />
            Indicator Head-to-Head
          </h4>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {comparativeGauges.map((gauge) => (
              <ComparativeGaugeBar
                key={gauge.indicator}
                gauge={gauge}
                companyAName={companyA.companyName}
                companyBName={companyB.companyName}
              />
            ))}
          </div>
        </div>
      )}

      {/* Final Suggestion Section */}
      {finalSuggestion && (
        <div className="rounded-xl border-t pt-4">
          <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
            <Zap size={16} className="text-amber-500" />
            Analyst's Final Suggestion
          </h4>
          <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground">
            <ReactMarkdown>{finalSuggestion}</ReactMarkdown>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default TechnicalComparisonCard;
