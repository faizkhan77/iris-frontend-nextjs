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
      {/* Add Screen Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg 
        bg-white text-gray-800 border border-gray-300 shadow-sm 
        hover:bg-gray-100 transition-colors
        dark:bg-neutral-800 dark:text-white dark:border-neutral-700 dark:hover:bg-neutral-700"
      >
        <PlusIcon className="w-4 h-4" />
        Add Screen to Combination
      </button>

      {isOpen && (
        <div
          className="absolute top-full mt-2 w-72 border border-brand-border rounded-lg shadow-xl z-10
          bg-white text-gray-900 
          dark:bg-black dark:text-white"
        >
          {/* Search Bar */}
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
                className="block w-full border border-brand-border rounded-md py-1.5 pl-9 pr-3 text-sm 
                placeholder-brand-text-tertiary focus:outline-none focus:ring-1 focus:ring-brand-primary
                bg-white text-gray-900
                dark:bg-neutral-900 dark:text-white"
                autoFocus
              />
            </div>
          </div>

          {/* Screen List */}
          <ul className="max-h-60 overflow-y-auto p-1">
            {availableScreens.length > 0 ? (
              availableScreens.map((screen) => (
                <li key={screen.title}>
                  <button
                    onClick={() => handleSelectScreen(screen)}
                    className="w-full text-left px-3 py-2 rounded-md text-sm 
                    text-gray-700 hover:bg-gray-100 hover:text-gray-900
                    dark:text-gray-300 dark:hover:bg-white/10 dark:hover:text-white transition-colors"
                  >
                    {screen.title}
                  </button>
                </li>
              ))
            ) : (
              <li className="px-3 py-2 text-sm text-center text-gray-500 dark:text-gray-400">
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
