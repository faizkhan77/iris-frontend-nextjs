import React from "react";
import { Screen } from "@/app/lib/types";
import { CheckCircleIcon } from "./Icons";

interface ScreenCardProps {
  screen: Screen;
  onRunScreen: (screen: Screen) => void;
  isCombining: boolean;
  isSelected: boolean;
  onSelect: (screen: Screen) => void;
}

const formatDescription = (text: string) => {
  const parts = text.split(/(\d[\d,.]*)/);
  return (
    <>
      {parts.map((part, index) =>
        /(\d[\d,.]*)/.test(part) ? (
          <span key={index} className="font-mono">
            {part}
          </span>
        ) : (
          part
        )
      )}
    </>
  );
};

const ScreenCard: React.FC<ScreenCardProps> = ({
  screen,
  onRunScreen,
  isCombining,
  isSelected,
  onSelect,
}) => {
  const cardClickHandler = () => {
    if (isCombining) {
      onSelect(screen);
    } else {
      onRunScreen(screen);
    }
  };

  return (
    <article
      onClick={cardClickHandler}
      className={`relative h-full bg-brand-container border border-brand-border rounded-xl p-4 flex flex-col justify-between transition-all duration-200 group
        ${
          isCombining
            ? "cursor-pointer"
            : "hover:-translate-y-1 hover:shadow-lg hover:shadow-black/20 hover:border-brand-primary/50"
        }
        ${
          isSelected && isCombining
            ? "border-brand-primary ring-2 ring-brand-primary"
            : ""
        }
      `}
    >
      {isCombining && (
        <div
          className={`absolute inset-0 bg-brand-primary/10 rounded-xl transition-opacity ${
            isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          }`}
        >
          {isSelected && (
            <CheckCircleIcon className="absolute top-3 right-3 w-6 h-6 text-brand-primary" />
          )}
        </div>
      )}
      <div>
        <h4 className="font-semibold text-brand-text-primary">
          {screen.title}
        </h4>
        <p className="text-sm text-brand-text-secondary mt-1">
          {formatDescription(screen.description)}
        </p>
      </div>
      <div className="flex items-center gap-2 mt-4">
        <button
          onClick={(e) => {
            if (isCombining) e.stopPropagation();
            else onRunScreen(screen);
          }}
          className={`px-4 py-2 text-sm font-medium rounded-lg w-full transition-all duration-200
    ${
      isCombining
        ? isSelected
          ? "bg-cyan-500 text-white shadow-md hover:bg-cyan-600"
          : "bg-cyan-100 text-cyan-700 hover:bg-cyan-200"
        : "bg-cyan-500 text-white shadow-md hover:bg-cyan-600 active:scale-[0.98]"
    }
  `}
        >
          {isCombining ? (isSelected ? "Selected" : "Select") : "Run Screen"}
        </button>
      </div>
    </article>
  );
};

export default ScreenCard;
