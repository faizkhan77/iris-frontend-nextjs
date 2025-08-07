"use client";

import React from "react";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  ShieldCheck,
  ShieldAlert,
  Info,
} from "lucide-react";
import {
  ALL_INDICATOR_NAMES,
  INDICATOR_DISPLAY_NAMES,
} from "../lib/analysis_constants";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"; // <-- Import Tooltip components

interface Stock {
  id: number;
  symbol: string;
  name: string;
  currentPrice: number;
  overallSignal: string;
  signals: { name: string; decision: string }[];
}

interface StockTableProps {
  stocks: Stock[];
  onStockSelect: (stock: Stock) => void;
  selectedIndicators: { [key: string]: boolean };
  onIndicatorToggle: (indicatorName: string) => void;
}

const getSignalInfo = (signal: string | null) => {
  if (!signal) {
    return {
      customClass:
        "bg-gray-200 text-gray-800 dark:bg-element-bg dark:text-text-secondary",
      icon: <Minus className="h-4 w-4" />,
      text: "N/A",
    };
  }
  const lowerSignal = signal.toLowerCase();
  if (lowerSignal.includes("strong buy"))
    return {
      customClass: "bg-green-600 text-white dark:bg-green-500",
      icon: <ShieldCheck className="h-5 w-5" />,
      text: "Strong Buy",
    };
  if (lowerSignal.includes("buy"))
    return {
      customClass:
        "bg-green-500 text-white dark:bg-green-500/30 dark:text-green-400",
      icon: <TrendingUp className="h-5 w-5" />,
      text: "Buy",
    };
  if (lowerSignal.includes("strong sell"))
    return {
      customClass: "bg-red-600 text-white dark:bg-red-500",
      icon: <ShieldAlert className="h-5 w-5" />,
      text: "Strong Sell",
    };
  if (lowerSignal.includes("sell"))
    return {
      customClass: "bg-red-500 text-white dark:bg-red-500/30 dark:text-red-400",
      icon: <TrendingDown className="h-5 w-5" />,
      text: "Sell",
    };
  return {
    customClass:
      "bg-yellow-200 text-yellow-800 dark:bg-yellow-500/20 dark:text-yellow-400",
    icon: <Info className="h-5 w-5" />,
    text: "Neutral",
  };
};

