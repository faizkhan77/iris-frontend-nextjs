import  ScreenerHeader  from "@/components/screener/ScreenerHeader";
import ScreenerSidebar from "@/components/screener/ScreenerSidebar";
import Timeframe from "@/components/screener/ScreenerTimeFrame";
import ScreenerDashboard from "@/components/screener/ScreenerDashboard";


const ScreenerPage = () => {
  return (
 <div className="flex flex-col h-screen bg-background text-foreground">
      <ScreenerHeader />
      {/* This div handles the sidebar and main content layout */}
      <div className="flex flex-1 overflow-hidden">
        <ScreenerSidebar />
        {/* THIS IS THE KEY CHANGE: This div will grow and handle scrolling */}
        <div className="flex-1 p-6 overflow-y-auto scrollbar-cyan">
          {/* Render MainContent directly instead of the other components */}
          <ScreenerDashboard />
        </div>
      </div>
    </div>
  );
};

export default ScreenerPage;