"use client";

import { useMemo } from 'react';

// Define a type for the raw stock data object for better type safety
// This should be expanded to match your actual API response structure
type RawStockData = any; 


export const useStockData = (stockData: any) => {
    return useMemo(() => {
      if (!stockData) {
        return null;
      }
  
      // This is where we map the raw API response to a clean, nested structure.
      return {
        id: stockData.id,
        name: stockData.name,
        headerData: {
          name: stockData.name,
          symbol: stockData.symbol,
          sector: stockData.sector,
          industry: stockData.industry,
          currentPrice: stockData.currentPrice,
          priceChange: stockData.priceChange,
          aboutInfo: stockData.aboutInfo,
        },
        keyMetrics: {
          marketCapFormatted: stockData.marketCapFormatted,
          stockPE: stockData.stockPE,
          currentPrice: stockData.currentPrice,
          bookValueFormatted: stockData.bookValueFormatted,
          yearHighLow: stockData.yearHighLow,
          
          // --- THIS IS THE CRITICAL FIX ---
          // Map the new API fields (dividendYield, roce, roe)
          // to the props that KeyMetricsGrid expects.
          dividendYield: stockData.dividendYield,
          roce: stockData.roce,
          roe: stockData.roe,
          // --- END OF THE CRITICAL FIX ---
  
          rsiValue: stockData.rsiValue,
          faceValue: stockData.faceValue,
        },
        charts: {
          peerCmp: stockData.peerCmpChart,
          peerPe: stockData.peerPeChart,
          quarterlyFinancials: stockData.quarterlyFinancialsChartData,
          quarterlyEPS: stockData.quarterlyEPSChartData,
          annualFinancials: stockData.annualFinancialsChartData,
          balanceSheetLiabilities: stockData.balanceSheetLiabilitiesChartData,
          balanceSheetAssets: stockData.balanceSheetAssetsChartData,
          cashFlows: stockData.cashFlowsChartData,
          efficiencyDays: stockData.efficiencyDaysChartData,
          roceTrend: stockData.roceTrendChartData,
          shareholdingPie: stockData.shareholdingPieData,
          shareholdingTrend: stockData.shareholdingTrendData,
        },
        tables: {
          peerComparison: stockData.peerComparison,
          quarterlyResults: stockData.quarterlyResults,
          profitAndLoss: stockData.profitAndLoss,
          balanceSheet: stockData.balanceSheet,
          cashFlows: stockData.cashFlows,
          financialRatios: stockData.ratiosTableData,
          shareholdingHistory: stockData.shareholdingHistory,
        },
        growthMetrics: {
          compoundedSalesGrowth: stockData.compoundedSalesGrowth,
          compoundedProfitGrowth: stockData.compoundedProfitGrowth,
          stockPriceCagr: stockData.stockPriceCagr,
          returnOnEquityTrend: stockData.returnOnEquityTrend,
        },
      };
    }, [stockData]);
  };
