"use client";

import React, { useState, useEffect, useMemo } from "react";
import StockTable from "./StockTable"; // Import our new StockTable
import { ALL_INDICATOR_NAMES } from "../lib/analysis_constants";
import { Search } from "lucide-react";

// In a real app, this should come from environment variables
const API_BASE_URL = "http://127.0.0.1:8000/api";

// Define the Stock type based on expected API response
interface Stock {
  id: number;
  symbol: string;
  name: string;
  currentPrice: number;
  overallSignal: string;
  signals: { name: string; decision: string }[];
}

export default function ScreenerPage() {
  const [stocksSummary, setStocksSummary] = useState<Stock[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const initialSelectedIndicators = ALL_INDICATOR_NAMES.reduce(
    (acc, indicator) => {
      acc[indicator] = true; // Default all to true
      return acc;
    },
    {} as { [key: string]: boolean }
  );
  const [selectedIndicators, setSelectedIndicators] = useState(
    initialSelectedIndicators
  );

  // Fetch stocks summary when selectedIndicators change
  useEffect(() => {
    const fetchStocksSummary = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const activeIndicators = Object.keys(selectedIndicators).filter(
          (indicator) => selectedIndicators[indicator]
        );
        const params = new URLSearchParams();
        if (activeIndicators.length > 0) {
          params.append("selectedIndicators", activeIndicators.join(","));
        }

        const response = await fetch(
          `${API_BASE_URL}/stocks?${params.toString()}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setStocksSummary(data || []);
      } catch (e: any) {
        setError(e.message);
        console.error("Failed to fetch stocks summary:", e);
        setStocksSummary([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStocksSummary();
  }, [selectedIndicators]);

  // Filter stocks based on search query
  const filteredStocks = useMemo(() => {
    if (!stocksSummary) return [];
    return stocksSummary.filter((stock) => {
      const symbol = stock.symbol || "";
      const companyName = stock.name || "";
      return (
        symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        companyName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [stocksSummary, searchQuery]);

  // Handler for when a stock row is clicked
  const handleStockSelect = (stock: Stock) => {
    // For now, we just log it. Later, this will navigate to the detail page.
    console.log("Selected stock:", stock.symbol);
    // TODO: Implement navigation to stock detail page
  };

  // Handler for toggling an indicator checkbox
  const handleIndicatorToggle = (indicatorName: string) => {
    setSelectedIndicators((prev) => ({
      ...prev,
      [indicatorName]: !prev[indicatorName],
    }));
  };

  if (error) {
    return (
      <div className="flex h-full items-center justify-center text-center text-red-500">
        <div>
          <h2 className="text-xl font-semibold">Failed to load data</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (isLoading && stocksSummary.length === 0) {
    return (
      <div className="flex h-full items-center justify-center text-text-secondary">
        Loading Screener...
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto custom-scrollbar bg-content-bg text-text-primary">
      <header className="sticky top-0 z-20 bg-content-bg/80 backdrop-blur-md p-4 md:px-6 border-b border-element-border">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-text-primary">
            Stock Screener
          </h1>
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-tertiary" />
            <input
              type="text"
              placeholder="Search by symbol or company..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-md border border-element-border bg-background py-2 pl-9 pr-4 text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>
        </div>
      </header>
      <StockTable
        stocks={filteredStocks}
        onStockSelect={handleStockSelect}
        selectedIndicators={selectedIndicators}
        onIndicatorToggle={handleIndicatorToggle}
      />
    </div>
  );
}
