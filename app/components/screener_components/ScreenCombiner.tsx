import React, { useState, useRef, useEffect } from "react";
import { Screen } from "@/app/lib/types";
import { ALL_SCREENS } from "@/app/lib/constants";
import { PlusIcon, SearchIcon } from "./Icons";

interface ScreenCombinerProps {
  onAddScreen: (screen: Screen) => void;
  currentScreens: Screen[];
}

const ScreenCombiner: React.FC<ScreenCombinerProps> = ({
  onAddScreen,
  currentScreens,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef]);

  const currentScreenTitles = new Set(currentScreens.map((s) => s.title));

  const availableScreens = ALL_SCREENS.filter(
    (s) => !currentScreenTitles.has(s.title)
  ).filter((s) => s.title.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleSelectScreen = (screen: Screen) => {
    onAddScreen(screen);
    setSearchTerm("");
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={wrapperRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg bg-neutral-800 text-brand-text-primary hover:bg-neutral-700 transition-colors"
      >
        <PlusIcon className="w-4 h-4" />
        Add Screen to Combination
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 w-72 bg-brand-container border border-brand-border rounded-lg shadow-xl z-10">
          <div className="p-2 border-b border-brand-border">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className="h-4 w-4 text-brand-text-tertiary" />
              </div>
              <input
                type="text"
                placeholder="Search screens..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full bg-brand-bg border border-brand-border rounded-md py-1.5 pl-9 pr-3 text-sm placeholder-brand-text-tertiary focus:outline-none focus:ring-1 focus:ring-brand-primary"
                autoFocus
              />
            </div>
          </div>
          <ul className="max-h-60 overflow-y-auto p-1">
            {availableScreens.length > 0 ? (
              availableScreens.map((screen) => (
                <li key={screen.title}>
                  <button
                    onClick={() => handleSelectScreen(screen)}
                    className="w-full text-left px-3 py-2 rounded-md text-sm text-brand-text-secondary hover:bg-white/5 hover:text-brand-text-primary transition-colors"
                  >
                    {screen.title}
                  </button>
                </li>
              ))
            ) : (
              <li className="px-3 py-2 text-sm text-center text-brand-text-tertiary">
                No screens found.
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ScreenCombiner;
