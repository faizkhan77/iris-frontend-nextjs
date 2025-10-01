import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { StockPriceChartComparison } from "../../charts/StockPriceChartComparison";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  ArrowUp,
  Info,
  ChevronRight,
  Zap,
  Activity,
  Crown,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// -----------------------------
// Types
// -----------------------------

type DetailItem = {
  label: string;
  value: string | number;
};

type CompanyData = {
  companyName: string;
  ticker?: string;
  logoUrl?: string;
  priceChartData?: any[];
  chartInterpretation1Y?: string;
  chartInterpretation6M?: string;
  chartInterpretation3M?: string;
  detailsTable?: DetailItem[];
  metrics?: { label: string; value: number; tooltip?: string }[]; // normalized 0-100 for bars
  finalVerdict?: string;
  recommendation?: string;
};

type ComparisonTableRow = {
  label: string;
  value1: string | number;
  value2: string | number;
  tooltip: string;
};

export type FundamentalComparisonCardProps = {
  title: string;
  compact?: boolean; // chatbubble-friendly compact variant
  data: {
    comparisonData: [CompanyData, CompanyData];
    comparisonTable?: {
      headers: string[];
      rows: ComparisonTableRow[];
    };
    finalSuggestion?: string;
    preferredCompany?: string;
  };
};

// -----------------------------
// Helpers
// -----------------------------

const formatValue = (value: string | number) => {
  if (typeof value !== "number") return value;
  if (value >= 100_00_00_00) return `${(value / 100_00_00_00).toFixed(2)} Cr`;
  if (value >= 100_000) return `${(value / 100_000).toFixed(2)} L`;
  return value.toLocaleString("en-IN", { maximumFractionDigits: 2 });
};

const clamp = (n: number, a = 0, b = 100) => Math.max(a, Math.min(b, n));

const getMetricColor = (value: number) => {
  if (value >= 75) return "bg-green-500";
  if (value >= 40) return "bg-amber-500";
  return "bg-red-500";
};

// -----------------------------
// Component
// -----------------------------

