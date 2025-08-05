// components/WelcomeScreen.tsx
"use client";

import { useEffect, useRef, useState } from "react";
// Import all necessary icons
import {
  Layers,
  TrendingUp,
  Newspaper,
  Briefcase,
  BarChart3,
  CandlestickChart,
  Send,
  LoaderIcon,
  ChevronDown,
  Paperclip,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "../lib/store";

import AnimatedOrb from "./AnimatedOrb";

// --- YOUR ORIGINAL RECOMMENDATIONS (RESTORED) ---
const recommendations = [
  {
    icon: <Layers className="w-6 h-6 text-purple-300" />,
    title: "Compare Two Stocks",
    question: "Compare the fundamentals of ICICI Bank and HDFC Bank",
  },
  {
    icon: <TrendingUp className="w-6 h-6 text-green-300" />,
    title: "Find Top Performers",
    question: "What are the top 5 companies by market capitalization?",
  },
  {
    icon: <Newspaper className="w-6 h-6 text-blue-300" />,
    title: "Get News Sentiment",
    question: "What is the recent news sentiment for Infosys?",
  },
  {
    icon: <Briefcase className="w-6 h-6 text-yellow-300" />,
    title: "Shareholding patterns",
    question: "Shareholding patterns for Titan Company?",
  },
  {
    icon: <BarChart3 className="w-6 h-6 text-red-300" />,
    title: "Check Technicals",
    question: "Technical Analysis of Tata Motors?",
  },
  {
    icon: <CandlestickChart className="w-6 h-6 text-teal-300" />,
    title: "Get a Broad Outlook",
    question: "Is HDFC Bank a good buy right now?",
  },
];

// --- MAIN COMPONENT (Keeps original name and props) ---
interface AnimatedAIChatProps {
  onSendMessage: (message: string) => void;
  isProcessing: boolean;
}

export function AnimatedAIChat({
  onSendMessage,
  isProcessing,
}: AnimatedAIChatProps) {
  // --- All your original state and hooks are preserved ---
  const { user } = useAppStore();
  const [value, setValue] = useState("");
  const [isModelSelectorOpen, setIsModelSelectorOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState("IRIS v1");
  const modelSelectorRef = useRef<HTMLDivElement>(null);
  const models = ["IRIS v1", "IRIS v0"];

  // --- All your original event handlers are preserved ---
  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (value.trim() && !isProcessing) {
      onSendMessage(value.trim());
      setValue("");
    }
  };

  const handleChipClick = (question: string) => {
    if (!isProcessing) {
      onSendMessage(question);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modelSelectorRef.current &&
        !modelSelectorRef.current.contains(event.target as Node)
      ) {
        setIsModelSelectorOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex-grow w-full flex flex-col items-center justify-center p-4 sm:p-6 text-white overflow-hidden">
      <div className="w-full max-w-3xl flex flex-col items-center">
        <div className="mb-8">
          <AnimatedOrb />
        </div>

        <h1 className="text-4xl lg:text-5xl font-bold text-center">
          <span className="text-[var(--gold-accent)]">Welcome back,</span>{" "}
          {user?.name || "Alex"}!
        </h1>
        <p className="text-[var(--text-secondary)] mt-3">
          How can IRIS help you today?
        </p>

        <form
          onSubmit={handleSendMessage}
          className="w-full mt-8 bg-black border border-[var(--border-color-subtle)] rounded-2xl p-2.5 flex items-center gap-3 focus-within:ring-2 focus-within:ring-[var(--gold-accent)] transition-all duration-300"
        >
          {/* FIX #1: Your original model selector is restored here */}
          <div
            className="relative flex items-center gap-2 flex-shrink-0"
            ref={modelSelectorRef}
          >
            <button
              type="button"
              className="p-2 text-[var(--text-secondary)] hover:text-white transition-colors"
            >
              <Paperclip size={18} />
            </button>
            <motion.button
              type="button"
              onClick={() => setIsModelSelectorOpen((prev) => !prev)}
              className="flex items-center gap-2 rounded-lg bg-white/[0.08] px-3 py-2 text-xs sm:text-sm text-white/70 transition-colors hover:bg-white/[0.15]"
            >
              <span>{selectedModel}</span>
              <ChevronDown
                className={`h-4 w-4 transition-transform ${
                  isModelSelectorOpen ? "rotate-180" : ""
                }`}
              />
            </motion.button>
            <AnimatePresence>
              {isModelSelectorOpen && (
                <motion.div
                  className="absolute bottom-full left-0 z-50 mb-2 w-full min-w-max overflow-hidden rounded-lg border border-white/10 bg-black/90 shadow-lg backdrop-blur-xl"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                >
                  {models.map((model) => (
                    <div
                      key={model}
                      onClick={() => {
                        setSelectedModel(model);
                        setIsModelSelectorOpen(false);
                      }}
                      className="cursor-pointer px-3 py-2 text-sm text-white/80 hover:bg-white/10"
                    >
                      {model}
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask IRIS a question..."
            className="flex-grow h-full bg-transparent outline-none text-white/90 placeholder:text-white/40 px-2"
            disabled={isProcessing}
          />

          <button
            type="submit"
            disabled={isProcessing || !value.trim()}
            className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-[var(--gold-accent)] disabled:opacity-40 disabled:cursor-not-allowed transition-all hover:scale-110 active:scale-100"
          >
            {isProcessing ? (
              <LoaderIcon className="h-5 w-5 animate-spin" />
            ) : (
              <Send size={18} />
            )}
          </button>
        </form>

        {/* FIX #2: Your original 6 recommendation cards, styled for the new theme */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
          {recommendations.map((rec) => (
            <motion.button
              key={rec.title}
              onClick={() => handleChipClick(rec.question)}
              disabled={isProcessing}
              whileHover={{ y: -3, scale: 1.01 }}
              whileTap={{ scale: 0.97 }}
              className="group relative rounded-lg border border-white/10 bg-white/[0.02] backdrop-blur-md
        shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_4px_12px_rgba(0,0,0,0.3)]
        hover:shadow-[0_0_10px_rgba(168,85,247,0.2),0_6px_20px_rgba(0,0,0,0.4)]
        hover:border-purple-400/30 transition-all duration-300 ease-in-out
        px-3 py-3 text-white/90 flex flex-col items-center gap-2 text-center
        disabled:opacity-50 disabled:cursor-not-allowed h-[100px]"
            >
              <div className="relative w-8 h-8 flex items-center justify-center rounded-full bg-purple-500/10 group-hover:bg-purple-500/20 transition duration-300">
                <div className="text-base text-purple-300 group-hover:scale-105 transition-transform duration-300">
                  {rec.icon}
                </div>
                <div className="absolute inset-0 rounded-full border border-purple-300/20 group-hover:border-purple-400/30" />
              </div>

              <span className="text-xs font-medium text-white/90 text-center leading-tight line-clamp-2">
                {rec.title}
              </span>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
