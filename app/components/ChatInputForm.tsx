"use client";

import { useState, useEffect } from "react";
import { Send, Lightbulb } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { suggestedQuestions } from "../lib/suggested_questions";

interface ChatInputFormProps {
  onSendMessage: (message: string) => void;
  isProcessing: boolean;
}

const rotatingPlaceholders = [
  "Ask IRIS: Tesla fundamentals 📊",
  "Where is NIFTY headed? 📈",
  "Explain RSI like I’m 5 🤔",
  "Stock valuation of Apple 🍏",
  "Is this a bull or bear trend? 🐂🐻",
];

export default function ChatInputForm({
  onSendMessage,
  isProcessing,
}: ChatInputFormProps) {
  const [inputText, setInputText] = useState("");
  const [isQuestionHubOpen, setIsQuestionHubOpen] = useState(false);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  // Cycle through placeholders like a ticker
  useEffect(() => {
    if (isProcessing || inputText) return;
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % rotatingPlaceholders.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [isProcessing, inputText]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim() === "" || isProcessing) return;
    onSendMessage(inputText.trim());
    setInputText("");
  };

  const handleSuggestionClick = (question: string) => {
    if (isProcessing) return;
    onSendMessage(question);
    setIsQuestionHubOpen(false);
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-2 sm:px-4">
      <form
        onSubmit={handleFormSubmit}
        className={`relative flex items-center rounded-2xl border 
        border-element-border bg-background shadow-md 
        transition-all duration-300 focus-within:ring-2 focus-within:ring-accent 
        dark:bg-sidebar-secondary-bg`}
      >
        {/* Question Hub */}
        <Popover open={isQuestionHubOpen} onOpenChange={setIsQuestionHubOpen}>
          <PopoverTrigger asChild>
            <button
              type="button"
              title="Suggested Questions"
              className="p-3 text-text-secondary hover:text-accent transition-colors"
            >
              <motion.div
                animate={{ rotate: [0, -10, 10, -10, 0] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <Lightbulb
                  size={20}
                  className="text-yellow-400 drop-shadow-md"
                />
              </motion.div>
            </button>
          </PopoverTrigger>
          <PopoverContent
            className="w-[300px] sm:w-[400px] md:w-[500px] mb-2 p-3 rounded-xl border-element-border bg-background shadow-lg dark:bg-sidebar-secondary-bg"
            side="top"
            align="start"
            sideOffset={8}
          >
            <div className="p-2">
              <h4 className="font-semibold text-text-primary">Question Hub</h4>
              <p className="text-sm text-text-secondary">
                Click any question to ask IRIS.
              </p>
            </div>
            <div className="max-h-[60vh] overflow-y-auto custom-scrollbar pr-2">
              <Accordion type="single" collapsible className="w-full">
                {suggestedQuestions.map((categoryItem) => (
                  <AccordionItem
                    key={categoryItem.category}
                    value={categoryItem.category}
                  >
                    <AccordionTrigger className="text-sm font-medium text-text-primary hover:no-underline">
                      {categoryItem.category}
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2">
                        {categoryItem.questions.map((q, index) => (
                          <button
                            key={index}
                            onClick={() => handleSuggestionClick(q.question)}
                            className="w-full text-left p-3 rounded-md hover:bg-element-bg transition-colors"
                          >
                            <p className="text-sm font-medium text-text-primary">
                              {q.question}
                            </p>
                            <p className="text-xs text-text-secondary mt-1">
                              {q.description}
                            </p>
                          </button>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </PopoverContent>
        </Popover>

        {/* Input with animated placeholder */}
        <div className="relative flex-grow px-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isProcessing}
            className="w-full py-4 bg-transparent outline-none text-text-primary text-sm placeholder-transparent"
          />
          <AnimatePresence>
            {!inputText && !isProcessing && (
              <motion.span
                key={placeholderIndex}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 0.7, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.4 }}
                className="absolute left-2 top-1/2 -translate-y-1/2 text-sm text-text-tertiary pointer-events-none"
              >
                {rotatingPlaceholders[placeholderIndex]}
              </motion.span>
            )}
            {isProcessing && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.7 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute left-2 top-1/2 -translate-y-1/2 text-sm text-text-tertiary pointer-events-none"
              >
                IRIS is analyzing the markets... ⚡
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* Send button */}
        <motion.button
          type="submit"
          title="Send message"
          disabled={!inputText.trim() || isProcessing}
          className="m-1.5 flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-accent-foreground shadow-sm transition-all duration-200 enabled:hover:bg-accent-hover enabled:hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50"
          whileTap={{ scale: 0.9 }}
        >
          <Send size={16} />
        </motion.button>
      </form>
    </div>
  );
}
