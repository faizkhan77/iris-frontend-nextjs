"use client";

import { useEffect, useState, useRef } from "react";
import { Send, Paperclip, Sparkles, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Assuming you have these components and they are styled appropriately
import AnimatedOrb from "./AnimatedOrb";

// --- The recommendation cards are kept as requested, but will be restyled ---
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

interface AnimatedAIChatProps {
  onSendMessage: (message: string) => void;
  isProcessing: boolean;
}

export function AnimatedAIChat({
  onSendMessage,
  isProcessing,
}: AnimatedAIChatProps) {
  const [value, setValue] = useState("");

  // --- STATE AND REFS FOR MODEL SELECTOR (RESTORED) ---
  const [isModelSelectorOpen, setIsModelSelectorOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState("IRIS v1");
  const modelSelectorRef = useRef<HTMLDivElement>(null);
  const models = ["IRIS v1", "IRIS v0"];

  // --- LOGIC FOR CLOSING DROPDOWN ON OUTSIDE CLICK (RESTORED) ---
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex w-full flex-grow flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Animated Orb, as requested */}
        <div className="mb-6 flex justify-center">
          <AnimatedOrb />
        </div>

        {/* Title */}
        <h1 className="text-center text-4xl font-bold tracking-tight text-text-primary sm:text-5xl">
          Just talk to <span className="text-[#0dd3ff]">IRIS</span>
        </h1>

        {/* Main Input Box */}
        <div className="mt-8 flex flex-col rounded-2xl border border-element-border bg-sidebar-secondary-bg p-4 shadow-sm">
          {/* Upgrade to PRO banner */}
          <div className="text-black mb-3 flex cursor-pointer items-center justify-center gap-2 rounded-lg py-2 text-sm transition-colors bg-accent hover:bg-element-bg">
            <Sparkles className="h-4 w-4" />
            <span>Upgrade to PRO</span>
          </div>

          {/* Text Input Area */}
          <textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Talk to IRIS... Use / for prompts"
            className="w-full flex-grow resize-none bg-transparent p-2 text-base text-text-primary placeholder:text-text-tertiary focus:outline-none"
            rows={2}
            disabled={isProcessing}
          />

          {/* Bottom Bar with actions */}
          <div className="mt-2 flex items-center justify-between">
            {/* --- NEW MODEL SELECTOR (LEFT SIDE) --- */}
            <div className="relative" ref={modelSelectorRef}>
              <button
                type="button"
                onClick={() => setIsModelSelectorOpen((prev) => !prev)}
                className="flex items-center gap-2 rounded-md bg-element-bg px-3 py-1.5 text-sm text-text-secondary transition-colors hover:bg-element-bg-hover hover:text-text-primary"
              >
                <span>{selectedModel}</span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${
                    isModelSelectorOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              <AnimatePresence>
                {isModelSelectorOpen && (
                  <motion.div
                    className="absolute bottom-full left-0 z-10 mb-2 w-full min-w-max overflow-hidden rounded-md border border-element-border bg-content-bg shadow-lg dark:bg-sidebar-secondary-bg"
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
                        className="cursor-pointer px-3 py-2 text-sm text-text-primary bg-accent hover:bg-element-bg"
                      >
                        {model}
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* --- ACTION ICONS (RIGHT SIDE) --- */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                title="Attach file"
                className="h-9 w-9 rounded-md text-text-secondary transition-colors hover:bg-element-bg-hover hover:text-text-primary"
              >
                <Paperclip className="m-auto h-5 w-5" />
              </button>

              <button
                type="submit"
                onClick={handleSendMessage}
                title="Send message"
                disabled={!value.trim() || isProcessing}
                className="flex h-9 w-9 items-center justify-center rounded-md bg-accent text-accent-foreground transition-opacity duration-200 enabled:hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Recommendation Cards, restyled for the new theme */}
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {recommendations.map((rec) => (
            <motion.button
              key={rec.title}
              onClick={() => handleChipClick(rec.question)}
              disabled={isProcessing}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="rounded-lg border border-element-border bg-sidebar-secondary-bg p-3 text-left text-sm text-text-secondary transition-colors hover:border-element-border-hover hover:bg-element-bg hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-50"
            >
              <span className="font-medium text-text-primary">{rec.title}</span>
              <p className="mt-1 line-clamp-2 text-xs">{rec.question}</p>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
