// components/ChatInputForm.tsx (Previously ChatFooter.tsx)
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Paperclip } from "lucide-react";

interface ChatInputFormProps {
  onSendMessage: (message: string) => void;
  isProcessing: boolean;
  className?: string; // Add className prop
}

export default function ChatInputForm({
  onSendMessage,
  isProcessing,
  className,
}: ChatInputFormProps) {
  const [inputText, setInputText] = useState("");

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim() === "") return;
    onSendMessage(inputText.trim());
    setInputText("");
  };

  return (
    // Wrap with the passed className
    <div className={`w-full max-w-3xl mx-auto ${className}`}>
      <form
        onSubmit={handleFormSubmit}
        className="flex items-center bg-[var(--input-bg)] border border-gray-700/80 shadow-xl focus-within:ring-2 focus-within:ring-[var(--accent)]/50 focus-within:bg-[var(--input-focus-bg)] transition-all duration-300 rounded-2xl"
      >
        <button
          type="button"
          title="Attach file"
          className="p-3.5 text-gray-500 hover:text-[var(--accent)] transition-colors rounded-l-2xl"
        >
          <Paperclip size={18} />
        </button>
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={
            isProcessing
              ? "IRIS is thinking..."
              : "Ask about markets, stocks, indicators..."
          }
          className="flex-grow py-4 px-2 bg-transparent outline-none text-gray-200 placeholder-gray-500 text-sm"
          disabled={isProcessing}
        />
        <button
          type="submit"
          title="Send message"
          disabled={!inputText.trim() || isProcessing}
          className="p-3.5 text-gray-300 bg-gray-700 hover:bg-gray-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed rounded-r-2xl"
        >
          <motion.div
            initial={{ rotate: 0 }}
            whileHover={{ rotate: 15, scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Send size={18} />
          </motion.div>
        </button>
      </form>
    </div>
  );
}
