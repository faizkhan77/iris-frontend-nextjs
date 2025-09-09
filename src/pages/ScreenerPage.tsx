import  ScreenerHeader  from "@/components/screener/ScreenerHeader";
import ScreenerSidebar from "@/components/screener/ScreenerSidebar";
import Timeframe from "@/components/screener/ScreenerTimeFrame";
import Screenmain from "@/components/screener/ScreenerDashboard";

// import ProfitGainers from "@/components/screener/ProfitGainers";
// import ScreneerCategories from "@/components/screener/ScreenerCategories";

const ScreenerPage = () => {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <ScreenerHeader />

  <section className="flex space-x-4 p-4">
       <ScreenerSidebar />
       <aside className="w-full p-4 space-y-6">
          <Timeframe />
          {/* <ScreneerCategories /> */}
          <Screenmain />
          
          {/* <ProfitGainers /> */}
        </aside>
      </section>
    </main>
  );
};

export default ScreenerPage;
