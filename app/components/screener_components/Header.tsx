import React from "react";
import { IrisIcon, SearchIcon, PlusIcon } from "./Icons";

interface HeaderProps {
  globalSearch: string;
  onGlobalSearchChange: (value: string) => void;
  isCombining: boolean;
  onToggleCombineMode: () => void;
}

const Header: React.FC<HeaderProps> = ({
  globalSearch,
  onGlobalSearchChange,
  isCombining,
  onToggleCombineMode,
}) => {
  return (
    <header className="sticky top-0 z-30 w-full bg-brand-bg/70 backdrop-blur-xl border-b border-brand-border">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              {/* <div className="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center">
                <IrisIcon className="w-5 h-5 text-black" />
              </div> */}
            </div>
            <div>
              <h1 className="text-lg font-bold text-brand-text-primary tracking-tight">
                IRIS Screener
              </h1>
              <p className="text-xs text-brand-text-secondary">
                Advanced screening for smarter investments
              </p>
            </div>
          </div>

          <div className="flex-1 max-w-xl mx-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className="h-5 w-5 text-brand-text-tertiary" />
              </div>
              <input
                type="text"
                placeholder="Search sectors, themes, indicators or symbols..."
                value={globalSearch}
                onChange={(e) => onGlobalSearchChange(e.target.value)}
                className="block w-full bg-brand-container border border-brand-border rounded-lg py-2 pl-10 pr-3 text-sm placeholder-brand-text-tertiary focus:outline-none focus:ring-1 focus:ring-brand-primary focus:border-brand-primary"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onToggleCombineMode}
              className={`inline-flex items-center gap-2 px-4 py-2 border text-sm font-medium rounded-lg transition-colors ${
                isCombining
                  ? "border-red-500/50 text-red-400 bg-red-500/10 hover:bg-red-500/20"
                  : "border-brand-border text-brand-text-secondary bg-brand-container hover:border-brand-text-secondary"
              }`}
            >
              {isCombining ? "Cancel Combination" : "Combine Screens"}
            </button>
            <button className="inline-flex items-center gap-2 px-4 py-2 border border-brand-primary text-sm font-medium rounded-lg text-brand-primary bg-brand-primary/10 hover:bg-brand-primary/20 transition-colors">
              <PlusIcon className="h-5 w-5" />
              <span>Create New Screen</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
