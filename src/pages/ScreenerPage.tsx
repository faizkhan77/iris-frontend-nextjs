import { useState } from "react";
import ScreenerHeader from "@/components/screener/ScreenerHeader";
import ScreenerSidebar from "@/components/screener/ScreenerSidebar";
import ScreenerDashboard from "@/components/screener/ScreenerDashboard";
import type { Screen, ScreenCategory } from "@/types";
import { SCREEN_CATEGORIES } from "@/lib/constants";

const ScreenerPage = () => {
  // Sidebar state
  const [selectedSectors, setSelectedSectors] = useState<string[]>([]);
  const [sectorSearch, setSectorSearch] = useState("");

  // MainContent state
  const [timeframe, setTimeframe] = useState("1M");
  const [selectedCap, setSelectedCap] = useState("All");
  const [selectedForCombination, setSelectedForCombination] = useState<Screen[]>([]);
  const [userScreenCategory, setUserScreenCategory] = useState<ScreenCategory | null>(null);
  const [isCombining, setIsCombining] = useState(false);
  const [globalSearch, setGlobalSearch] = useState("");

  const handleRunScreen = (screen: Screen) => {
    console.log("Running screen:", screen.title);
  };

  const handleSeeAll = (category: ScreenCategory) => {
    console.log("See all screens in:", category.title);
  };

  const handleSelectForCombination = (screen: Screen) => {
    setSelectedForCombination((prev) =>
      prev.includes(screen)
        ? prev.filter((s) => s !== screen)
        : [...prev, screen]
    );
  };

  const handleResetFilters = () => {
    setTimeframe("1M");
    setSelectedCap("All");
    setSelectedSectors([]);
    setGlobalSearch("");
  };

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <ScreenerHeader />

      <div className="flex flex-1 overflow-hidden">
        <ScreenerSidebar
          selectedSectors={selectedSectors}
          onSelectSector={(sector) => setSelectedSectors([sector])}
          sectorSearch={sectorSearch}
          onSectorSearchChange={setSectorSearch}
          onRunScreen={handleRunScreen}
        />

        <div className="flex-1 p-6 overflow-y-auto scrollbar-cyan">
          <ScreenerDashboard
            timeframe={timeframe}
            onTimeframeChange={setTimeframe}
            selectedCap={selectedCap}
            onSelectCap={setSelectedCap}
            onRunScreen={handleRunScreen}
            onResetFilters={handleResetFilters}
            onSeeAll={handleSeeAll}
            globalSearch={globalSearch}
            isCombining={isCombining}
            selectedForCombination={selectedForCombination}
            onSelectForCombination={handleSelectForCombination}
            userScreenCategory={userScreenCategory}
          />
        </div>
      </div>
    </div>
  );
};

export default ScreenerPage;