export default function FundamentalComparisonCard({
  title,
  compact = false,
  data: { comparisonData, comparisonTable, finalSuggestion, preferredCompany },
}: FundamentalComparisonCardProps) {
  if (!comparisonData || comparisonData.length < 2) {
    return (
      <div className="text-destructive p-3 rounded-md bg-red-50 dark:bg-red-900/30">
        Error: Comparison data is incomplete.
      </div>
    );
  }

  const [companyA, companyB] = comparisonData;
  const [timeRange, setTimeRange] = useState<"1y" | "6m" | "3m">("1y");
  const [focus, setFocus] = useState<"both" | "a" | "b">("both");

  const interpretation = (c: CompanyData) => {
    switch (timeRange) {
      case "1y":
        return c.chartInterpretation1Y;
      case "6m":
        return c.chartInterpretation6M;
      case "3m":
        return c.chartInterpretation3M;
      default:
        return c.chartInterpretation1Y;
    }
  };

  const combinedScore = useMemo(() => {
    // quick heuristic: average of metric values if present
    const score = (c: CompanyData) => {
      if (!c.metrics || c.metrics.length === 0) return 50;
      const sum = c.metrics.reduce((s, m) => s + clamp(Number(m.value)), 0);
      return Math.round(sum / c.metrics.length);
    };
    return { a: score(companyA), b: score(companyB) };
  }, [companyA, companyB]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28 }}
      className={cn(
        "w-full rounded-2xl border p-4 shadow-sm overflow-hidden",
        "bg-gradient-to-br from-white/60 via-slate-50 to-white/40 border-slate-200",
        "dark:from-slate-900/60 dark:via-slate-900/50 dark:to-slate-950/60 dark:border-slate-800",
        compact ? "text-sm" : "text-base"
      )}
      role="group"
    >
      {/* ==================================================================== */}
      {/* SECTION 1: HEADER (This part has no changes)                       */}
      {/* ==================================================================== */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col">
          <h3 className="font-semibold leading-none">{title}</h3>
          <p className="text-xs text-muted-foreground mt-1">
            Head-to-head visual comparison · interactive
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-4">
          <div className="hidden sm:flex items-center gap-1 text-xs text-muted-foreground">
            <Activity size={14} />
            <span>{combinedScore.a} / 100</span>
            <ChevronRight size={14} className="opacity-40" />
            <span>{combinedScore.b} / 100</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="rounded-full bg-muted/30 px-2 py-1 text-xs">
              Live
            </div>
            <div className="text-xs text-muted-foreground">
              {new Date().toLocaleString("en-IN", {
                timeZone: "Asia/Kolkata",
                weekday: "short",
                day: "numeric",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* SECTION 2: NEW COMBINED CHART & INTERPRETATION SECTION             */}
      {/* This entire block is new and placed here, at the top level.        */}
      {/* ==================================================================== */}
      <div className="mt-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-muted/20 overflow-hidden">
        <StockPriceChartComparison
          companyA={{
            name: companyA.companyName,
            data: companyA.priceChartData || [],
          }}
          companyB={{
            name: companyB.companyName,
            data: companyB.priceChartData || [],
          }}
          preferredCompany={preferredCompany}
          timeRange={timeRange}
          setTimeRange={setTimeRange}
        />
        <div className="p-4 border-t border-slate-200 dark:border-slate-700">
          <Tabs defaultValue={companyA.companyName} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value={companyA.companyName}>
                {companyA.companyName}
              </TabsTrigger>
              <TabsTrigger value={companyB.companyName}>
                {companyB.companyName}
              </TabsTrigger>
            </TabsList>
            <TabsContent value={companyA.companyName}>
              <p className="mt-3 text-xs text-muted-foreground leading-relaxed">
                {interpretation(companyA) ||
                  "No interpretation available for this time range."}
              </p>
            </TabsContent>
            <TabsContent value={companyB.companyName}>
              <p className="mt-3 text-xs text-muted-foreground leading-relaxed">
                {interpretation(companyB) ||
                  "No interpretation available for this time range."}
              </p>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* SECTION 3: COMPANY DETAIL CARDS (NOW WITHOUT CHARTS)               */}
      {/* The grid and cards are still here, but their contents are simpler. */}
      {/* ==================================================================== */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Company A Card */}
        <motion.div
          whileHover={{ y: -4 }}
          className={cn(
            "rounded-xl p-3 border-2 transition-all duration-300 ease-in-out",
            "bg-white/60 dark:bg-slate-800/60",
            focus === "b" ? "opacity-60 scale-95" : "opacity-100 scale-100",
            preferredCompany === companyA.companyName
              ? "border-green-500/50 shadow-lg shadow-green-500/10 dark:shadow-green-500/5"
              : "border-slate-200 dark:border-slate-700"
          )}
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg overflow-hidden bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center text-white font-bold">
                {companyA.logoUrl ? (
                  <img
                    src={companyA.logoUrl}
                    alt={companyA.companyName}
                    className="h-10 w-10 object-cover"
                  />
                ) : (
                  companyA.companyName?.slice(0, 2).toUpperCase()
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <div className="text-sm font-semibold">
                    {companyA.companyName}
                  </div>
                  {preferredCompany === companyA.companyName && (
                    <div className="flex items-center gap-1 text-xs font-medium text-green-700 dark:text-green-300 bg-green-500/10 px-1.5 py-0.5 rounded-full">
                      <Crown size={12} />
                      <span>Preferred</span>
                    </div>
                  )}
                </div>
                <div className="text-xs text-muted-foreground">
                  {companyA.ticker ?? "—"}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-xs text-muted-foreground">Score</div>
              <div className="w-20 bg-muted/40 rounded-full h-2 overflow-hidden">
                <div
                  className={cn(
                    "h-2 rounded-full transition-colors",
                    combinedScore.a > combinedScore.b
                      ? "bg-green-400"
                      : "bg-amber-400"
                  )}
                  style={{ width: `${clamp(combinedScore.a)}%` }}
                />
              </div>
            </div>
          </div>

          {/* THE INDIVIDUAL CHART AND INTERPRETATION FOR COMPANY A USED TO BE HERE. IT IS NOW REMOVED. */}

          <div className="mt-3 grid grid-cols-2 gap-2">
            {(companyA.metrics || []).slice(0, 4).map((m, idx) => (
              <TooltipProvider key={m.label + idx}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="rounded-md p-2 border bg-muted/20 flex flex-col gap-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <div className="font-medium">{m.label}</div>
                        <div className="text-xs text-muted-foreground">
                          {m.value}
                        </div>
                      </div>
                      <div className="w-full h-1.5 bg-muted/30 rounded-full overflow-hidden">
                        <div
                          className={cn(
                            "h-1.5 rounded-full",
                            getMetricColor(m.value)
                          )}
                          style={{ width: `${clamp(Number(m.value))}%` }}
                        />
                      </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs text-xs">
                    <div className="font-medium mb-1">{m.label}</div>
                    <div>{m.tooltip ?? "No extra details available."}</div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>

          <div className="mt-3 flex gap-2">
            <Button
              variant={
                preferredCompany === companyA.companyName ? "success" : "ghost"
              }
              onClick={() => setFocus("a")}
              className="flex-1"
            >
              <ArrowUp className="mr-2 h-4 w-4" /> Buy
            </Button>
            <Button
              variant="outline"
              onClick={() => setFocus("both")}
              className="w-10"
            >
              <Zap size={16} />
            </Button>
          </div>
        </motion.div>

        {/* Company B Card */}
        <motion.div
          whileHover={{ y: -4 }}
          className={cn(
            "rounded-xl p-3 border-2 transition-all duration-300 ease-in-out",
            "bg-white/60 dark:bg-slate-800/60",
            focus === "a" ? "opacity-60 scale-95" : "opacity-100 scale-100",
            preferredCompany === companyB.companyName
              ? "border-green-500/50 shadow-lg shadow-green-500/10 dark:shadow-green-500/5"
              : "border-slate-200 dark:border-slate-700"
          )}
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg overflow-hidden bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center text-white font-bold">
                {companyB.logoUrl ? (
                  <img
                    src={companyB.logoUrl}
                    alt={companyB.companyName}
                    className="h-10 w-10 object-cover"
                  />
                ) : (
                  companyB.companyName?.slice(0, 2).toUpperCase()
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <div className="text-sm font-semibold">
                    {companyB.companyName}
                  </div>
                  {preferredCompany === companyB.companyName && (
                    <div className="flex items-center gap-1 text-xs font-medium text-green-700 dark:text-green-300 bg-green-500/10 px-1.5 py-0.5 rounded-full">
                      <Crown size={12} />
                      <span>Preferred</span>
                    </div>
                  )}
                </div>
                <div className="text-xs text-muted-foreground">
                  {companyB.ticker ?? "—"}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-xs text-muted-foreground">Score</div>
              <div className="w-20 bg-muted/40 rounded-full h-2 overflow-hidden">
                <div
                  className={cn(
                    "h-2 rounded-full transition-colors",
                    combinedScore.b > combinedScore.a
                      ? "bg-green-400"
                      : "bg-amber-400"
                  )}
                  style={{ width: `${clamp(combinedScore.b)}%` }}
                />
              </div>
            </div>
          </div>

          {/* THE INDIVIDUAL CHART AND INTERPRETATION FOR COMPANY B USED TO BE HERE. IT IS NOW REMOVED. */}

          <div className="mt-3 grid grid-cols-2 gap-2">
            {(companyB.metrics || []).slice(0, 4).map((m, idx) => (
              <TooltipProvider key={m.label + idx}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="rounded-md p-2 border bg-muted/20 flex flex-col gap-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <div className="font-medium">{m.label}</div>
                        <div className="text-xs text-muted-foreground">
                          {m.value}
                        </div>
                      </div>
                      <div className="w-full h-1.5 bg-muted/30 rounded-full overflow-hidden">
                        <div
                          className={cn(
                            "h-1.5 rounded-full",
                            getMetricColor(m.value)
                          )}
                          style={{ width: `${clamp(Number(m.value))}%` }}
                        />
                      </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs text-xs">
                    <div className="font-medium mb-1">{m.label}</div>
                    <div>{m.tooltip ?? "No extra details available."}</div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>

          <div className="mt-3 flex gap-2">
            <Button
              variant={
                preferredCompany === companyB.companyName ? "success" : "ghost"
              }
              onClick={() => setFocus("b")}
              className="flex-1"
            >
              <ArrowUp className="mr-2 h-4 w-4" /> Buy
            </Button>
            <Button
              variant="outline"
              onClick={() => setFocus("both")}
              className="w-10"
            >
              <Zap size={16} />
            </Button>
          </div>
        </motion.div>
      </div>

      {/* ==================================================================== */}
      {/* SECTION 4 & BEYOND: REMAINING SECTIONS (No changes here)           */}
      {/* ==================================================================== */}
      {/* Comparison table / metrics */}
      {comparisonTable && (
        <div className="mt-4 rounded-xl border border-slate-200 dark:border-slate-700 p-3 bg-muted/20">
          <div className="mt-3 overflow-x-auto">
            <table className="w-full table-fixed text-sm">
              <thead>
                <tr className="text-xs text-muted-foreground">
                  {comparisonTable.headers.map((h, i) => (
                    <th
                      key={i}
                      className={
                        i === 0
                          ? "text-left font-medium"
                          : "text-right py-2 px-3 font-medium"
                      }
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comparisonTable.rows.map((r) => {
                  const better =
                    typeof r.value1 === "number" && typeof r.value2 === "number"
                      ? r.value1 > r.value2
                      : null;
                  return (
                    <tr
                      key={r.label}
                      className="border-t border-slate-200 dark:border-slate-700 hover:bg-slate-100/50 dark:hover:bg-slate-800/50"
                    >
                      <td className="py-3 px-3 text-xs text-muted-foreground">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="flex items-center gap-2 cursor-help">
                                <span className="font-medium">{r.label}</span>
                                <Info size={12} className="opacity-50" />
                              </div>
                            </TooltipTrigger>
                            <TooltipContent className="text-xs max-w-xs">
                              <div>{r.tooltip}</div>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </td>
                      <td
                        className={cn(
                          "py-3 px-3 text-right font-medium",
                          better ? "text-green-600 dark:text-green-400" : ""
                        )}
                      >
                        {formatValue(r.value1)}
                      </td>
                      <td
                        className={cn(
                          "py-3 px-3 text-right font-medium",
                          better === false
                            ? "text-green-600 dark:text-green-400"
                            : ""
                        )}
                      >
                        {formatValue(r.value2)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Verdict / Tabs */}
      <div className="mt-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-muted/20 p-4">
        <h3 className="font-semibold text-sm mb-2 text-foreground">
          Analyst Verdicts
        </h3>
        <Tabs defaultValue={companyA.companyName}>
          <TabsList className="grid grid-cols-2 rounded-md overflow-hidden">
            <TabsTrigger value={companyA.companyName}>
              {companyA.companyName}
            </TabsTrigger>
            <TabsTrigger value={companyB.companyName}>
              {companyB.companyName}
            </TabsTrigger>
          </TabsList>
          <TabsContent
            value={companyA.companyName}
            className="mt-3 prose prose-sm dark:prose-invert max-w-none text-muted-foreground"
          >
            <ReactMarkdown>{`${companyA.finalVerdict || ""}\n\n${
              companyA.recommendation || ""
            }`}</ReactMarkdown>
          </TabsContent>
          <TabsContent
            value={companyB.companyName}
            className="mt-3 prose prose-sm dark:prose-invert max-w-none text-muted-foreground"
          >
            <ReactMarkdown>{`${companyB.finalVerdict || ""}\n\n${
              companyB.recommendation || ""
            }`}</ReactMarkdown>
          </TabsContent>
        </Tabs>
      </div>

      {/* Final Suggestion */}
      {finalSuggestion && (
        <div className="mt-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100/50 dark:bg-slate-800/30 p-4">
          <h4 className="font-semibold text-foreground mb-2">
            Head-to-Head Summary
          </h4>
          <div className="prose prose-sm dark:prose-invert max-w-none mb-4">
            <ReactMarkdown
              components={{
                p: ({ node, ...props }) => (
                  <p
                    className="text-muted-foreground leading-relaxed"
                    {...props}
                  />
                ),
              }}
            >
              {finalSuggestion}
            </ReactMarkdown>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setFocus("a")}
              className={cn(
                "flex-1",
                preferredCompany === companyA.companyName &&
                  "border-green-500 text-green-600 dark:text-green-400"
              )}
            >
              Buy {companyA.companyName}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setFocus("b")}
              className={cn(
                "flex-1",
                preferredCompany === companyB.companyName &&
                  "border-green-500 text-green-600 dark:text-green-400"
              )}
            >
              Buy {companyB.companyName}
            </Button>
          </div>
        </div>
      )}
    </motion.div>
  );
}
export { FundamentalComparisonCard };
