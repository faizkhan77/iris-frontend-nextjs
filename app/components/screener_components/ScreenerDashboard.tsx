import React from "react";
import { SCREEN_CATEGORIES } from "@/app/lib/constants";
import ScreenCategorySection from "./ScreenCategorySection";
import { Screen, ScreenCategory } from "@/app/lib/types";

interface MainContentProps {
  timeframe: string;
  onTimeframeChange: (value: string) => void;
  selectedCap: string;
  onSelectCap: (cap: string) => void;
  onRunScreen: (screen: Screen) => void;
  onResetFilters: () => void;
  onSeeAll: (category: ScreenCategory) => void;
  globalSearch: string;
  isCombining: boolean;
  selectedForCombination: Screen[];
  onSelectForCombination: (screen: Screen) => void;
  userScreenCategory: ScreenCategory | null;
}

const MainContent: React.FC<MainContentProps> = ({
  timeframe,
  onTimeframeChange,
  selectedCap,
  onSelectCap,
  onRunScreen,
  onResetFilters,
  onSeeAll,
  globalSearch,
  isCombining,
  selectedForCombination,
  onSelectForCombination,
  userScreenCategory,
}) => {
  const searchTerm = globalSearch.toLowerCase();

  const allCategories = userScreenCategory
    ? [userScreenCategory, ...SCREEN_CATEGORIES]
    : SCREEN_CATEGORIES;

  const filteredCategories = !searchTerm
    ? allCategories
    : allCategories
        .map((category) => {
          if (category.title.toLowerCase().includes(searchTerm)) {
            return category;
          }
          const filteredScreens = category.screens.filter(
            (screen) =>
              screen.title.toLowerCase().includes(searchTerm) ||
              screen.description.toLowerCase().includes(searchTerm)
          );
          if (filteredScreens.length > 0) {
            return { ...category, screens: filteredScreens };
          }
          return null;
        })
        .filter((category): category is ScreenCategory => category !== null);

  return (
    <main className="col-span-9 space-y-8">
      <div className="flex items-center justify-between flex-wrap gap-4 bg-brand-container border border-brand-border rounded-xl p-3">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <label
              htmlFor="timeframe"
              className="text-sm text-brand-text-secondary"
            >
              Timeframe
            </label>
            <select
              id="timeframe"
              value={timeframe}
              onChange={(e) => onTimeframeChange(e.target.value)}
              className="bg-brand-bg border border-brand-border rounded-md px-2 py-1 text-sm focus:ring-1 focus:ring-brand-primary focus:outline-none"
            >
              <option>1M</option>
              <option>3M</option>
              <option>6M</option>
              <option>1Y</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-brand-text-secondary">
              Market Cap
            </span>
            <div className="flex items-center gap-2">
              {["All", "Largecap", "Midcap", "Smallcap"].map((cap) => (
                <button
                  key={cap}
                  onClick={() => onSelectCap(cap)}
                  className={`px-3 py-1 text-xs rounded-md transition-colors ${
                    selectedCap === cap
                      ? "bg-brand-primary/20 text-brand-primary ring-1 ring-brand-primary/50"
                      : "bg-neutral-700/50 hover:bg-neutral-600/50 text-brand-text-secondary"
                  }`}
                >
                  {cap}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onResetFilters}
            className="px-3 py-1.5 text-sm font-medium rounded-lg bg-neutral-800 text-brand-text-primary hover:bg-neutral-700 transition-colors"
          >
            Reset
          </button>
        </div>
      </div>

      {filteredCategories.length > 0 ? (
        filteredCategories.map((category) => (
          <ScreenCategorySection
            key={category.title}
            category={category}
            onRunScreen={onRunScreen}
            onSeeAll={onSeeAll}
            isCombining={isCombining}
            selectedForCombination={selectedForCombination}
            onSelectForCombination={onSelectForCombination}
          />
        ))
      ) : (
        <div className="text-center py-16 bg-brand-container border border-brand-border rounded-xl">
          <h3 className="text-lg font-semibold text-brand-text-primary">
            No Results Found
          </h3>
          <p className="text-brand-text-secondary mt-1">
            Try adjusting your search term or{" "}
            <button
              onClick={onResetFilters}
              className="text-brand-primary hover:underline"
            >
              reset all filters
            </button>
            .
          </p>
        </div>
      )}
    </main>
  );
};

export default MainContent;
