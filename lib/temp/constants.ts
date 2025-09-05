import { Screen, ScreenCategory } from './types';

// --- NEW: Define a type for our mapping for type safety ---
export interface SectorMapping {
  displayName: string; // What the user sees in the UI
  dbValues: string[];   // The corresponding values from your database
}

export const USER_NAME = "John Doe";

// --- NEW: The robust sector mapping system ---
export const SECTOR_MAPPINGS: SectorMapping[] = [
  { displayName: 'All Sectors', dbValues: ['All'] }, // Special case for 'All'
  { 
    displayName: 'Finance & Banking', 
    dbValues: [
      'Bank - Private', 
      'Bank - Public', 
      'Finance - NBFC', 
      'Finance - Housing',
      'Insurance' // Assuming Insurance falls under Finance
    ] 
  },
  { 
    displayName: 'Information Technology', 
    dbValues: ['IT - Software'] 
  },
  { 
    displayName: 'Healthcare', 
    dbValues: ['Pharmaceuticals & Drugs'] 
  },
  { 
    displayName: 'Defence', 
    dbValues: ['Defence'] 
  },
  { 
    displayName: 'Consumer Cyclical', 
    dbValues: ['Consumer Cyclical', 'e-Commerce'] // Grouping e-Commerce here
  },
  { 
    displayName: 'Industrials & Engineering', 
    dbValues: ['Industrials', 'Engineering - Construction'] 
  },
  { 
    displayName: 'Energy', 
    dbValues: ['Energy'] 
  },
  { 
    displayName: 'Real Estate', 
    dbValues: ['Real Estate'] 
  },
  { 
    displayName: 'Utilities', 
    dbValues: ['Utilities'] 
  },
  { 
    displayName: 'Basic Materials', 
    dbValues: ['Basic Materials'] 
  },
  { 
    displayName: 'Communication Services', 
    dbValues: ['Communication Services'] 
  },
  { 
    displayName: 'Consumer Defensive', 
    dbValues: ['Consumer Defensive'] 
  },
];
export const SCREEN_CATEGORIES: ScreenCategory[] = [
  {
    title: 'Popular Themes',
    screens: [
      { title: 'Value Stocks (Low P/E)', description: 'Companies with a low Price-to-Earnings ratio, potentially undervalued.' },
      { title: 'High Dividend Yield', description: 'Stocks that pay out a high dividend relative to their share price.' },
      { title: 'Consistent Compounders', description: 'Strong history of consistent growth and high return on capital.' },
      { title: '52-Week High', description: 'Stocks trading near their highest price in the past year.' },
      { title: '52-Week Low', description: 'Stocks trading near their lowest price, potential rebound candidates.' },
      { title: 'Market Leaders', description: 'Top companies in each sector by market capitalization.' },
      { title: 'Turnaround Stories', description: 'Companies showing signs of recovery after a period of poor performance.' },
      { title: 'ESG Leaders', description: 'Companies with high Environmental, Social, and Governance ratings.' },
    ],
  },
  {
    title: 'Growth Screens',
    screens: [
      { title: 'High Sales Growth', description: 'QoQ revenue growth exceeding 25%.' },
      { title: 'Profitability Explosion', description: 'Recently turned profitable from a loss.' },
      { title: 'Aggressive EPS Growth', description: 'Exceptionally high YoY EPS growth.' },
      { title: 'Small-Cap Gems', description: 'Small companies with high growth potential.' },
      { title: 'Rapid Revenue Growers', description: 'Companies with over 50% revenue growth in the last 12 months.' },
      { title: 'Earnings Momentum', description: 'Stocks with accelerating earnings per share.' },
      { title: 'Cash Flow Kings', description: 'High growth in operating cash flow.' },
      { title: 'Future Leaders', description: 'Disruptive companies in emerging industries.' },
      { title: 'High Margin Growth', description: 'Companies expanding profit margins while growing revenue.' },
      { title: 'Analyst Upgrades', description: 'Stocks recently upgraded by market analysts.' },
    ],
  },
  {
    title: 'Technical Indicators',
    screens: [
      { title: 'Golden Crossover', description: '50-DMA crosses above 200-DMA, a bullish signal.' },
      { title: 'Bearish Crossover', description: '50-DMA crosses below 200-DMA, a bearish signal.' },
      { title: 'RSI Oversold', description: 'RSI below 30, indicating a potential rebound.' },
      { title: 'RSI Overbought', description: 'RSI above 70, indicating a potential pullback.' },
      { title: 'MACD Bullish Crossover', description: 'MACD line crosses above the signal line.' },
      { title: 'Volume Shockers', description: 'Unusually high trading volume compared to average.' },
      { title: 'Above 200-DMA', description: 'Stocks trading above their long-term moving average.' },
      { title: 'Bollinger Band Squeeze', description: 'Low volatility, often preceding a significant price move.' },
    ],
  },
  {
    title: 'Fundamental Strength',
    screens: [
      { title: 'Low Debt-to-Equity', description: 'Minimal debt compared to equity indicates stability.' },
      { title: 'High Return on Equity (ROE)', description: 'Businesses generating high profits from equity.' },
      { title: 'Positive Free Cash Flow', description: 'Companies generating more cash than they spend.' },
      { title: 'Strong Balance Sheet', description: 'High cash reserves and low debt.' },
      { title: 'High Piotroski F-Score', description: 'Score of 8 or 9 indicating strong financial health.' },
      { title: 'Consistent Dividend Payers', description: 'History of paying dividends for over 10 consecutive years.' },
      { title: 'Insider Buying', description: 'Significant stock purchases by company executives.' },
      { title: 'Warren Buffett Style', description: 'Durable competitive advantage and fair valuation (moat stocks).' },
    ],
  },
];

export const RECENTLY_USED_SCREENS: string[] = [
  'High Sales Growth',
  'RSI Oversold',
  'Value Stocks (Low P/E)',
  'Golden Crossover',
  'Low Debt-to-Equity',
];

export const MOST_USED_SCREENS: string[] = [
  'Consistent Compounders',
  'High Dividend Yield',
  'Golden Crossover',
  'High Sales Growth',
  'Aggressive EPS Growth',
];

export const ALL_SCREENS: Screen[] = SCREEN_CATEGORIES.flatMap(cat => cat.screens);