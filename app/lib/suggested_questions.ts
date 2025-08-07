interface Question {
    question: string;
    description: string;
  }
  
  interface QuestionCategory {
    category: string;
    questions: Question[];
  }
  
  export const suggestedQuestions: QuestionCategory[] = [
    {
      category: "Fundamental Analysis",
      questions: [
        { question: "What is the P/E ratio for Reliance Industries?", description: "Price-to-Earnings" },
        { question: "Show me the Fundamentals of Titan Company.", description: "Company Assets & Liabilities" },
        { question: "What is the Return on Equity (ROE) for HDFC Bank?", description: "Profitability Ratio" },
        { question: "Compare the key fundamental analysis of HDFC Bank and ICICI Bank", description: "Side-by-side comparison" },
        { question: "What is the dividend yield of Tata Motors?", description: "Shareholder returns" },
      ],
    },
    {
      category: "Technical Analysis",
      questions: [
        { question: "How is RattanIndia performing technically?", description: "Short-term trend indicator" },
        { question: "Should i buy Adani Enterprises based on RSI, bollinger bands, williams r, parabolic sar and vwap?", description: "Momentum indicator" },
        { question: "How volatile is Aegis Logistics now?", description: "Volatility indicator" },
        { question: "Is Infosys overbought?", description: "Indicator" },
        // { question: "What are the support and resistance levels for NFLX?", description: "Key price levels" },
      ],
    },
    {
      category: "Market & Sector Trends",
      questions: [
        { question: "What are the top performing stocks over the last year?", description: "Leaderboard" },
        { question: "Show me the recent news sentiment for the Adani Green Energy.", description: "Market mood" },
        { question: "Recommend me the best stocks as a beginner?", description: "Index performance" },
        { question: "Show me the most consistent performers in Pharmaceuticals since 2021.", description: "Financial calendar" },
        { question: "Technical Performance of Solar Industries over the last 2 years", description: "Macroeconomic impact" },
      ],
    },
      {
      category: "Portfolio & General Inquiry",
      questions: [
        { question: "What does 'quantitative easing' mean?", description: "Define a financial term" },
        { question: "How do I calculate the beta of a stock?", description: "Volatility measurement" },
        { question: "What are the pros and cons of investing in ETFs?", description: "Investment strategy" },
        { question: "Explain the difference between a stock and a bond.", description: "Asset class comparison" },
        { question: "Who is the CEO of Microsoft?", description: "Corporate leadership" },
      ],
    },
  ];