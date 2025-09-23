import React from "react";
import { motion } from "framer-motion";
import AnimatedOrb from "@/components/animated-orbit";
import { useSendMessageHandler } from "@/hooks/useSendMessageHandler";

const recommendations = [
    { title: "Compare Two Stocks", question: "Compare the fundamentals of ICICI Bank and HDFC Bank" },
    { title: "Find Top Performers", question: "What are the top 5 companies by market capitalization?" },
    { title: "Get News Sentiment", question: "What is the recent news sentiment for Infosys?" },
    { title: "Shareholding patterns", question: "Shareholding patterns for Titan Company?" },
    { title: "Check Technicals", question: "Technical Analysis of Tata Motors?" },
    { title: "Get a Broad Outlook", question: "Is HDFC Bank a good buy right now?" },
];

interface WrapperProps {
  show: boolean;
  children: React.ReactNode;
}

const ChatWelcomeScreen: React.FC<WrapperProps> = ({ show, children }) => {
  const { submitMessage, isLoading } = useSendMessageHandler();

  if (!show) return <>{children}</>;

  const handleRecommendationClick = async (question: string) => {
      await submitMessage(question);
  };

  return (
    // THE FIX: Added `relative` here to ensure `z-10` is always applied correctly.
    <div className="relative z-10 flex justify-center">
      <div className="w-full max-w-2xl">
        <div className="mb-6 flex justify-center">
          <AnimatedOrb />
        </div>
        <h1 className="text-center text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
          Just talk to <span className="text-[#0dd3ff] relative">IRIS <span className="p-1 absolute top-0 px-2 text-xs bg-black dark:bg-white rounded-lg dark:text-black">beta</span></span>
        </h1>
        <div className="my-6 sm:my-8">{children}</div>
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {recommendations.map((rec) => (
            <motion.button
              key={rec.title}
              onClick={() => handleRecommendationClick(rec.question)}
              disabled={isLoading}
              className="rounded-lg border bg-card p-3 text-left text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="font-medium text-foreground">{rec.title}</span>
              <p className="mt-1 line-clamp-2 text-xs">{rec.question}</p>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChatWelcomeScreen;