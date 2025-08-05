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

// Define TypeScript types for the props
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

// Rewritten with Tailwind classes for our theme
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
  let info = {
    customClass:
      "bg-yellow-200 text-yellow-800 dark:bg-yellow-500/20 dark:text-yellow-400",
    icon: <Info className="h-5 w-5" />,
    text: "Neutral",
  };

  if (lowerSignal.includes("strong buy")) {
    info = {
      customClass: "bg-green-600 text-white dark:bg-green-500 dark:text-white",
      icon: <ShieldCheck className="h-5 w-5" />,
      text: "Strong Buy",
    };
  } else if (lowerSignal.includes("buy")) {
    info = {
      customClass:
        "bg-green-500 text-white dark:bg-green-500/30 dark:text-green-400",
      icon: <TrendingUp className="h-5 w-5" />,
      text: "Buy",
    };
  } else if (lowerSignal.includes("strong sell")) {
    info = {
      customClass: "bg-red-600 text-white dark:bg-red-500 dark:text-white",
      icon: <ShieldAlert className="h-5 w-5" />,
      text: "Strong Sell",
    };
  } else if (lowerSignal.includes("sell")) {
    info = {
      customClass: "bg-red-500 text-white dark:bg-red-500/30 dark:text-red-400",
      icon: <TrendingDown className="h-5 w-5" />,
      text: "Sell",
    };
  }
  return info;
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
      label: "Overall",
      widthClass: "w-1/12 min-w-[120px]",
    },
  ];

  const indicatorColumns = ALL_INDICATOR_NAMES.filter(
    (name) => selectedIndicators[name]
  ).map((name) => ({
    key: name,
    label: INDICATOR_DISPLAY_NAMES[name] || name,
    widthClass: "w-1/12 min-w-[100px]",
  }));

  const columns = [...baseColumns, ...indicatorColumns];

  return (
    <div className="space-y-8 p-4 md:p-6">
      <div className="bg-content-bg border border-element-border rounded-xl shadow-lg p-6 md:p-8">
        <h3 className="text-xl font-semibold mb-6 text-text-primary">
          Tune Your Analysis
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-6 gap-y-4">
          {ALL_INDICATOR_NAMES.map((name) => (
            <label
              key={name}
              className="flex items-center space-x-3 p-3 rounded-md cursor-pointer hover:bg-element-bg transition-colors duration-200"
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

      <h2 className="text-2xl font-bold tracking-tight text-text-primary">
        Market Movers & Signals
      </h2>

      {!stocks || stocks.length === 0 ? (
        <div className="text-center py-10 px-4 text-lg rounded-lg bg-content-bg border border-element-border shadow text-text-secondary">
          <Info className="h-12 w-12 mx-auto mb-4 opacity-50" />
          No stocks match your criteria. Try adjusting the selected indicators.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-element-border shadow-xl">
          <table className="w-full min-w-[800px]">
            <thead className="bg-element-bg/50 sticky top-0 z-10">
              <tr>
                {columns.map((col) => (
                  <th
                    key={col.key}
                    scope="col"
                    className={cn(
                      "px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-text-secondary",
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
                    className="hover:bg-element-bg/50 cursor-pointer transition-colors"
                  >
                    {columns.map((col) => {
                      if (col.key === "name") {
                        return (
                          <td
                            key={col.key}
                            className="px-4 py-3 whitespace-nowrap text-sm"
                          >
                            <div className="flex flex-col">
                              <span className="font-semibold text-text-primary">
                                {stock.name}
                              </span>
                              <span className="text-xs text-text-secondary">
                                {stock.symbol}
                              </span>
                            </div>
                          </td>
                        );
                      }
                      if (col.key === "currentPrice") {
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
                      }
                      if (col.key === "overallSignal") {
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
                              <span>{overallSignalInfo.text}</span>
                            </div>
                          </td>
                        );
                      }
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
                            <div
                              className={cn(
                                "inline-flex items-center justify-center h-6 w-6 rounded-full",
                                decisionInfo.customClass
                              )}
                            >
                              {React.cloneElement(decisionInfo.icon, {
                                className: "h-3.5 w-3.5",
                              })}
                            </div>
                          </td>
                        );
                      }
                      return (
                        <td
                          key={col.key}
                          className="px-4 py-3 whitespace-nowrap text-sm text-text-secondary"
                        >
                          {(stock as any)[col.key] || "N/A"}
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
  );
}
