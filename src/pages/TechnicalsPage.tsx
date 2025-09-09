import React, { useState } from 'react';
import { Search, TrendingUp, TrendingDown, Minus, ArrowUpIcon, ChevronUp } from 'lucide-react';

// Types
interface StockIndicators {
  RSI: SignalType;
  EMA: SignalType;
  SMA: SignalType;
  MACD: SignalType;
  ADX: SignalType;
  Supertrend: SignalType;
  Bollinger: SignalType;
  VWAP: SignalType;
  'Williams %R': SignalType;
  PSAR: SignalType;
  Ichimoku: SignalType;
  ATR: SignalType;
}

type SignalType = 'bullish' | 'bearish' | 'neutral';
type OverallSignal = 'Buy' | 'Sell' | 'Neutral';

interface Stock {
  company: string;
  symbol: string;
  price: string;
  overallSignal: OverallSignal;
  signalType: SignalType;
  indicators: StockIndicators;
}

interface SelectedIndicators {
  [key: string]: boolean;
}

const StockScreener: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedIndicators, setSelectedIndicators] = useState<SelectedIndicators>({
    RSI: true,
    EMA: true,
    SMA: true,
    MACD: true,
    ADX: true,
    Supertrend: true,
    Bollinger: true,
    VWAP: true,
    'Williams %R': true,
    PSAR: true,
    Ichimoku: true,
    ATR: true
  });

  // Dummy stock data with proper typing
  const stockData: Stock[] = [
    {
      company: 'Apple Inc.',
      symbol: 'AAPL',
      price: '₹150.25',
      overallSignal: 'Buy',
      signalType: 'bullish',
      indicators: {
        RSI: 'bullish',
        EMA: 'neutral',
        SMA: 'neutral',
        MACD: 'bearish',
        ADX: 'neutral',
        Supertrend: 'neutral',
        Bollinger: 'neutral',
        VWAP: 'neutral',
        'Williams %R': 'neutral',
        PSAR: 'neutral',
        Ichimoku: 'neutral',
        ATR: 'neutral'
      }
    },
    {
      company: 'Alphabet Inc.',
      symbol: 'GOOGL',
      price: '₹2800.50',
      overallSignal: 'Neutral',
      signalType: 'neutral',
      indicators: {
        RSI: 'neutral',
        EMA: 'neutral',
        SMA: 'neutral',
        MACD: 'bullish',
        ADX: 'neutral',
        Supertrend: 'neutral',
        Bollinger: 'neutral',
        VWAP: 'neutral',
        'Williams %R': 'neutral',
        PSAR: 'neutral',
        Ichimoku: 'neutral',
        ATR: 'neutral'
      }
    },
    {
      company: 'Microsoft Corp.',
      symbol: 'MSFT',
      price: '₹340.75',
      overallSignal: 'Sell',
      signalType: 'bearish',
      indicators: {
        RSI: 'bearish',
        EMA: 'bearish',
        SMA: 'neutral',
        MACD: 'bearish',
        ADX: 'bullish',
        Supertrend: 'bearish',
        Bollinger: 'neutral',
        VWAP: 'bearish',
        'Williams %R': 'bearish',
        PSAR: 'neutral',
        Ichimoku: 'bearish',
        ATR: 'neutral'
      }
    },
    {
      company: 'Tesla Inc.',
      symbol: 'TSLA',
      price: '₹245.80',
      overallSignal: 'Buy',
      signalType: 'bullish',
      indicators: {
        RSI: 'bullish',
        EMA: 'bullish',
        SMA: 'bullish',
        MACD: 'bullish',
        ADX: 'bullish',
        Supertrend: 'bullish',
        Bollinger: 'bullish',
        VWAP: 'neutral',
        'Williams %R': 'bullish',
        PSAR: 'bullish',
        Ichimoku: 'neutral',
        ATR: 'neutral'
      }
    },
    {
      company: 'Amazon.com Inc.',
      symbol: 'AMZN',
      price: '₹145.30',
      overallSignal: 'Neutral',
      signalType: 'neutral',
      indicators: {
        RSI: 'neutral',
        EMA: 'neutral',
        SMA: 'neutral',
        MACD: 'neutral',
        ADX: 'neutral',
        Supertrend: 'neutral',
        Bollinger: 'neutral',
        VWAP: 'neutral',
        'Williams %R': 'neutral',
        PSAR: 'neutral',
        Ichimoku: 'neutral',
        ATR: 'neutral'
      }
    }
  ];

  const handleIndicatorToggle = (indicator: string): void => {
    setSelectedIndicators(prev => ({
      ...prev,
      [indicator]: !prev[indicator]
    }));
  };

  const getSignalIcon = (signal: SignalType) => {
    switch (signal) {
      case 'bullish':
        return <ChevronUp className="h-4 w-4 text-emerald-500" />;
      case 'bearish':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getSignalBadgeClasses = (signal: OverallSignal): string => {
    const baseClasses = "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium";
    
    switch (signal) {
      case 'Buy':
        return `${baseClasses} bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300`;
      case 'Sell':
        return `${baseClasses} bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300`;
      default:
        return `${baseClasses} bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300`;
    }
  };

  const filteredStocks = stockData.filter((stock: Stock) =>
    stock.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    stock.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indicatorsList = Object.keys(selectedIndicators);
  const firstRowIndicators = indicatorsList.slice(0, 6);
  const secondRowIndicators = indicatorsList.slice(6);
  const activeIndicatorsCount = Object.values(selectedIndicators).filter(Boolean).length;

  return (
    <div className="mx-auto w-full space-y-8 bg-background">
      {/* Header */}
      <div className="flex items-center p-4 border-b justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Stock Screener</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
          <input
            type="text"
            placeholder="Search Screener..."
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-10 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
      </div>

      {/* Indicators Section */}
      <div className="space-y-6 mx-5">
        <div className="space-y-2">
          <h2 className="text-lg font-medium">Tune Your Analysis</h2>
          <p className="text-sm text-muted-foreground">
            Select indicators to refine the stock signals.
          </p>
        </div>
        
        {/* First Row of Indicators */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {firstRowIndicators.map((indicator: string) => (
            <div key={indicator} className="flex items-center space-x-3">
              <div className="relative">
                <input
                  id={`indicator-${indicator}`}
                  type="checkbox"
                  checked={selectedIndicators[indicator]}
                  onChange={() => handleIndicatorToggle(indicator)}
                  className="peer h-4 w-4 shrink-0 rounded-sm border border-primary shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                />
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-current">
                  {selectedIndicators[indicator] && (
                    <svg
                      className="h-3 w-3 text-primary-foreground"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
              </div>
              <label
                htmlFor={`indicator-${indicator}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {indicator}
              </label>
            </div>
          ))}
        </div>

        {/* Second Row of Indicators */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {secondRowIndicators.map((indicator: string) => (
            <div key={indicator} className="flex items-center space-x-3">
              <div className="relative">
                <input
                  id={`indicator-${indicator}`}
                  type="checkbox"
                  checked={selectedIndicators[indicator]}
                  onChange={() => handleIndicatorToggle(indicator)}
                  className="peer h-4 w-4 shrink-0 rounded-sm border border-primary shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                />
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-current">
                  {selectedIndicators[indicator] && (
                    <svg
                      className="h-3 w-3 text-primary-foreground"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
              </div>
              <label
                htmlFor={`indicator-${indicator}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {indicator}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Stock Table */}
      <div className="rounded-md border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  COMPANY
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  PRICE
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  OVERALL SIGNAL
                </th>
                {Object.keys(selectedIndicators)
                  .filter((key: string) => selectedIndicators[key])
                  .map((indicator: string) => (
                    <th
                      key={indicator}
                      className="h-12 px-2 text-center align-middle font-medium text-muted-foreground"
                    >
                      {indicator.toUpperCase()}
                    </th>
                  ))}
              </tr>
            </thead>
            <tbody>
              {filteredStocks.map((stock: Stock, index: number) => (
                <tr
                  key={`${stock.symbol}-${index}`}
                  className="border-b transition-colors hover:bg-muted/50"
                >
                  <td className="p-4 align-middle">
                    <div className="space-y-1">
                      <div className="font-medium">{stock.company}</div>
                      <div className="text-sm text-muted-foreground">{stock.symbol}</div>
                    </div>
                  </td>
                  <td className="p-4 align-middle font-medium">{stock.price}</td>
                  <td className="p-4 align-middle">
                    <span className={getSignalBadgeClasses(stock.overallSignal)}>
                      {stock.overallSignal}
                    </span>
                  </td>
                  {Object.keys(selectedIndicators)
                    .filter((key: string) => selectedIndicators[key])
                    .map((indicator: string) => (
                      <td key={indicator} className="p-2 text-center align-middle">
                        <div className="flex justify-center">
                          {getSignalIcon(stock.indicators[indicator as keyof StockIndicators])}
                        </div>
                      </td>
                    ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer Info */}
      <div className="text-sm text-muted-foreground">
        <p>
          Showing {filteredStocks.length} stocks with {activeIndicatorsCount} active indicators
        </p>
      </div>
    </div>
  );
};

export default StockScreener;