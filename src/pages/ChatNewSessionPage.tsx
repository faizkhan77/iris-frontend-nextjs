import AnimatedOrb from "@/components/animated-orbit";
import { motion } from "motion/react";

const recommendations = [
  {
    title: "Compare Two Stocks",
    question: "Compare the fundamentals of ICICI Bank and HDFC Bank",
  },
  {
    title: "Find Top Performers",
    question: "What are the top 5 companies by market capitalization?",
  },
  {
    title: "Get News Sentiment",
    question: "What is the recent news sentiment for Infosys?",
  },
  {
    title: "Shareholding patterns",
    question: "Shareholding patterns for Titan Company?",
  },
  { title: "Check Technicals", question: "Technical Analysis of Tata Motors?" },
  {
    title: "Get a Broad Outlook",
    question: "Is HDFC Bank a good buy right now?",
  },
];

const ChatNewSessionPage = () => {
  return (
    <div className="bg-background h-full  flex flex-col items-center justify-center rounded-xl border">
      <AnimatedOrb />
      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-2">
        {recommendations.map((rec) => (
          <motion.button
            key={rec.title}
            onClick={() => {}}
            disabled={false}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="rounded-lg border border-element-border bg-sidebar-secondary-bg p-3 text-left text-sm text-text-secondary hover:border-element-border-hover hover:bg-element-bg hover:text-text-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <span className="font-medium text-text-primary">{rec.title}</span>
            <p className="mt-1 line-clamp-2 text-xs">{rec.question}</p>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default ChatNewSessionPage;
