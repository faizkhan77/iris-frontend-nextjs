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
    question:
      "Compare the P/E ratio and market cap of Reliance Industries and ABB India",
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
    title: "Understand a Business",
    question: "What is the difference between stock and mutual funds?",
  },
  {
    icon: <BarChart3 className="w-6 h-6 text-red-300" />,
    title: "Check Technicals",
    question: "What is the RSI for Tata Motors?",
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
        <div className="w-full grid grid-cols-2 md:grid-cols-3 gap-4 mt-8">
          {recommendations.map((rec) => (
            <motion.button
              key={rec.title}
              onClick={() => handleChipClick(rec.question)}
              disabled={isProcessing}
              whileHover={{ y: -4 }}
              className="p-4 rounded-xl text-center flex flex-col items-center justify-center gap-3 transition-all duration-300 ease-in-out
             backdrop-blur-md bg-white/5 border border-white/10
             shadow-[inset_1px_1px_2px_rgba(255,255,255,0.1),inset_-1px_-1px_2px_rgba(0,0,0,0.15),0_8px_24px_rgba(0,0,0,0.2)]
             hover:shadow-[inset_1px_1px_2px_rgba(255,255,255,0.15),inset_-1px_-1px_2px_rgba(0,0,0,0.2),0_12px_32px_rgba(0,0,0,0.25)]
             hover:scale-[1.03] active:scale-[0.98]
             disabled:cursor-not-allowed disabled:opacity-50"
            >
              <div className="text-white">{rec.icon}</div>
              <span className="text-sm font-medium text-white text-center h-10 flex items-center justify-center leading-snug">
                {rec.title}
              </span>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
