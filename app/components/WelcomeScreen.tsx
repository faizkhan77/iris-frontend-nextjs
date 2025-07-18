// components/WelcomeScreen.tsx
"use client";

import { motion } from "framer-motion";
import {
  Layers,
  TrendingUp,
  Newspaper,
  Briefcase,
  BarChart3,
  CandlestickChart,
} from "lucide-react";
import IrisLogo from "./IrisLogo";
import ChatInputForm from "./ChatInputForm";

// --- UPDATED AND IMPROVED RECOMMENDATIONS ---
const recommendations = [
  {
    icon: <Layers className="w-7 h-7 mb-2 text-purple-300" />,
    title: "Compare Two Stocks",
    // This tests the agent's ability to handle multiple entities and specific data points.
    // It will likely be routed to the `fundamentals` agent.
    question:
      "Compare the P/E ratio and market cap of Reliance Industries and ABB India",
  },
  {
    icon: <TrendingUp className="w-7 h-7 mb-2 text-green-300" />,
    title: "Find Top Performers",
    // A classic fundamental query that requires ranking and limiting.
    question: "What are the top 5 companies by market capitalization?",
  },
  {
    icon: <Newspaper className="w-7 h-7 mb-2 text-blue-300" />,
    title: "Get News Sentiment",
    // Directly targets the `sentiment` agent.
    question: "What is the recent news sentiment for Infosys?",
  },
  {
    icon: <Briefcase className="w-7 h-7 mb-2 text-yellow-300" />,
    title: "Understand a Business",
    // A RAG-based query that should pull from your vector store.
    // This is a great test for your fundamentals agent's RAG capabilities.
    question: "What is the business description of Adani Enterprises?",
  },
  {
    icon: <BarChart3 className="w-7 h-7 mb-2 text-red-300" />,
    title: "Check Technicals",
    // A straightforward query for the `technicals` agent.
    question: "What is the RSI for Tata Motors?",
  },
  {
    icon: <CandlestickChart className="w-7 h-7 mb-2 text-teal-300" />,
    title: "Get a Broad Outlook",
    // This is the perfect question to trigger the `cross_agent_reasoning` route,
    // showcasing the full power of the multi-agent system.
    question: "Is HDFC Bank a good buy right now?",
  },
];

interface WelcomeScreenProps {
  onSendMessage: (message: string) => void;
  isProcessing: boolean;
}

export default function WelcomeScreen({
  onSendMessage,
  isProcessing,
}: WelcomeScreenProps) {
  return (
    <motion.div
      key="initial-ui"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="flex flex-col items-center justify-center h-full w-full max-w-3xl mx-auto px-4"
    >
      <div className="w-32 h-32 md:w-40 md:h-40 mb-4 flex items-center justify-center">
        <IrisLogo className="text-9xl bg-gradient-to-br from-gray-200 to-purple-400" />
      </div>

      <h2 className="text-xl md:text-2xl text-gray-300 mb-2">
        How can IRIS help you today?
      </h2>
      <p className="text-gray-500 mb-8">
        Try a suggestion or type your own query below.
      </p>

      {/* Recommendation boxes grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full mb-8">
        {recommendations.map((rec) => (
          <motion.button
            key={rec.title}
            onClick={() => onSendMessage(rec.question)}
            disabled={isProcessing}
            className="bg-white/5 border border-white/10 rounded-xl p-4 text-center hover:bg-white/10 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="flex flex-col items-center justify-center">
              {rec.icon}
              <span className="font-semibold text-sm text-gray-200">
                {rec.title}
              </span>
            </div>
          </motion.button>
        ))}
      </div>

      <ChatInputForm
        onSendMessage={onSendMessage}
        isProcessing={isProcessing}
      />
    </motion.div>
  );
}
