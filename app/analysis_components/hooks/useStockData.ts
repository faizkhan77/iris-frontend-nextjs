"use client";

import { useMemo } from 'react';

// Define a type for the raw stock data object for better type safety
// This should be expanded to match your actual API response structure
type RawStockData = any; 

export function useStockData(stockData: RawStockData) {
  const processedData = useMemo(() => {
    if (!stockData) {
      return null;
    }
    
    // --- Direct Key Metrics ---
    const keyMetrics = {
        marketCapFormatted: stockData.marketCapFormatted ?? 'N/A',
        stockPE: stockData.stockPE?.toFixed(2) ?? 'N/A',
        currentPrice: stockData.currentPrice,
        bookValueFormatted: stockData.bookValueFormatted ?? 'N/A',
        yearHighLow: stockData.yearHighLow ?? 'N/A',
        dividendYieldFormatted: stockData.dividendYieldFormatted ?? 'N/A',
        roceFormatted: stockData.roceFormatted ?? 'N/A',
        roeFormatted: stockData.roeFormatted ?? 'N/A',
        rsiValue: stockData.rsiValue?.toFixed(2) ?? 'N/A',
        faceValue: stockData.faceValue,
    };

    // --- Header Info ---
    const headerData = {
        name: stockData.name,
        sector: stockData.sector,
        industry: stockData.industry,
        nseCode: stockData.nseCode,
        bseCode: stockData.bseCode,
        currentPrice: stockData.currentPrice,
        priceChange: {
            absolute: stockData.priceChange?.absolute ?? null,
            percent: stockData.priceChange?.percent ?? null,
            isPositive: stockData.priceChange?.isPositive ?? true,
        },
    };
    
    // --- Chart Data Formatting ---
    const charts = {
        priceHistory: (stockData.priceHistory || []).map((item: any) => ({
            date: item.date,
            price: item.close,
            volume: item.volume,
            dma50: item.dma50,
            dma200: item.dma200,
        })),
        peerCmp: {
            data: stockData.peerCmpChart?.data || [],
            title: stockData.peerCmpChart?.title || 'CMP Comparison',
            dataKey: stockData.peerCmpChart?.dataKey || 'cmp'
        },
        peerPe: {
            data: stockData.peerPeChart?.data || [],
            title: stockData.peerPeChart?.title || 'P/E Comparison',
            dataKey: stockData.peerPeChart?.dataKey || 'pe'
        },
        quarterlyFinancials: stockData.quarterlyFinancialsChartData || [],
        quarterlyEPS: stockData.quarterlyEPSChartData || [],
        annualFinancials: stockData.annualFinancialsChartData || [],
        balanceSheetLiabilities: stockData.balanceSheetLiabilitiesChartData || [],
        balanceSheetAssets: stockData.balanceSheetAssetsChartData || [],
        cashFlows: stockData.cashFlowsChartData || [],
        efficiencyDays: stockData.efficiencyDaysChartData || [],
        roceTrend: stockData.roceTrend || [],
        shareholdingPie: stockData.shareholdingPieData || [],
        shareholdingTrend: stockData.shareholdingTrendData || [],
    };

    // --- Table Data ---
    const tables = {
        peerComparison: stockData.peerComparison || [],
        quarterlyResults: stockData.quarterlyResults || [],
        profitAndLoss: stockData.profitAndLoss || [],
        balanceSheet: stockData.balanceSheet || [],
        cashFlows: stockData.cashFlows || [],
        financialRatios: stockData.ratiosTableData || [],
        shareholdingHistory: stockData.shareholdingHistory || [],
    };
    
    // --- Growth & Info ---
    const growthMetrics = {
        compoundedSalesGrowth: stockData.compoundedSalesGrowth,
        compoundedProfitGrowth: stockData.compoundedProfitGrowth,
        stockPriceCagr: stockData.stockPriceCagr,
        returnOnEquityTrend: stockData.returnOnEquityTrend,
    };

    return {
      keyMetrics,
      headerData,
      charts,
      tables,
      growthMetrics,
      // Pass through any other top-level data needed
      id: stockData.id,
      name: stockData.name,
    };
  }, [stockData]);

  return processedData;
}