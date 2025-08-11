import React from "react";
import { Screen, ScreenCategory } from "@/app/lib/types";
import ScreenCard from "./ScreenCard";
import { ArrowLeftIcon } from "./Icons";

interface CategoryDetailViewProps {
  category: ScreenCategory;
  onClose: () => void;
  onRunScreen: (screen: Screen) => void;
  isCombining: boolean;
  selectedForCombination: Screen[];
  onSelectForCombination: (screen: Screen) => void;
}

const CategoryDetailView: React.FC<CategoryDetailViewProps> = ({
  category,
  onClose,
  onRunScreen,
  isCombining,
  selectedForCombination,
  onSelectForCombination,
}) => {
  return (
    <div className="col-span-9 space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={onClose}
          className="flex items-center gap-2 text-sm text-brand-text-secondary hover:text-brand-text-primary transition-colors"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          <span className="hidden sm:inline">Back to Dashboard</span>
        </button>
        <h2 className="text-xl font-bold text-brand-text-primary">
          {category.title}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {category.screens.map((screen) => (
          <ScreenCard
            key={screen.title}
            screen={screen}
            onRunScreen={onRunScreen}
            isCombining={isCombining}
            isSelected={selectedForCombination.some(
              (s) => s.title === screen.title
            )}
            onSelect={onSelectForCombination}
          />
        ))}
      </div>
    </div>
  );
};

export default CategoryDetailView;
