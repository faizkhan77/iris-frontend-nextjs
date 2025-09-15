
interface CashFlowKeyMetric {
  label: string;
  value: string;
  interpretation: string;
}

interface CashFlowChartDataset {
  label: string;
  data: number[];
  backgroundColor: string;
}

interface CashFlowChartData {
  labels: string[];
  datasets: CashFlowChartDataset[];
}


interface CashFlowAnalysisData {
  summary: string;
  keyTakeaways: string[];
  keyMetrics: CashFlowKeyMetric[];
  mainFlowsChart: CashFlowChartData;
  netCashFlowChart: CashFlowChartData;
}

export interface ChartDataPoint {
  name: string;
  price: number;
  dma50: number;
  dma200: number;
}

interface FundamentalDetail {
  label: string;
  value: string | number;
  tooltip: string;
}

export interface FundamentalAnalysisData {
  chartInterpretation: string;
  priceChartData: ChartDataPoint[];
  detailsTable: FundamentalDetail[];
  finalVerdict: string;
  recommendation: string;
}

// --- Dummy Data Structures (inferred) ---
type TechnicalSummaryDatas = { indicators: { name: string; value: string; signal: string }[], verdict: string };
type SentimentAnalysisData = { score: number; summary: string; recentNews: { source: string; headline: string }[] };

type TabData =
  | { label: "Fundamentals"; verdict: string; data: FundamentalAnalysisCard }
  | { label: "Technicals"; verdict: string; data: TechnicalSummaryDatas }
  | { label: "Sentiment"; verdict: string; data: SentimentAnalysisData };

export interface CrossAgentAnalysisData {
  tabs: TabData[];
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  recommendation: string;
}

export interface IndicatorGaugeProps {
  indicator: string;
  value: number;
  min: number;
  max: number;
  zones: { label: string; color: string; start: number; end: number }[];
  interpretation: string;
  currentZoneLabel: string;
}
export interface HistoricalPerformanceProps {
  data: {
    score?: number;
    cagr?: number;
    volatility?: number;
    sharpe_ratio?: number;
  } | null;
}
export interface TechnicalSummaryData {
  summaryText: string;
  historicalPerformance: HistoricalPerformanceProps["data"];
  detailsTable: {
    indicator: string;
    value: string | number;
    tooltip: string;
    sentiment: "positive" | "negative" | "neutral";
  }[];
  gaugeIndicators: IndicatorGaugeProps[];
  finalVerdict: {
    verdict: string;
    reasoning: string;
  };
  recommendation: string;
}


export interface ShareholderHistory {
  date: string;
  percentage: number;
  num_of_shares: number;
  subcategory?: string;
}

export interface Shareholder {
  srno: number;
  name: string;
  percentage: number;
  history: ShareholderHistory[];
}

export interface CategoryDetail {
  categoryName: string;
  totalPercentage: number;
  shareholders: Shareholder[];
}

export interface ShareholdingDetailsData {
  pieChartInterpretation: string;
  keyTakeaways: string;
  pieChartData: { name: string; value: number }[];
  categoryDetails: CategoryDetail[];
}


