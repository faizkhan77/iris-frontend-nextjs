import React from "react";
import {
  SECTOR_MAPPINGS,
  RECENTLY_USED_SCREENS,
  MOST_USED_SCREENS,
  ALL_SCREENS,
} from "@/app/lib/constants";
import ToggleSwitch from "./ToggleSwitch";
import { MenuAlt2Icon } from "./Icons";
import { Screen } from "@/app/lib/types";

interface SidebarProps {
  // --- MODIFICATION: The selectedSectors prop now holds the `displayName` of the mapping ---
  selectedSectors: string[]; // e.g., ['All Sectors'], ['Finance & Banking']
  onSelectSector: (sectorDisplayName: string) => void; // Pass the displayName on click
  sectorSearch: string;
  onSectorSearchChange: (value: string) => void;
  onRunScreen: (screen: Screen) => void;
  // nseOnly and setNseOnly are not used, so they are removed for clarity
}

const Sidebar: React.FC<SidebarProps> = ({
  selectedSectors,
  onSelectSector,
  sectorSearch,
  onSectorSearchChange,
  onRunScreen,
}) => {
  const filteredSectors = SECTOR_MAPPINGS.filter((mapping) =>
    mapping.displayName.toLowerCase().includes(sectorSearch.toLowerCase())
  );

  const handleRunScreenByName = (screenName: string) => {
    const screenToRun = ALL_SCREENS.find((s) => s.title === screenName);
    if (screenToRun) {
      onRunScreen(screenToRun);
    } else {
      console.warn(`Screen "${screenName}" not found.`);
    }
  };
  return (
    <aside className="w-72 h-full bg-sidebar-bg border-r border-element-border flex flex-col">
      {/* Header for the Sidebar */}
      <div className="p-4 border-b border-element-border">
        <h2 className="text-lg font-semibold text-text-primary relative pb-1">
          Screener Filters
          <span className="absolute left-0 bottom-0 w-10 h-0.5 bg-cyan-500 rounded-full"></span>
        </h2>
        <p className="text-sm text-text-secondary">
          Refine your search criteria
        </p>
      </div>

      {/* Main scrolling content area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Filter by Sector Section */}
        <div className="bg-brand-container border border-brand-border rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-brand-text-primary">
              Filter by Sector
            </h2>
            <span className="text-xs font-medium text-white bg-cyan-500 px-2 py-1 rounded-full shadow-sm">
              Quick Filter
            </span>
          </div>

          <div className="relative mb-4">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MenuAlt2Icon className="h-5 w-5 text-brand-text-tertiary" />
            </div>
            <input
              type="text"
              placeholder="Search sector..."
              value={sectorSearch}
              onChange={(e) => onSectorSearchChange(e.target.value)}
              className="block w-full bg-brand-bg border border-brand-border rounded-lg py-2 pl-10 pr-3 text-sm placeholder-brand-text-tertiary 
              focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
            />
          </div>

          <nav className="flex flex-col space-y-1">
            {filteredSectors.map((sectorMapping) => {
              const isSelected = selectedSectors.includes(
                sectorMapping.displayName
              );
              return (
                <button
                  key={sectorMapping.displayName}
                  onClick={() => onSelectSector(sectorMapping.displayName)}
                  className={`w-full text-left px-3 py-1.5 rounded-md text-sm transition-all flex items-center gap-3 ${
                    isSelected
                      ? "bg-cyan-500 border border-cyan-400 text-white font-medium"
                      : "text-brand-text-secondary hover:bg-brand-bg-hover"
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      isSelected ? "bg-white" : "bg-brand-text-tertiary"
                    }`}
                  ></span>
                  {sectorMapping.displayName}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Recently Used Section */}
        <div className="bg-brand-container border border-brand-border rounded-xl p-4">
          <h4 className="font-semibold text-brand-text-primary mb-3">
            Recently Used
          </h4>
          <div className="flex flex-wrap gap-2">
            {RECENTLY_USED_SCREENS.map((name) => (
              <button
                key={name}
                onClick={() => handleRunScreenByName(name)}
                className="px-3 py-1 text-xs font-medium rounded-md bg-cyan-500 text-white hover:bg-cyan-600 shadow-sm transition-all"
              >
                {name}
              </button>
            ))}
          </div>
        </div>

        {/* Most Used Section */}
        <div className="bg-brand-container border border-brand-border rounded-xl p-4">
          <h4 className="font-semibold text-brand-text-primary mb-3">
            Most Used
          </h4>
          <div className="flex flex-wrap gap-2">
            {MOST_USED_SCREENS.map((name) => (
              <button
                key={name}
                onClick={() => handleRunScreenByName(name)}
                className="px-3 py-1 text-xs font-medium rounded-md bg-cyan-500 text-white hover:bg-cyan-600 shadow-sm transition-all"
              >
                {name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
