"use client";

import { useState } from "react";
import { Send, Lightbulb } from "lucide-react";
import { motion } from "framer-motion";
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

export default function ChatInputForm({
  onSendMessage,
  isProcessing,
}: ChatInputFormProps) {
  const [inputText, setInputText] = useState("");
  // --- FIX: State to control the popover's visibility ---
  const [isQuestionHubOpen, setIsQuestionHubOpen] = useState(false);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim() === "" || isProcessing) return;
    onSendMessage(inputText.trim());
    setInputText("");
  };

  const handleSuggestionClick = (question: string) => {
    if (isProcessing) return;
    onSendMessage(question);
    // --- FIX: Explicitly close the popover after sending the message ---
    setIsQuestionHubOpen(false);
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <form
        onSubmit={handleFormSubmit}
        className="relative flex items-center rounded-2xl border border-element-border bg-background shadow-sm focus-within:ring-1 focus-within:ring-accent dark:bg-sidebar-secondary-bg"
      >
        {/* --- MODIFIED: Question Hub Popover is now a controlled component --- */}
        <Popover open={isQuestionHubOpen} onOpenChange={setIsQuestionHubOpen}>
          <PopoverTrigger asChild>
            <button
              type="button"
              title="Suggested Questions"
              className="p-3.5 text-text-secondary hover:text-accent transition-colors"
            >
              {/* --- ENHANCEMENT: Animated, yellow lightbulb --- */}
              <motion.div
                animate={{ rotate: [0, -10, 10, -10, 0] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <Lightbulb size={18} className="text-yellow-400" />
              </motion.div>
            </button>
          </PopoverTrigger>
          <PopoverContent
            className="w-[300px] sm:w-[400px] md:w-[500px] mb-2 p-2 rounded-xl border-element-border bg-background shadow-lg dark:bg-sidebar-secondary-bg"
            side="top"
            align="start"
            // --- FIX: Add an offset to prevent overlapping the last message ---
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

        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={isProcessing ? "IRIS is thinking..." : "Talk to IRIS..."}
          className="flex-grow py-4 px-2 bg-transparent outline-none text-text-primary placeholder:text-text-tertiary text-sm"
          disabled={isProcessing}
        />
        <motion.button
          type="submit"
          title="Send message"
          disabled={!inputText.trim() || isProcessing}
          className="m-1.5 flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-accent-foreground transition-opacity duration-200 enabled:hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50"
          whileTap={{ scale: 0.95 }}
        >
          <Send size={16} />
        </motion.button>
      </form>
    </div>
  );
}
