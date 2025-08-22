"use client";

import React from "react";

interface MetricItemProps {
  label: string;
  value?: string | number | null;
  unit?: "₹" | "%" | "";
}

const MetricItem = ({ label, value, unit = "" }: MetricItemProps) => {
  const formatValue = () => {
    if (value === "N/A" || value === null || typeof value === "undefined") {
      return "N/A";
    }
    // The data is pre-formatted, so we just append the unit if it's a number
    if (typeof value === "number") {
      return `${unit}${value.toFixed(2)}`;
    }
    // If it's already a string, assume it's formatted (e.g., "1,234 Cr")
    return `${value}${unit}`;
  };

  return (
    <div className="flex justify-between border-b border-element-border py-3">
      <span className="text-sm text-text-secondary">{label}</span>
      <span className="text-sm font-semibold text-text-primary">
        {formatValue()}
      </span>
    </div>
  );
};

interface KeyMetricsGridProps {
  stockData: {
    marketCapFormatted?: string;
    stockPE?: number;
    currentPrice?: number;
    bookValueFormatted?: string;
    yearHighLow?: string;
    dividendYield?: number;
    roce?: number;
    roe?: number;
    rsiValue?: number;
    faceValue?: number;
  };
}

export default function KeyMetricsGrid({ stockData }: KeyMetricsGridProps) {
  if (!stockData) {
    return <div className="text-text-secondary">Loading key metrics...</div>;
  }

  const metrics: MetricItemProps[] = [
    { label: "Market Cap", value: stockData.marketCapFormatted },
    { label: "Stock P/E", value: stockData.stockPE },
    { label: "Current Price", value: stockData.currentPrice, unit: "₹" },
    { label: "Book Value", value: stockData.bookValueFormatted },
    { label: "52W High/Low", value: stockData.yearHighLow },
    { label: "Div Yield", value: stockData.dividendYield, unit: "%" },
    { label: "ROCE", value: stockData.roce, unit: "%" },
    { label: "ROE", value: stockData.roe, unit: "%" },
    { label: "RSI (14)", value: stockData.rsiValue },
    { label: "Face Value", value: stockData.faceValue, unit: "₹" },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-6">
      {metrics.map((metric) => (
        <MetricItem
          key={metric.label}
          label={metric.label}
          value={metric.value}
          unit={metric.unit}
        />
      ))}
    </div>
  );
}
