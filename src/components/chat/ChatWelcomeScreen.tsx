import React from "react";
import { motion } from "framer-motion";
import AnimatedOrb from "@/components/animated-orbit";
// 1. Import the custom hook
import { useSendMessageHandler } from "@/hooks/useSendMessageHandler"; // Adjust path as needed

const recommendations = [
  // ... your recommendations list
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
  // 2. Use the hook here as well
  const { submitMessage, isLoading } = useSendMessageHandler();

  if (!show) return <>{children}</>;

  const handleRecommendationClick = async (question: string) => {
      await submitMessage(question);
  };

  return (
    <div className="z-10">
      <div className="w-full max-w-2xl">
        {/* ... Title and Orb ... */}
      <div className="mb-6 flex justify-center">
          <AnimatedOrb />
        </div>
        <h1 className="text-center text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
       
          Just talk to <span className="text-[#0dd3ff]">IRIS</span>
        </h1>

        <div className="my-10">{children}</div>

        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {recommendations.map((rec) => (
            // 3. Changed to a button for better accessibility
            <motion.button
              key={rec.title}
              onClick={() => handleRecommendationClick(rec.question)}
              disabled={isLoading} // Disable all buttons while a message is sending
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