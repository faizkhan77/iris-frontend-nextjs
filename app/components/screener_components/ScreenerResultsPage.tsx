// components/screener_components/ScreenerResultsPage.tsx
"use client"; // This component now uses hooks, so it must be a client component.

import React, { useState, useEffect } from "react";
import { Screen, Stock } from "../../lib/types"; // Adjust path
import { ArrowLeftIcon, SpinnerIcon } from "./Icons"; // Adjust path
import ScreenCombiner from "./ScreenCombiner"; // Adjust path
import { fetchScreenerResults, fetchPriceChanges } from "../../lib/api"; // <-- IMPORT OUR NEW API FUNCTION

// --- NEW: Utility function to format market cap ---
const formatMarketCap = (value: number) => {
  if (!value) return "N/A";
  const valInCrores = value / 10000000; // Value from DB is in absolute terms
  if (valInCrores >= 100000) {
    return `${(valInCrores / 100000).toFixed(2)} Lakh Cr`;
  }
  if (valInCrores > 0) {
    return `${valInCrores.toLocaleString("en-IN", {
      maximumFractionDigits: 0,
    })} Cr`;
  }
  return "N/A";
};

const INITIAL_VISIBLE_ROWS = 15;

interface ScreenerResultsPageProps {
  initialScreens: Screen[];
  onClose: () => void;
  selectedSectors: string[];
  // onSaveCombination: (screens: Screen[]) => void; // We can add this back later
}

