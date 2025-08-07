"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useStockData } from "./hooks/useStockData"; // <-- IMPORT THE HOOK

import StockPageHeader from "./StockPageHeader";
import StickySubNav from "./StickySubNav";
import KeyMetricsGrid from "./KeyMetricsGrid";
import EnhancedPriceChart from "./EnhancedPriceChart";
import PeerComparisonSection from "./PeerComparisonSection";
import QuarterlyResultsSection from "./QuarterlyResultsSection";
import ProfitAndLossSection from "./ProfitAndLossSection";
import BalanceSheetSection from "./BalanceSheetSection";
import CashFlowSection from "./CashFlowSection";
import FinancialRatiosSection from "./FinancialRatiosSection";
import ShareholdingPatternSection from "./ShareholdingPatternSection";

const API_BASE_URL = "http://127.0.0.1:8000/api";

interface StockDetailProps {
  initialStockData: any;
}

export default function StockDetail({ initialStockData }: StockDetailProps) {
  const router = useRouter();

  // --- USE THE HOOK TO PROCESS ALL DATA ---
  const processedData = useStockData(initialStockData);

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

  // A more robust loading/error check
  if (!processedData) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-element-border border-t-accent"></div>
      </div>
    );
  }

  // Destructure for cleaner access
  const { headerData, keyMetrics, charts, tables, growthMetrics, name, id } =
    processedData;

  return (
    <div className="relative h-full overflow-y-auto custom-scrollbar">
      <button
        onClick={() => router.back()}
        className="absolute top-4 left-4 z-50 flex items-center justify-center h-10 w-10 rounded-full bg-content-bg/50 backdrop-blur-md border border-element-border text-text-secondary hover:text-text-primary transition-colors"
        title="Back to Screener"
      >
        <ArrowLeft className="h-5 w-5" />
      </button>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* --- PASS PROCESSED DATA TO CHILDREN --- */}
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
}
