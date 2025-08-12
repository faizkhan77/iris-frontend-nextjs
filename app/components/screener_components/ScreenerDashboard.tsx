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
    <main className="col-span-9 space-y-8 scrollbar-cyan">
      {/* Filters Container */}
      <div
        className="flex items-center justify-between flex-wrap gap-4 
        bg-white text-gray-900 
        dark:bg-neutral-900 dark:text-white
        border border-gray-300 dark:border-neutral-700 
        rounded-xl p-3"
      >
        {/* Timeframe & Cap Filters */}
        <div className="flex items-center gap-4 flex-wrap">
          {/* Timeframe Select */}
          <div className="flex items-center gap-2">
            <label
              htmlFor="timeframe"
              className="text-sm text-gray-600 dark:text-gray-300"
            >
              Timeframe
            </label>
            <select
              id="timeframe"
              value={timeframe}
              onChange={(e) => onTimeframeChange(e.target.value)}
              className="bg-white text-gray-900 border border-gray-300 
              dark:bg-neutral-800 dark:text-white dark:border-neutral-700
              rounded-md px-2 py-1 text-sm focus:ring-1 focus:ring-brand-primary focus:outline-none"
            >
              <option>1M</option>
              <option>3M</option>
              <option>6M</option>
              <option>1Y</option>
            </select>
          </div>

          {/* Market Cap Buttons */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 dark:text-gray-300">
              Market Cap
            </span>
            <div className="flex items-center gap-2">
              {["All", "Largecap", "Midcap", "Smallcap"].map((cap) => (
                <button
                  key={cap}
                  onClick={() => onSelectCap(cap)}
                  className={`px-3 py-1 text-xs rounded-md transition-colors border
                    ${
                      selectedCap === cap
                        ? "bg-brand-primary/20 text-brand-primary border-brand-primary"
                        : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200 dark:bg-neutral-800 dark:text-gray-300 dark:border-neutral-700 dark:hover:bg-neutral-700"
                    }`}
                >
                  {cap}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Reset Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={onResetFilters}
            className="px-3 py-1.5 text-sm font-medium rounded-lg 
            bg-gray-100 text-gray-800 border border-gray-300 hover:bg-gray-200 
            dark:bg-neutral-800 dark:text-white dark:border-neutral-700 dark:hover:bg-neutral-700 
            transition-colors"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Category Sections */}
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
        <div
          className="text-center py-16 
          bg-white text-gray-900 
          dark:bg-neutral-900 dark:text-white
          border border-gray-300 dark:border-neutral-700 
          rounded-xl"
        >
          <h3 className="text-lg font-semibold">No Results Found</h3>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
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
