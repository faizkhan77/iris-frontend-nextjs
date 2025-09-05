"use client";

import { useEffect, useState, useRef } from "react";
import { Send, Paperclip, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedOrb from "./AnimatedOrb";

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

const irisPlaceholders = [
  "📈 IRIS says: Bulls make money, bears make money… but pigs get slaughtered!",
  "💹 Ask IRIS: Need a stock tip? Don’t panic, I’m not your broker 😉",
  "📊 IRIS knows: In trading, even your coffee costs more than your gains sometimes!",
  "💸 IRIS whispers: Buy low, sell high… easier said than done!",
];

export function AnimatedAIChat({
  onSendMessage,
  isProcessing,
}: AnimatedAIChatProps) {
  const [value, setValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [currentPlaceholder, setCurrentPlaceholder] = useState(0);
  // --- MODEL SELECTOR ---
  const [isModelSelectorOpen, setIsModelSelectorOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState("IRIS v1");
  const modelSelectorRef = useRef<HTMLDivElement>(null);
  const models = ["IRIS v1", "IRIS v0"];

  // Close dropdown on outside click
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

  // Rotate placeholders every 3s when not typing
  useEffect(() => {
    if (isTyping) return;
    const interval = setInterval(() => {
      setCurrentPlaceholder((prev) => (prev + 1) % irisPlaceholders.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [isTyping]);

  useEffect(() => {
    setIsTyping(value.length > 0);
  }, [value]);

  return (
    <div className="flex w-full flex-grow flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Orb */}
        <div className="mb-6 flex justify-center">
          <AnimatedOrb />
        </div>

        {/* Title */}
        <h1 className="text-center text-4xl font-bold tracking-tight text-text-primary sm:text-5xl">
          Just talk to <span className="text-[#0dd3ff]">IRIS</span>
        </h1>

        {/* Input Box */}
        <div className="mt-8 flex flex-col rounded-2xl bg-sidebar-secondary-bg p-4 shadow-sm relative border border-element-border">
          {/* Floating Placeholder */}
          <AnimatePresence mode="wait">
            {!isTyping && (
              <motion.div
                key={currentPlaceholder} // triggers animation on change
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 0.7, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="absolute left-6 top-6 pointer-events-none text-text-tertiary text-base"
              >
                {irisPlaceholders[currentPlaceholder]}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Textarea */}
          <textarea
            value={value}
            onKeyDown={handleKeyDown}
            onChange={(e) => setValue(e.target.value)}
            className="w-full flex-grow resize-none bg-transparent p-2 text-base text-text-primary focus:outline-none"
            rows={2}
            disabled={isProcessing}
          />
          {/* Bottom Bar */}
          <div className="mt-2 flex items-center justify-between">
            {/* Model Selector */}
            <div className="relative" ref={modelSelectorRef}>
              <button
                type="button"
                onClick={() => setIsModelSelectorOpen((prev) => !prev)}
                className="flex items-center gap-2 rounded-md bg-element-bg px-3 py-1.5 text-sm text-text-secondary hover:bg-element-bg-hover hover:text-text-primary transition-colors"
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
                    className="absolute bottom-full left-0 z-20 mb-2 w-full min-w-max rounded-md border border-element-border shadow-lg
                   bg-white dark:bg-[#1a1a1a]" // 👈 solid theme-aware background
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
                        className="cursor-pointer px-3 py-2 text-sm 
                       text-gray-900 dark:text-gray-100 
                       hover:bg-gray-100 dark:hover:bg-[#2a2a2a]"
                      >
                        {model}
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Icons */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                title="Attach file"
                className="h-9 w-9 rounded-md text-text-secondary hover:bg-element-bg-hover hover:text-text-primary transition-colors"
              >
                <Paperclip className="m-auto h-5 w-5" />
              </button>
              <button
                type="submit"
                onClick={handleSendMessage}
                title="Send message"
                disabled={!value.trim() || isProcessing}
                className="flex h-9 w-9 items-center justify-center rounded-md bg-accent text-accent-foreground enabled:hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Recommendation Cards */}
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {recommendations.map((rec) => (
            <motion.button
              key={rec.title}
              onClick={() => handleChipClick(rec.question)}
              disabled={isProcessing}
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
    </div>
  );
}