export const DUMMY_SHAREHOLDING_DATA: ShareholdingDetailsData = {
  pieChartInterpretation: "The shareholding pattern shows a balanced distribution between institutional and retail investors, with promoters maintaining a controlling stake of 45.8%. Foreign institutional investors hold a significant portion at 28.2%, indicating strong international confidence in the company.",
  keyTakeaways: "• **Promoter Stability**: Promoters have maintained consistent ownership around 45-46% over the past year, showing strong commitment to the business.\n\n• **FII Confidence**: Foreign institutional investors increased their stake from 25.1% to 28.2% in the last quarter, reflecting positive sentiment.\n\n• **Retail Participation**: Retail investors hold 15.3% stake, showing healthy retail participation in the stock.\n\n• **Mutual Fund Interest**: Domestic mutual funds have been accumulating shares, increasing from 8.5% to 10.7% over the past 6 months.",
  pieChartData: [
    { name: "Promoters", value: 45.8 },
    { name: "Foreign Institutional Investors", value: 28.2 },
    { name: "Retail Investors", value: 15.3 },
    { name: "Mutual Funds", value: 10.7 }
  ],
  categoryDetails: [
    {
      categoryName: "Promoters",
      totalPercentage: 45.8,
      shareholders: [
        {
          srno: 1,
          name: "ABC Holdings Private Limited",
          percentage: 32.4,
          history: [
            {
              date: "2024-09-01",
              percentage: 32.4,
              num_of_shares: 15420000,
              subcategory: "Promoter Company"
            },
            {
              date: "2024-06-01",
              percentage: 32.1,
              num_of_shares: 15277500,
              subcategory: "Promoter Company"
            },
            {
              date: "2024-03-01",
              percentage: 31.8,
              num_of_shares: 15135000,
              subcategory: "Promoter Company"
            },
            {
              date: "2023-12-01",
              percentage: 31.5,
              num_of_shares: 14992500,
              subcategory: "Promoter Company"
            }
          ]
        },
        {
          srno: 2,
          name: "Mr. Rajesh Kumar",
          percentage: 8.7,
          history: [
            {
              date: "2024-09-01",
              percentage: 8.7,
              num_of_shares: 4140000,
              subcategory: "Individual Promoter"
            },
            {
              date: "2024-06-01",
              percentage: 8.9,
              num_of_shares: 4235000,
              subcategory: "Individual Promoter"
            },
            {
              date: "2024-03-01",
              percentage: 9.1,
              num_of_shares: 4330000,
              subcategory: "Individual Promoter"
            },
            {
              date: "2023-12-01",
              percentage: 9.2,
              num_of_shares: 4378000,
              subcategory: "Individual Promoter"
            }
          ]
        },
        {
          srno: 3,
          name: "Mrs. Priya Kumar",
          percentage: 4.7,
          history: [
            {
              date: "2024-09-01",
              percentage: 4.7,
              num_of_shares: 2235000,
              subcategory: "Individual Promoter"
            },
            {
              date: "2024-06-01",
              percentage: 4.6,
              num_of_shares: 2188000,
              subcategory: "Individual Promoter"
            },
            {
              date: "2024-03-01",
              percentage: 4.5,
              num_of_shares: 2142500,
              subcategory: "Individual Promoter"
            },
            {
              date: "2023-12-01",
              percentage: 4.4,
              num_of_shares: 2096000,
              subcategory: "Individual Promoter"
            }
          ]
        }
      ]
    },
    {
      categoryName: "Foreign Institutional Investors",
      totalPercentage: 28.2,
      shareholders: [
        {
          srno: 1,
          name: "Vanguard Emerging Markets Fund",
          percentage: 12.3,
          history: [
            {
              date: "2024-09-01",
              percentage: 12.3,
              num_of_shares: 5850000,
              subcategory: "Foreign Fund"
            },
            {
              date: "2024-06-01",
              percentage: 11.8,
              num_of_shares: 5612500,
              subcategory: "Foreign Fund"
            },
            {
              date: "2024-03-01",
              percentage: 11.2,
              num_of_shares: 5328000,
              subcategory: "Foreign Fund"
            },
            {
              date: "2023-12-01",
              percentage: 10.5,
              num_of_shares: 4995000,
              subcategory: "Foreign Fund"
            }
          ]
        },
        {
          srno: 2,
          name: "BlackRock Global Funds",
          percentage: 9.4,
          history: [
            {
              date: "2024-09-01",
              percentage: 9.4,
              num_of_shares: 4470000,
              subcategory: "Foreign Fund"
            },
            {
              date: "2024-06-01",
              percentage: 8.9,
              num_of_shares: 4232500,
              subcategory: "Foreign Fund"
            },
            {
              date: "2024-03-01",
              percentage: 8.7,
              num_of_shares: 4137500,
              subcategory: "Foreign Fund"
            },
            {
              date: "2023-12-01",
              percentage: 8.3,
              num_of_shares: 3948000,
              subcategory: "Foreign Fund"
            }
          ]
        },
        {
          srno: 3,
          name: "Goldman Sachs Asset Management",
          percentage: 6.5,
          history: [
            {
              date: "2024-09-01",
              percentage: 6.5,
              num_of_shares: 3092500,
              subcategory: "Foreign Investment Bank"
            },
            {
              date: "2024-06-01",
              percentage: 6.1,
              num_of_shares: 2902500,
              subcategory: "Foreign Investment Bank"
            },
            {
              date: "2024-03-01",
              percentage: 5.8,
              num_of_shares: 2760000,
              subcategory: "Foreign Investment Bank"
            },
            {
              date: "2023-12-01",
              percentage: 5.6,
              num_of_shares: 2664000,
              subcategory: "Foreign Investment Bank"
            }
          ]
        }
      ]
    },
    {
      categoryName: "Mutual Funds",
      totalPercentage: 10.7,
      shareholders: [
        {
          srno: 1,
          name: "HDFC Large Cap Fund",
          percentage: 4.2,
          history: [
            {
              date: "2024-09-01",
              percentage: 4.2,
              num_of_shares: 1998000,
              subcategory: "Equity Fund"
            },
            {
              date: "2024-06-01",
              percentage: 3.8,
              num_of_shares: 1809000,
              subcategory: "Equity Fund"
            },
            {
              date: "2024-03-01",
              percentage: 3.5,
              num_of_shares: 1665000,
              subcategory: "Equity Fund"
            },
            {
              date: "2023-12-01",
              percentage: 3.2,
              num_of_shares: 1522000,
              subcategory: "Equity Fund"
            }
          ]
        },
        {
          srno: 2,
          name: "SBI Bluechip Fund",
          percentage: 3.8,
          history: [
            {
              date: "2024-09-01",
              percentage: 3.8,
              num_of_shares: 1809000,
              subcategory: "Equity Fund"
            },
            {
              date: "2024-06-01",
              percentage: 3.4,
              num_of_shares: 1617000,
              subcategory: "Equity Fund"
            },
            {
              date: "2024-03-01",
              percentage: 3.1,
              num_of_shares: 1474500,
              subcategory: "Equity Fund"
            },
            {
              date: "2023-12-01",
              percentage: 2.9,
              num_of_shares: 1379500,
              subcategory: "Equity Fund"
            }
          ]
        },
        {
          srno: 3,
          name: "ICICI Prudential Value Discovery Fund",
          percentage: 2.7,
          history: [
            {
              date: "2024-09-01",
              percentage: 2.7,
              num_of_shares: 1284500,
              subcategory: "Equity Fund"
            },
            {
              date: "2024-06-01",
              percentage: 2.5,
              num_of_shares: 1189000,
              subcategory: "Equity Fund"
            },
            {
              date: "2024-03-01",
              percentage: 2.2,
              num_of_shares: 1046500,
              subcategory: "Equity Fund"
            },
            {
              date: "2023-12-01",
              percentage: 1.9,
              num_of_shares: 904000,
              subcategory: "Equity Fund"
            }
          ]
        }
      ]
    },
    {
      categoryName: "Retail Investors",
      totalPercentage: 15.3,
      shareholders: [
        {
          srno: 1,
          name: "Individual Shareholders (Aggregate)",
          percentage: 15.3,
          history: [
            {
              date: "2024-09-01",
              percentage: 15.3,
              num_of_shares: 7279500,
              subcategory: "Retail Individual"
            },
            {
              date: "2024-06-01",
              percentage: 15.1,
              num_of_shares: 7184500,
              subcategory: "Retail Individual"
            },
            {
              date: "2024-03-01",
              percentage: 14.8,
              num_of_shares: 7042000,
              subcategory: "Retail Individual"
            },
            {
              date: "2023-12-01",
              percentage: 14.6,
              num_of_shares: 6947000,
              subcategory: "Retail Individual"
            }
          ]
        }
      ]
    }
  ]
};
export const dummyTechnicalData: TechnicalSummaryData = {
  summaryText:
    "The stock is currently in a consolidation phase after a strong uptrend. Key indicators suggest a bullish bias, but traders should be cautious of a potential short-term pullback. Momentum is strong, but nearing overbought levels which could precede a correction.",
  historicalPerformance: {
    score: 78.5,
    cagr: 45.21,
    volatility: 22.8,
    sharpe_ratio: 1.98,
  },
  detailsTable: [
    {
      indicator: "SMA 50",
      value: "145.20",
      tooltip: "50-day Simple Moving Average. A key trend indicator.",
      sentiment: "positive",
    },
    {
      indicator: "SMA 200",
      value: "121.80",
      tooltip: "200-day Simple Moving Average. A key long-term trend indicator.",
      sentiment: "positive",
    },
    {
      indicator: "RSI (14)",
      value: 68.4,
      tooltip: "Relative Strength Index. Measures speed and change of price movements.",
      sentiment: "neutral",
    },
    {
      indicator: "MACD",
      value: "Bullish Cross",
      tooltip: "Moving Average Convergence Divergence. Shows relationship between two moving averages.",
      sentiment: "positive",
    },
    {
      indicator: "Volume",
      value: "1.2x Avg",
      tooltip: "Trading volume compared to its average.",
      sentiment: "positive",
    },
    {
      indicator: "Bollinger Bands",
      value: "Upper Band",
      tooltip: "Price is trading near the upper band, suggesting strength.",
      sentiment: "neutral",
    },
  ],
  gaugeIndicators: [
    {
      indicator: "RSI",
      value: 68,
      min: 0,
      max: 100,
      zones: [
        { label: "Oversold", color: "bg-red-400", start: 0, end: 30 },
        { label: "Neutral", color: "bg-yellow-400", start: 30, end: 70 },
        { label: "Overbought", color: "bg-green-400", start: 70, end: 100 },
      ],
      currentZoneLabel: "Neutral",
      interpretation: "The RSI is approaching the overbought territory, suggesting strong momentum but also a higher risk of a reversal.",
    },
    {
      indicator: "Stochastic",
      value: 85,
      min: 0,
      max: 100,
      zones: [
        { label: "Oversold", color: "bg-red-400", start: 0, end: 20 },
        { label: "Neutral", color: "bg-yellow-400", start: 20, end: 80 },
        { label: "Overbought", color: "bg-green-400", start: 80, end: 100 },
      ],
      currentZoneLabel: "Overbought",
      interpretation: "The Stochastic Oscillator is in the overbought zone, which can be a signal that the current uptrend might be losing steam.",
    },
  ],
  finalVerdict: {
    verdict: "Buy",
    reasoning: "The overall technical picture remains positive with a strong underlying trend. While some indicators are flashing caution, the momentum is likely to carry the price higher in the medium term.",
  },
  recommendation: `
- **For New Positions:** Consider initiating a long position on dips towards the 50-day SMA. Use a stop-loss below the recent swing low.
- **For Existing Positions:** Hold current positions and consider trailing your stop-loss to lock in profits.
- **Risk Management:** Be mindful of the overbought signals from the Stochastic Oscillator. A period of consolidation or a minor pullback would be healthy before the next leg up.
  `,
};




