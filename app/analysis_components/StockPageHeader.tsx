"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface PriceChange {
  absolute: string;
  percent: string;
  isPositive: boolean;
}

interface StockPageHeaderProps {
  stockData: {
    name?: string;
    sector?: string;
    industry?: string;
    nseCode?: string;
    bseCode?: string;
    currentPrice?: number;
    priceChange?: PriceChange;
  };
}

export default function StockPageHeader({ stockData }: StockPageHeaderProps) {
  const {
    name,
    sector,
    industry,
    nseCode,
    bseCode,
    currentPrice,
    priceChange,
  } = stockData;

  return (
    <header className="flex flex-col md:flex-row md:items-start md:justify-between pb-4 mb-6 border-b border-element-border">
      {/* Left side: Name and Sector Info */}
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-text-primary">
          {name || "N/A"}
        </h1>
        <div className="mt-2 text-xs text-text-secondary">
          <span>Sector: {sector || "N/A"}</span>
          <span className="mx-2">|</span>
          <span>Industry: {industry || "N/A"}</span>
          <div className="mt-1">
            {nseCode && (
              <a
                href={`https://www.screener.in/company/${nseCode}/consolidated/`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:underline"
              >
                NSE: {nseCode}
              </a>
            )}
            {nseCode && bseCode && <span className="mx-2">|</span>}
            {bseCode && <span>BSE: {bseCode}</span>}
          </div>
        </div>
      </div>

      {/* Right side: Price Info */}
      <div className="mt-4 md:mt-0 md:text-right">
        <div className="text-4xl font-semibold text-text-primary">
          ₹{typeof currentPrice === "number" ? currentPrice.toFixed(2) : "N/A"}
        </div>
        {priceChange &&
          typeof priceChange.absolute === "number" &&
          typeof priceChange.percent === "number" && (
            <div
              className={cn(
                "text-md font-medium mt-1",
                priceChange.isPositive ? "text-green-500" : "text-red-500"
              )}
            >
              {priceChange.isPositive ? "▲" : "▼"}{" "}
              {priceChange.absolute.toFixed(2)} (
              {priceChange.percent.toFixed(2)}%)
            </div>
          )}
      </div>
    </header>
  );
}
