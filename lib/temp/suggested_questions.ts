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
    category: "Fundamentals",
    questions: [
      { question: "What is the P/E ratio of Reliance Industries?", description: "Valuation ratio" },
      { question: "Show me the financial fundamentals of Titan Company.", description: "Balance sheet & income" },
      { question: "What is the Return on Equity (ROE) for HDFC Bank?", description: "Profitability measure" },
      { question: "Compare the fundamentals of HDFC Bank and ICICI Bank.", description: "Side-by-side analysis" },
      { question: "What is the dividend yield of Tata Motors?", description: "Shareholder returns" },
    ],
  },
  {
    category: "Technicals",
    questions: [
      { question: "How is RattanIndia performing technically?", description: "Short-term chart trend" },
      { question: "Should I buy Adani Enterprises based on RSI, MACD, and Bollinger Bands?", description: "Momentum & trend indicators" },
      { question: "How volatile is Aegis Logistics right now?", description: "Volatility measure" },
      { question: "Is Infosys currently overbought?", description: "Overbought/oversold check" },
      { question: "What are the support and resistance levels for TCS?", description: "Key price zones" },
    ],
  },
  {
    category: "Market & Sector Trends",
    questions: [
      { question: "What are the top-performing stocks over the last year?", description: "Stock leaderboard" },
      { question: "Show me the recent news sentiment for Adani Green Energy.", description: "Market mood analysis" },
      { question: "Which sectors are performing best this quarter?", description: "Sector-wise performance" },
      { question: "Show me the most consistent performers in Pharmaceuticals since 2021.", description: "Sectoral consistency" },
      { question: "How has the Nifty 50 index performed recently?", description: "Index trend" },
    ],
  },
  {
    category: "General Inquiry",
    questions: [
      { question: "What does 'quantitative easing' mean?", description: "Financial term explained" },
      { question: "How do I calculate the beta of a stock?", description: "Risk/volatility metric" },
      { question: "What are the pros and cons of investing in ETFs?", description: "Investment strategy" },
      { question: "Explain the difference between a stock and a bond.", description: "Asset class basics" },
      { question: "Who is the current CEO of Microsoft?", description: "Corporate leadership info" },
    ],
  },
];
