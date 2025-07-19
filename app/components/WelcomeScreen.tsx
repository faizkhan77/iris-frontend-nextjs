"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import * as React from "react";
import { cn } from "@/lib/utils";
import {
  Layers,
  TrendingUp,
  Newspaper,
  Briefcase,
  BarChart3,
  CandlestickChart,
  Paperclip,
  SendIcon,
  LoaderIcon,
  ChevronDown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import IrisLogo from "./IrisLogo"; // Assuming IrisLogo.tsx exists in the same directory

// --- RECOMMENDATIONS (from WelcomeScreen.tsx) ---
const recommendations = [
  {
    icon: <Layers className="w-7 h-7 mb-2 text-purple-300" />,
    title: "Compare Two Stocks",
    question:
      "Compare the P/E ratio and market cap of Reliance Industries and ABB India",
  },
  {
    icon: <TrendingUp className="w-7 h-7 mb-2 text-green-300" />,
    title: "Find Top Performers",
    question: "What are the top 5 companies by market capitalization?",
  },
  {
    icon: <Newspaper className="w-7 h-7 mb-2 text-blue-300" />,
    title: "Get News Sentiment",
    question: "What is the recent news sentiment for Infosys?",
  },
  {
    icon: <Briefcase className="w-7 h-7 mb-2 text-yellow-300" />,
    title: "Understand a Business",
    question: "What is the difference between stock and mutual funds?",
  },
  {
    icon: <BarChart3 className="w-7 h-7 mb-2 text-red-300" />,
    title: "Check Technicals",
    question: "What is the RSI for Tata Motors?",
  },
  {
    icon: <CandlestickChart className="w-7 h-7 mb-2 text-teal-300" />,
    title: "Get a Broad Outlook",
    question: "Is HDFC Bank a good buy right now?",
  },
];

// --- UTILITY HOOKS & COMPONENTS ---

interface UseAutoResizeTextareaProps {
  minHeight: number;
  maxHeight?: number;
}

function useAutoResizeTextarea({
  minHeight,
  maxHeight,
}: UseAutoResizeTextareaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = useCallback(
    (reset?: boolean) => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      if (reset) {
        textarea.style.height = `${minHeight}px`;
        return;
      }

      textarea.style.height = `${minHeight}px`;
      const newHeight = Math.max(
        minHeight,
        Math.min(textarea.scrollHeight, maxHeight ?? Number.POSITIVE_INFINITY)
      );

      textarea.style.height = `${newHeight}px`;
    },
    [minHeight, maxHeight]
  );

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = `${minHeight}px`;
    }
  }, [minHeight]);

  return { textareaRef, adjustHeight };
}

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  containerClassName?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, containerClassName, ...props }, ref) => {
    return (
      <div className={cn("relative", containerClassName)}>
        <textarea
          className={cn(
            "flex min-h-[80px] w-full rounded-md border-none bg-transparent px-3 py-2 text-sm",
            "transition-all duration-200 ease-in-out",
            "placeholder:text-muted-foreground",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0",
            className
          )}
          ref={ref}
          {...props}
        />
      </div>
    );
  }
);
Textarea.displayName = "Textarea";

// --- MAIN COMPONENT ---

interface AnimatedAIChatProps {
  onSendMessage: (message: string) => void;
  isProcessing: boolean;
}

