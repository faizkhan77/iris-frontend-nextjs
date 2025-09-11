import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom"; // Import useParams
import { ArrowLeft } from "lucide-react";
import { useStockData } from "../hooks/useStockData";

import StockPageHeader from "../analysis_components/StockPageHeader";
import StickySubNav from "../analysis_components/StickySubNav";
import KeyMetricsGrid from "../analysis_components/KeyMetricsGrid";
import EnhancedPriceChart from "../analysis_components/EnhancedPriceChart";
import PeerComparisonSection from "../analysis_components/PeerComparisonSection";
import QuarterlyResultsSection from "../analysis_components/QuarterlyResultsSection";
import ProfitAndLossSection from "../analysis_components/ProfitAndLossSection";
import BalanceSheetSection from "../analysis_components/BalanceSheetSection";
import CashFlowSection from "../analysis_components/CashFlowSection";
import FinancialRatiosSection from "../analysis_components/FinancialRatiosSection";
import ShareholdingPatternSection from "../analysis_components/ShareholdingPatternSection";
import StockDetailsSkeleton from "@/components/StockDetailsSkeleton";

const API_BASE_URL = `${
  import.meta.env.VITE_API_URL || "http://192.168.0.235:8000"
}/api/company`;

// The component no longer needs to accept initialStockData as a prop.
const StockDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id: stockId } = useParams<{ id: string }>(); // Get the stock ID from the URL.

  const [stockData, setStockData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch stock details when the component mounts or the ID changes.
    const fetchStockDetails = async () => {
      if (!stockId) {
        setIsLoading(false);
        setError("No stock ID provided.");
        return;
      }
      setIsLoading(true);
      setError(null);
      try {
        // Use the endpoint you specified.
        const response = await fetch(`${API_BASE_URL}/stock/${stockId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setStockData(data);
      } catch (e: any) {
        setError(e.message);
        setStockData(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStockDetails();
  }, [stockId]); // Re-run the effect if the stockId in the URL changes.

  // The useStockData hook now uses the fetched data from state.
  const processedData = useStockData(stockData);

  const sections = [
    { id: "key-metrics-section", label: "Key Metrics" },
    { id: "price-chart-section", label: "Price Chart" },
    { id: "peer-comparison-section", label: "Peers" },
    { id: "quarterly-results-section", label: "Quarterly" },
    { id: "profit-loss-section", label: "Profit & Loss" },
    { id: "balance-sheet-section", label: "Balance Sheet" },
    { id: "cash-flow-section", label: "Cash Flow" },
    { id: "ratios-section", label: "Ratios" },
    { id: "shareholding-section", label: "Shareholding" },
  ];

  const handleSubNavClick = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const yOffset = -80;
      const y =
        element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  // --- RENDER STATES ---
  if (isLoading) {
    return (
      <StockDetailsSkeleton/>
    );
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center p-4 text-center text-red-500">
        <div>
          <h2 className="text-xl font-semibold">Failed to load stock data</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }
  
  if (!processedData) {
    return (
      <div className="flex h-full items-center justify-center text-text-secondary">
        No data available for this stock.
      </div>
    );
  }


  const { headerData, keyMetrics, charts, tables, growthMetrics, name, id } =
    processedData;

  return (
    <div className="relative h-full overflow-y-auto custom-scrollbar">
      <button
        onClick={() => navigate(-1)}
        className="absolute top-4 left-4 z-50 flex items-center justify-center h-10 w-10 rounded-full bg-content-bg/50 backdrop-blur-md border border-element-border text-text-secondary hover:text-text-primary transition-colors"
        title="Back to Screener"
      >
        <ArrowLeft className="h-5 w-5" />
      </button>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <StockPageHeader stockData={headerData} />
        <StickySubNav
          stockName={name}
          sections={sections}
          onNavClick={handleSubNavClick}
        />

        <div className="mt-8 space-y-8">
          <section id="key-metrics-section">
            <KeyMetricsGrid stockData={keyMetrics} />
          </section>
          <section id="price-chart-section">
            <EnhancedPriceChart
              stockId={id}
              stockName={name}
              API_BASE_URL={API_BASE_URL}
            />
          </section>
          <section id="peer-comparison-section">
            <PeerComparisonSection
              peerComparisonData={tables.peerComparison}
              peerCmpChartData={charts.peerCmp}
              peerPeChartData={charts.peerPe}
              stockName={name}
            />
          </section>
          <section id="quarterly-results-section">
            <QuarterlyResultsSection
              quarterlyTableData={tables.quarterlyResults}
              financialsChartData={charts.quarterlyFinancials}
              epsChartData={charts.quarterlyEPS}
              stockName={name}
            />
          </section>
          <section id="profit-loss-section">
            <ProfitAndLossSection
              profitAndLossTableData={tables.profitAndLoss}
              annualFinancialsChartData={charts.annualFinancials}
              growthData={growthMetrics}
              stockName={name}
            />
          </section>
          <section id="balance-sheet-section">
            <BalanceSheetSection
              balanceSheetData={tables.balanceSheet}
              liabilitiesChartData={charts.balanceSheetLiabilities}
              assetsChartData={charts.balanceSheetAssets}
              stockName={name}
            />
          </section>
          <section id="cash-flow-section">
            <CashFlowSection
              cashFlowTableData={tables.cashFlows}
              cashFlowsChartData={charts.cashFlows}
              stockName={name}
            />
          </section>
          <section id="ratios-section">
            <FinancialRatiosSection
              ratiosTableData={tables.financialRatios}
              efficiencyDaysChartData={charts.efficiencyDays}
              roceTrendChartData={charts.roceTrend}
              stockName={name}
            />
          </section>
          <section id="shareholding-section">
            <ShareholdingPatternSection
              shareholdingHistory={tables.shareholdingHistory}
              shareholdingPieData={charts.shareholdingPie}
              shareholdingTrendData={charts.shareholdingTrend}
              stockName={name}
            />
          </section>
        </div>
      </div>
    </div>
  );
};

export default StockDetail;