export const sampleDataofBalanceSheetAnalysisCard = {
  summary: "The company demonstrates strong financial stability with consistent growth in total assets over the past 5 years, rising from ₹2.5L Cr to ₹3.8L Cr. The debt-to-equity ratio has been well-managed, declining from 0.65 to 0.52, indicating improved capital structure and reduced financial risk. Asset quality remains robust with a healthy balance between current and non-current assets.",
  keyTakeaways: [
    "Total assets grew by 52% over 5 years, showing consistent business expansion",
    "Debt-to-equity ratio improved from 0.65 to 0.52, indicating better leverage management",
    "Current ratio maintained above 1.2, ensuring good short-term liquidity",
    "Return on assets stabilized around 8.5%, demonstrating efficient asset utilization",
    "Equity base strengthened by 45% through retained earnings and capital additions"
  ],
  keyMetrics: [
    {
      label: "Total Assets",
      value: "₹3.8L Cr",
      trend: "up",
      interpretation: "Strong 52% growth over 5 years indicating business expansion"
    },
    {
      label: "Debt-to-Equity",
      value: "0.52",
      trend: "down",
      interpretation: "Improved from 0.65, showing better capital structure"
    },
    {
      label: "Current Ratio",
      value: "1.35",
      trend: "up",
      interpretation: "Healthy liquidity position, above industry average"
    },
    {
      label: "ROA",
      value: "8.5%",
      trend: "neutral",
      interpretation: "Stable return on assets, efficient utilization"
    }
  ],
  assetsLiabilitiesChart: {
    labels: ["2020", "2021", "2022", "2023", "2024"],
    datasets: [
      {
        label: "Total Assets",
        data: [250000, 285000, 320000, 350000, 380000],
        borderColor: "rgba(74, 222, 128, 0.8)"
      },
      {
        label: "Total Liabilities", 
        data: [162500, 180000, 195000, 210000, 220000],
        borderColor: "rgba(251, 146, 60, 0.8)"
      }
    ]
  },
  debtToEquityChart: {
    labels: ["2020", "2021", "2022", "2023", "2024"],
    datasets: [
      {
        label: "Debt to Equity Ratio",
        data: [0.65, 0.63, 0.61, 0.56, 0.52],
        borderColor: "rgba(239, 68, 68, 0.8)"
      }
    ]
  }
};