export default function StockTable({
  stocks,
  onStockSelect,
  selectedIndicators,
  onIndicatorToggle,
}: StockTableProps) {
  const baseColumns = [
    { key: "name", label: "Company", widthClass: "w-1/4 min-w-[200px]" },
    { key: "currentPrice", label: "Price", widthClass: "w-1/12 min-w-[80px]" },
    {
      key: "overallSignal",
      label: "Overall Signal",
      widthClass: "w-1/12 min-w-[140px]",
    },
  ];
  const indicatorColumns = ALL_INDICATOR_NAMES.filter(
    (name) => selectedIndicators[name]
  ).map((name) => ({
    key: name,
    label: INDICATOR_DISPLAY_NAMES[name] || name,
    widthClass: "w-auto min-w-[80px]",
  }));
  const columns = [...baseColumns, ...indicatorColumns];

  return (
    <TooltipProvider delayDuration={100}>
      <div className="space-y-8">
        <div className="bg-content-bg border border-element-border rounded-xl shadow-lg p-6 md:p-8">
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-text-primary">
              Tune Your Analysis
            </h3>
            <p className="text-sm text-text-secondary mt-1">
              Select indicators to refine the stock signals.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {ALL_INDICATOR_NAMES.map((name) => (
              <label
                key={name}
                className="flex items-center space-x-3 p-3 rounded-lg cursor-pointer border border-transparent hover:border-accent hover:bg-element-bg transition-all duration-200"
              >
                <input
                  type="checkbox"
                  checked={!!selectedIndicators[name]}
                  onChange={() => onIndicatorToggle(name)}
                  className="h-5 w-5 rounded border-2 border-element-border-hover bg-element-bg text-accent focus:ring-accent accent-accent"
                />
                <span className="text-sm font-medium text-text-primary select-none">
                  {INDICATOR_DISPLAY_NAMES[name] || name}
                </span>
              </label>
            ))}
          </div>
        </div>

        {!stocks || stocks.length === 0 ? (
          <div className="text-center py-10 px-4 text-lg rounded-lg bg-content-bg border border-element-border shadow text-text-secondary">
            <Info className="h-12 w-12 mx-auto mb-4 opacity-50" />
            No stocks match your criteria. Try adjusting the selected
            indicators.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-element-border shadow-xl">
            <table className="w-full min-w-[900px]">
              <thead className="bg-element-bg/50">
                <tr>
                  {columns.map((col) => (
                    <th
                      key={col.key}
                      scope="col"
                      className={cn(
                        "px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-text-secondary",
                        col.widthClass
                      )}
                    >
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-content-bg divide-y divide-element-border">
                {stocks.map((stock) => {
                  const overallSignalInfo = getSignalInfo(stock.overallSignal);
                  return (
                    <tr
                      key={stock.id}
                      onClick={() => onStockSelect(stock)}
                      className="group hover:bg-element-bg/50 cursor-pointer transition-colors"
                    >
                      {columns.map((col) => {
                        // Logic for name and price cells... (shortened for brevity)
                        if (col.key === "name")
                          return (
                            <td
                              key={col.key}
                              className="px-4 py-3 whitespace-nowrap text-sm"
                            >
                              <div className="font-semibold text-text-primary">
                                {stock.name}
                              </div>
                              <div className="text-xs text-text-secondary">
                                {stock.symbol}
                              </div>
                            </td>
                          );
                        if (col.key === "currentPrice")
                          return (
                            <td
                              key={col.key}
                              className="px-4 py-3 whitespace-nowrap text-sm text-text-primary font-medium"
                            >
                              {typeof stock.currentPrice === "number"
                                ? `₹${stock.currentPrice.toFixed(2)}`
                                : "N/A"}
                            </td>
                          );
                        if (col.key === "overallSignal")
                          return (
                            <td
                              key={col.key}
                              className="px-4 py-3 whitespace-nowrap text-sm"
                            >
                              <div
                                className={cn(
                                  "inline-flex items-center gap-x-2 px-2.5 py-1 rounded-full text-xs font-medium",
                                  overallSignalInfo.customClass
                                )}
                              >
                                {overallSignalInfo.icon}
                                <span className="font-semibold">
                                  {overallSignalInfo.text}
                                </span>
                              </div>
                            </td>
                          );
                        if (ALL_INDICATOR_NAMES.includes(col.key)) {
                          const signalObj = stock.signals?.find(
                            (s) => s.name === col.key
                          );
                          const decisionInfo = getSignalInfo(
                            signalObj ? signalObj.decision : null
                          );
                          return (
                            <td
                              key={col.key}
                              className="px-4 py-3 whitespace-nowrap text-sm text-center"
                            >
                              {/* --- TOOLTIP IMPLEMENTATION --- */}
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div
                                    className={cn(
                                      "inline-flex items-center justify-center h-7 w-7 rounded-full transition-transform group-hover:scale-110",
                                      decisionInfo.customClass
                                    )}
                                  >
                                    {React.cloneElement(decisionInfo.icon, {
                                      className: "h-4 w-4",
                                    })}
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent className="bg-element-bg-hover border-element-border text-text-primary">
                                  <p>{decisionInfo.text}</p>
                                </TooltipContent>
                              </Tooltip>
                            </td>
                          );
                        }
                        // Fallback cell
                        return (
                          <td
                            key={col.key}
                            className="px-4 py-3 whitespace-nowrap text-sm text-text-secondary"
                          >
                            ...
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}