export default function ScreenerResultsPage({
  initialScreens,
  onClose,
  selectedSectors,
}: ScreenerResultsPageProps) {
  const [currentScreens, setCurrentScreens] =
    useState<Screen[]>(initialScreens);
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [visibleRows, setVisibleRows] = useState(INITIAL_VISIBLE_ROWS);

  useEffect(() => {
    setVisibleRows(INITIAL_VISIBLE_ROWS);
    const runScreener = async () => {
      if (currentScreens.length === 0) {
        setStocks([]);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const screenerTitles = currentScreens.map((s) => s.title);
        // --- STEP 1: Initial fast fetch ---
        const initialResults = await fetchScreenerResults(screenerTitles);

        // Add a null placeholder for changePercent
        const stocksWithPlaceholders = initialResults.map((s) => ({
          ...s,
          changePercent: null,
        }));
        setStocks(stocksWithPlaceholders);
        setIsLoading(false); // <-- Stop initial loading HERE

        // --- STEP 2: Secondary fetch for price changes ---
        const fincodes = initialResults.map((s) => s.fincode);
        const priceChanges = await fetchPriceChanges(fincodes);

        // Update the state with the real changePercent values
        setStocks((currentStocks) =>
          currentStocks.map((stock) => ({
            ...stock,
            changePercent: priceChanges[stock.fincode] ?? 0.0,
          }))
        );
      } catch (err: any) {
        console.error("Failed to run screener:", err);
        setError(err.message || "An error occurred.");
        setIsLoading(false); // Stop loading on error
      }
    };

    runScreener();
  }, [currentScreens]);

  const filteredStocks = selectedSectors.includes("All")
    ? stocks
    : stocks.filter((stock) => selectedSectors.includes(stock.sector));

  const handleShowMore = () => {
    setVisibleRows(stocks.length); // Show all remaining stocks
  };

  const handleAddScreen = (screenToAdd: Screen) => {
    if (!currentScreens.some((s) => s.title === screenToAdd.title)) {
      setCurrentScreens([...currentScreens, screenToAdd]);
    }
  };

  const handleRemoveScreen = (screenTitleToRemove: string) => {
    if (currentScreens.length > 1) {
      setCurrentScreens(
        currentScreens.filter((s) => s.title !== screenTitleToRemove)
      );
    }
  };

  const mainTitle =
    currentScreens.length === 1 ? currentScreens[0].title : "Combined Screen";

  const mainDescription =
    currentScreens.length === 1
      ? currentScreens[0].description
      : `Intersection of ${currentScreens.length} screens, showing stocks that match all criteria.`;

  return (
    <div className="col-span-9 bg-brand-container border border-brand-border rounded-xl">
      {/* --- Header Section (Unchanged) --- */}
      <div className="p-4 border-b border-brand-border space-y-4">
        <div>
          <button onClick={onClose} /* ... */>
            <ArrowLeftIcon className="w-4 h-4" />
            Back to Dashboard
          </button>
          <h2 className="text-xl font-bold text-brand-text-primary">
            {mainTitle}
          </h2>
          <p className="text-sm text-brand-text-secondary">{mainDescription}</p>
        </div>
        <div>
          <p className="text-xs text-brand-text-tertiary mb-2">
            Active Screens:
          </p>
          <div className="flex flex-wrap items-center gap-2">
            {currentScreens.map((s) => (
              <div key={s.title} /* ... */>
                <span>{s.title}</span>
                {currentScreens.length > 1 && (
                  <button onClick={() => handleRemoveScreen(s.title)} /* ... */>
                    &times;
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <ScreenCombiner
            currentScreens={currentScreens}
            onAddScreen={handleAddScreen}
          />
          {/* We'll handle save combination later */}
        </div>
      </div>

      {/* --- Results Count (Unchanged) --- */}
      <div className="p-2 border-b border-brand-border">{/* ... */}</div>

      {/* --- Main Table / Loading / Error State --- */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="sticky top-0 bg-brand-container border-b border-brand-border">
            {/* Column headers are now inside a sticky thead */}
            <tr>
              <th className="px-4 py-2 font-semibold text-brand-text-secondary">
                Symbol
              </th>
              <th className="px-4 py-2 font-semibold text-brand-text-secondary">
                Company
              </th>
              <th className="px-4 py-2 font-semibold text-brand-text-secondary">
                Sector
              </th>
              <th className="px-4 py-2 font-semibold text-brand-text-secondary text-right">
                Price
              </th>
              <th className="px-4 py-2 font-semibold text-brand-text-secondary text-right">
                Change %
              </th>
              <th className="px-4 py-2 font-semibold text-brand-text-secondary text-right">
                Market Cap
              </th>
              <th className="px-4 py-2 font-semibold text-brand-text-secondary text-right">
                P/E Ratio
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={7} className="text-center py-16">
                  <div className="flex justify-center items-center gap-2 text-brand-text-secondary">
                    <SpinnerIcon className="w-5 h-5 animate-spin" />
                    <span>Loading results...</span>
                  </div>
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={7} className="text-center py-16 text-red-400">
                  <p>Error: {error}</p>
                  <p className="text-sm mt-1">
                    Please try again or select a different screener.
                  </p>
                </td>
              </tr>
            ) : filteredStocks.length > 0 ? (
              // --- RENDER ONLY VISIBLE ROWS ---
              filteredStocks.slice(0, visibleRows).map((stock) => (
                <tr
                  key={stock.symbol}
                  className="border-b border-brand-border last:border-b-0 hover:bg-white/5 transition-colors"
                >
                  <td className="px-4 py-3 font-mono font-medium text-brand-text-primary">
                    {stock.symbol}
                  </td>
                  <td className="px-4 py-3 text-brand-text-secondary truncate max-w-xs">
                    {stock.companyName}
                  </td>
                  <td className="px-4 py-3 text-brand-text-secondary">
                    {stock.sector}
                  </td>
                  <td className="px-4 py-3 font-mono text-right text-brand-text-primary">
                    ₹{stock.price ? stock.price.toFixed(2) : "N/A"}
                  </td>
                  <td
                    className={`px-4 py-3 font-mono text-right ${
                      stock.changePercent === null
                        ? "text-brand-text-tertiary"
                        : stock.changePercent >= 0
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  >
                    {stock.changePercent === null
                      ? "..." // Loading placeholder
                      : `${
                          stock.changePercent >= 0 ? "+" : ""
                        }${stock.changePercent.toFixed(2)}%`}
                  </td>
                  {/* --- USE THE FORMATTING FUNCTION --- */}
                  <td className="px-4 py-3 font-mono text-right text-brand-text-secondary">
                    {formatMarketCap(stock.marketCap)}
                  </td>
                  <td className="px-4 py-3 font-mono text-right text-brand-text-secondary">
                    {stock.peRatio ? stock.peRatio.toFixed(2) : "N/A"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={7}
                  className="text-center py-8 text-brand-text-secondary"
                >
                  No stocks match the criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* --- "SHOW MORE" BUTTON --- */}
      {!isLoading && filteredStocks.length > visibleRows && (
        <div className="p-4 border-t border-brand-border text-center">
          <button
            onClick={handleShowMore}
            className="px-4 py-1.5 text-sm font-medium rounded-lg bg-neutral-800 text-brand-text-primary hover:bg-neutral-700 transition-colors"
          >
            Show More ({filteredStocks.length - visibleRows} remaining)
          </button>
        </div>
      )}
    </div>
  );
}