export function AnimatedAIChat({
  onSendMessage,
  isProcessing,
}: AnimatedAIChatProps) {
  const [value, setValue] = useState("");
  const { textareaRef, adjustHeight } = useAutoResizeTextarea({
    minHeight: 60,
    maxHeight: 200,
  });
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [inputFocused, setInputFocused] = useState(false);
  const [isModelSelectorOpen, setIsModelSelectorOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState("IRIS v1");
  const modelSelectorRef = useRef<HTMLDivElement>(null);
  const models = ["IRIS v1", "IRIS v0"];

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

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
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSendMessage = () => {
    if (value.trim() && !isProcessing) {
      onSendMessage(value.trim());
      setValue("");
      adjustHeight(true);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-transparent p-4 sm:p-6 text-white relative">
      {/* --- Animated background glows --- */}
      <div className="absolute inset-0 -z-10 h-full w-full overflow-hidden">
        <div className="absolute top-0 left-1/4 h-96 w-96 animate-pulse rounded-full bg-purple-500/10 mix-blend-normal blur-[128px] filter" />
        <div className="absolute bottom-0 right-1/4 h-96 w-96 animate-pulse rounded-full bg-indigo-500/10 mix-blend-normal blur-[128px] filter delay-700" />
        <div className="absolute top-1/4 right-1/3 w-64 h-64 animate-pulse rounded-full bg-fuchsia-500/10 mix-blend-normal blur-[96px] filter delay-1000" />
      </div>

      <div className="relative z-10 flex h-full w-full max-w-3xl flex-col items-center justify-center">
        <motion.div
          key="welcome-content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex w-full flex-col items-center"
        >
          {/* Logo and Titles */}
          <div className="mb-4 flex h-32 w-32 items-center justify-center md:h-40 md:w-40">
            <IrisLogo className="bg-gradient-to-br from-gray-200 to-purple-400 text-9xl" />
          </div>
          <h2 className="mb-2 text-xl text-center text-gray-300 md:text-2xl">
            How can IRIS help you today?
          </h2>
          <p className="mb-8 text-gray-500 text-center">
            Try a suggestion or type your own query below.
          </p>

          {/* Recommendation Grid */}
          <div className="mb-8 grid w-full grid-cols-2 gap-4 md:grid-cols-3">
            {recommendations.map((rec) => (
              <motion.button
                key={rec.title}
                onClick={() => onSendMessage(rec.question)}
                disabled={isProcessing}
                className="rounded-xl border border-white/10 bg-white/5 p-4 text-center transition-colors duration-200 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="flex flex-col items-center justify-center">
                  {rec.icon}
                  <span className="text-sm font-semibold text-gray-200">
                    {rec.title}
                  </span>
                </div>
              </motion.button>
            ))}
          </div>

          {/* Chat Input Box */}
          <motion.div
            className="relative w-full rounded-2xl border border-white/[0.05] bg-white/[0.02] shadow-2xl backdrop-blur-xl"
            initial={{ scale: 0.98, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="p-1 sm:p-2">
              <Textarea
                ref={textareaRef}
                value={value}
                onChange={(e) => {
                  setValue(e.target.value);
                  adjustHeight();
                }}
                onKeyDown={handleKeyDown}
                onFocus={() => setInputFocused(true)}
                onBlur={() => setInputFocused(false)}
                placeholder="Ask IRIS a question..."
                className={cn(
                  "w-full resize-none px-2 py-3 sm:px-4 text-sm text-white/90 placeholder:text-white/30",
                  "min-h-[60px]"
                )}
                style={{ overflow: "hidden" }}
              />
            </div>

            <div className="flex items-center justify-between gap-2 sm:gap-4 border-t border-white/[0.05] p-2 sm:p-3">
              {/* Left side controls */}
              <div
                className="relative flex items-center gap-1"
                ref={modelSelectorRef}
              >
                <motion.button
                  type="button"
                  onClick={() => alert("File uploads coming soon!")} // Placeholder action
                  whileTap={{ scale: 0.94 }}
                  className="rounded-lg p-2 text-white/50 transition-colors hover:text-white/90"
                >
                  <Paperclip className="h-5 w-5" />
                </motion.button>

                <motion.button
                  type="button"
                  onClick={() => setIsModelSelectorOpen((prev) => !prev)}
                  className="flex items-center gap-2 rounded-lg bg-white/[0.05] px-3 py-1.5 text-xs sm:text-sm text-white/70 transition-colors hover:bg-white/[0.1] hover:text-white/90"
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

              {/* Send Button */}
              <motion.button
                type="button"
                onClick={handleSendMessage}
                disabled={isProcessing || !value.trim()}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-3 sm:px-4 py-2 text-sm font-medium transition-all",
                  value.trim() && !isProcessing
                    ? "bg-white text-[#0A0A0B] shadow-lg shadow-white/10"
                    : "bg-white/[0.05] text-white/40"
                )}
              >
                {isProcessing ? (
                  <LoaderIcon className="h-4 w-4 animate-[spin_2s_linear_infinite]" />
                ) : (
                  <SendIcon className="h-4 w-4" />
                )}
                <span className="hidden sm:inline">Send</span>
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* --- Mouse-following glow --- */}
      {inputFocused && (
        <motion.div
          className="pointer-events-none fixed -z-10 h-[50rem] w-[50rem] rounded-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-indigo-500 opacity-[0.02] blur-[96px]"
          animate={{
            x: mousePosition.x - 400,
            y: mousePosition.y - 400,
          }}
          transition={{
            type: "spring",
            damping: 25,
            stiffness: 150,
            mass: 0.5,
          }}
        />
      )}
    </div>
  );
}
