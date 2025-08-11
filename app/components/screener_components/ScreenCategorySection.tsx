import React from "react";
import { Screen, ScreenCategory } from "@/app/lib/types";
import ScreenCard from "./ScreenCard";

interface ScreenCategorySectionProps {
  category: ScreenCategory;
  onRunScreen: (screen: Screen) => void;
  onSeeAll: (category: ScreenCategory) => void;
  isCombining: boolean;
  selectedForCombination: Screen[];
  onSelectForCombination: (screen: Screen) => void;
}

const ScreenCategorySection: React.FC<ScreenCategorySectionProps> = ({
  category,
  onRunScreen,
  onSeeAll,
  isCombining,
  selectedForCombination,
  onSelectForCombination,
}) => {
  return (
    <section>
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-semibold text-brand-text-primary">
          {category.title}
        </h3>
        <button
          onClick={() => onSeeAll(category)}
          className="text-sm text-brand-text-secondary hover:text-brand-text-primary transition-colors"
        >
          See all
        </button>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-4 -ml-4 pl-4">
        {category.screens.map((screen) => (
          <div key={screen.title} className="flex-shrink-0 w-[300px]">
            <ScreenCard
              screen={screen}
              onRunScreen={onRunScreen}
              isCombining={isCombining}
              isSelected={selectedForCombination.some(
                (s) => s.title === screen.title
              )}
              onSelect={onSelectForCombination}
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default ScreenCategorySection;