export const staticCashFlowData: CashFlowAnalysisData = {
  summary: "The company demonstrates strong operational cash generation with consistent positive cash flows from operations over the 5-year period. However, significant capital investments in recent years have impacted net cash flow, indicating an expansion phase. The financing activities show strategic debt management and equity raising to support growth initiatives.",
  keyTakeaways: [
    "Strong operational cash flow indicates healthy core business performance",
    "Heavy capital investments suggest company is in growth/expansion phase",
    "Financing activities balanced between debt management and equity raising",
    "Net cash flow volatility primarily driven by investment timing",
    "Overall cash position remains stable despite investment cycles"
  ],
  keyMetrics: [
    {
      label: "Avg CFO",
      value: "₹12,450 Cr",
      interpretation: "Strong operational cash generation"
    },
    {
      label: "Avg CFI",
      value: "-₹8,920 Cr",
      interpretation: "Heavy capital investments"
    },
    {
      label: "Avg CFF",
      value: "-₹2,850 Cr",
      interpretation: "Net debt repayment focus"
    },
    {
      label: "Net CF Growth",
      value: "+15.2%",
      interpretation: "Improving cash generation"
    }
  ],
  mainFlowsChart: {
    labels: ["2020", "2021", "2022", "2023", "2024"],
    datasets: [
      {
        label: "Operations (CFO)",
        data: [11250, 12800, 13200, 12450, 12550],
        backgroundColor: "hsl(220 70% 50%)"
      },
      {
        label: "Investing (CFI)",
        data: [-7500, -9200, -10500, -8900, -8500],
        backgroundColor: "hsl(340 75% 55%)"
      },
      {
        label: "Financing (CFF)",
        data: [-2800, -3100, -2400, -3200, -2750],
        backgroundColor: "hsl(30 80% 55%)"
      }
    ]
  },
  netCashFlowChart: {
    labels: ["2020", "2021", "2022", "2023", "2024"],
    datasets: [
      {
        label: "Net Cash Flow",
        data: [950, 500, 300, 350, 1300],
        backgroundColor: "hsl(160 60% 45%)"
      }
    ]
  }
};


 export const FundamentalAnalysisData: FundamentalAnalysisData = {
    chartInterpretation:
      "The stock has shown a consistent uptrend over the past year, recently breaking above its 200-day moving average, a bullish signal. Volume has increased on up-days, confirming investor interest.",
    priceChartData: [
      { name: "Jan '24", price: 150, dma50: 145, dma200: 130 },
      { name: "Mar '24", price: 165, dma50: 155, dma200: 135 },
      { name: "May '24", price: 180, dma50: 170, dma200: 145 },
      { name: "Jul '24", price: 175, dma50: 175, dma200: 155 },
      { name: "Sep '24", price: 195, dma50: 185, dma200: 165 },
    ],
    detailsTable: [
      { label: "Market Cap", value: 540_50_00_000, tooltip: "Total market value of a company's outstanding shares." },
      { label: "P/E Ratio", value: 25.5, tooltip: "Price-to-Earnings ratio. A high P/E can mean the stock is overvalued." },
      { label: "Dividend Yield", value: 1.75, tooltip: "Annual dividend per share as a percentage of the stock's price." },
      { label: "ROE", value: 18.2, tooltip: "Return on Equity. Measures profitability relative to shareholder's equity." },
      { label: "Promoter Holding", value: 55.0, tooltip: "Percentage of shares held by the company's promoters." },
      { label: "Debt to Equity", value: 0.4, tooltip: "Total debt relative to total shareholder equity." },
    ],
    finalVerdict:
      "The company exhibits strong fundamentals with healthy profitability metrics and manageable debt. Its market leadership and recent growth initiatives position it well for future expansion.",
    recommendation: `
- **For Long-term Investors:** This appears to be a solid buying opportunity. The company's fundamentals are strong.
- **For Short-term Traders:** Watch for a potential pullback to the 50-day moving average as a potential entry point.
- **Key Risks:** Keep an eye on competitor activities and regulatory changes in the sector.
    `,
  };


  export   const dummyCrossAgentData: CrossAgentAnalysisData = {
      tabs: [
        {
          label: "Fundamentals",
          verdict: "Positive",
          data: { /* The FundamentalAnalysisCard provides its own dummy data now */ } as any,
        },
        {
          label: "Technicals",
          verdict: "Mixed",
          data: {
            indicators: [
              { name: "RSI (14)", value: "62.5", signal: "Neutral" },
              { name: "MACD", value: "Bullish Crossover", signal: "Buy" },
              { name: "SMA 50 vs 200", value: "Golden Cross", signal: "Buy" },
            ],
            verdict: "Short-term momentum is bullish, but RSI is approaching overbought territory.",
          },
        },
        {
          label: "Sentiment",
          verdict: "Positive",
          data: {
            score: 0.85,
            summary: "Overall news sentiment is highly positive, focusing on new product launches and market expansion.",
            recentNews: [
              { source: "Business Today", headline: "Company XYZ Unveils New AI Platform" },
              { source: "Economic Times", headline: "Analysts Upgrade XYZ to 'Strong Buy' on Growth Outlook" },
            ],
          },
        },
      ],
      strengths: ["Strong market position", "Consistent revenue growth", "High promoter holding"],
      weaknesses: ["High dependency on a single product line", "Valuation appears stretched"],
      opportunities: ["Expansion into international markets", "New technology adoption"],
      recommendation: "**Overall Recommendation: Buy.** The company's strong fundamentals and positive market sentiment outweigh the current valuation concerns. We recommend accumulating on dips for a long-term horizon. A stop-loss could be placed below the 200-day moving average.",
    };


