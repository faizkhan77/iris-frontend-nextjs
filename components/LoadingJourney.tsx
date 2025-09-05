"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bot,
  BrainCircuit,
  FileText,
  Newspaper,
  Zap,
  BookOpen,
  PieChart,
} from "lucide-react";
import TypingAnimation from "./TypingAnimation";

// --- Configuration for each journey ---
const journeys = {
  fundamentals: {
    steps: [
      {
        text: "Activating Fundamental Agent — spreadsheets, assemble...",
        duration: 2000,
      },
      {
        text: "Pulling balance sheets, income, and cash flow...",
        duration: 2500,
      },
      {
        text: "Crunching ratios: P/E, ROE, and more acronyms...",
        duration: 2000,
      },
      {
        text: "Turning raw data into beautiful GenUI graphs...",
        duration: 2000,
      },
      { text: "Summarizing numbers into actual meaning...", duration: 1500 },
    ],
    icon: FileText,
  },

  technicals: {
    steps: [
      {
        text: "Booting up the Technical Agent — charts incoming...",
        duration: 1500,
      },
      {
        text: "Pulling historical prices — time travel, market style...",
        duration: 2000,
      },
      { text: "Running indicators: RSI, MACD, and friends...", duration: 3000 },
      {
        text: "Decoding candlesticks and spotting patterns...",
        duration: 3000,
      },
      {
        text: "Blending signals into a strategy you wish you saw yesterday...",
        duration: 1500,
      },
    ],
    icon: Zap,
  },

  sentiment: {
    steps: [
      {
        text: "Booting up the Sentiment Agent — mood scanner online...",
        duration: 1500,
      },
      {
        text: "Digging through the latest market headlines...",
        duration: 2500,
      },
      {
        text: "Skimming news like a trader before market open...",
        duration: 2500,
      },
      {
        text: "Measuring vibes: bullish, bearish, or just confused...",
        duration: 2500,
      },
      {
        text: "Cross-checking with technical signals for sanity...",
        duration: 2000,
      },
      {
        text: "Summing up the market’s mood in plain English...",
        duration: 1500,
      },
    ],
    icon: Newspaper,
  },

  cross_agent_reasoning: {
    steps: [
      { text: "Calling in the market experts...", duration: 2000 },
      {
        text: "Fundamental Agent checking earnings and red flags...",
        duration: 2000,
      },
      {
        text: "Technical Agent connecting dots and drawing trends...",
        duration: 2000,
      },
      {
        text: "Sentiment Agent reading the market’s mood swings...",
        duration: 2000,
      },
      { text: "Agents arguing over valuation vs. vibes...", duration: 3500 },
      { text: "Blending brains for a balanced perspective...", duration: 2500 },
      { text: "Crunching the chaos into one clear call...", duration: 2000 },
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
      { text: "Parsing your query — hmm, tricky one...", duration: 2000 },
      {
        text: "Consulting the right market mind for the job...",
        duration: 2500,
      },
      { text: "Piecing it all together — insights loading...", duration: 2000 },
    ],
    icon: Bot,
  },
  knowledge_base: {
    steps: [
      { text: "Opening the market playbook...", duration: 2000 },
      { text: "Searching financial knowledge vault...", duration: 2500 },
      {
        text: "Translating complex jargon into plain English...",
        duration: 2500,
      },
      {
        text: "Summarizing like a finance nerd with a heart...",
        duration: 2000,
      },
    ],
    icon: BookOpen,
  },
  shareholding: {
    steps: [
      { text: "Accessing shareholder registry...", duration: 2000 },
      { text: "Tracking promoter, FII, and DII movements...", duration: 2500 },
      { text: "Analyzing ownership patterns and shifts...", duration: 2500 },
      { text: "Building stake breakdown visuals...", duration: 2000 },
      { text: "Compiling who owns what — and how much...", duration: 1500 },
    ],
    icon: PieChart,
  },
};

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
