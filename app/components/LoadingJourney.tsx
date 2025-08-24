"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, BrainCircuit, FileText, Newspaper, Zap } from "lucide-react";
import TypingAnimation from "./TypingAnimation";

// --- Configuration for each journey ---
const journeys = {
  fundamentals: {
    steps: [
      { text: "Loading Fundamental Agent...", duration: 2000 },
      { text: "Querying financial statements...", duration: 2500 },
      { text: "Analyzing key ratios...", duration: 2000 },
      { text: "Composing analysis...", duration: 1500 },
    ],
    icon: FileText,
  },
  technicals: {
    steps: [
      { text: "Loading Technical Agent...", duration: 1500 },
      { text: "Fetching historical price data...", duration: 2000 },
      { text: "Calculating 12+ indicators...", duration: 3000 },
      { text: "Synthesizing signals...", duration: 1500 },
    ],
    icon: Zap,
  },
  sentiment: {
    steps: [
      { text: "Loading Sentiment Agent...", duration: 1500 },
      { text: "Searching for recent news...", duration: 2500 },
      { text: "Analyzing article sentiment...", duration: 2500 },
      { text: "Aggregating market mood...", duration: 1500 },
    ],
    icon: Newspaper,
  },
  cross_agent_reasoning: {
    steps: [
      { text: "Deploying multiple agents...", duration: 2000 },
      { text: "Agents are collaborating...", duration: 3500 },
      { text: "Synthesizing diverse insights...", duration: 2500 },
      { text: "Formulating final verdict...", duration: 2000 },
    ],
    icon: BrainCircuit,
  },
  general: {
    steps: [
      { text: "Processing your message...", duration: 1500 },
      { text: "Crafting a friendly response...", duration: 1000 },
    ],
    icon: Bot,
  },
  unknown: {
    steps: [
      { text: "Analyzing your query...", duration: 2000 },
      { text: "Routing to the best expert...", duration: 2500 },
      { text: "Compiling response...", duration: 2000 },
    ],
    icon: Bot,
  },
};
journeys.knowledge_base = journeys.general;
journeys.save_ltm = {
  steps: [{ text: "Saving to memory...", duration: 2000 }],
  icon: Bot,
};

type JourneyKey = keyof typeof journeys;

interface LoadingJourneyProps {
  route: string;
}

export default function LoadingJourney({ route }: LoadingJourneyProps) {
  const journey = journeys[route as JourneyKey] || journeys.unknown;
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentStep((prev) => (prev + 1) % journey.steps.length);
    }, journey.steps[currentStep].duration);

    return () => clearTimeout(timer);
  }, [currentStep, journey]);

  return (
    <div className="mt-4 space-y-3">
      {/* Typing dots animation */}
      <TypingAnimation />

      <div className="flex items-center text-xs sm:text-sm text-text-secondary pl-4">
        {/* Animated icon */}
        <div className="flex h-6 w-6 items-center justify-center mr-3">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, scale: 0.5, rotate: -15 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.5, rotate: 15 }}
              transition={{ duration: 0.4 }}
              className="drop-shadow-lg"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{
                  repeat: Infinity,
                  duration: 1.8,
                  ease: "easeInOut",
                }}
              >
                <journey.icon size={18} className="text-cyan-400" />
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Step text */}
        <AnimatePresence mode="wait">
          <motion.p
            key={currentStep}
            initial={{ y: 8, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -8, opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="font-mono tracking-wide text-text-primary"
          >
            {journey.steps[currentStep].text}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}
