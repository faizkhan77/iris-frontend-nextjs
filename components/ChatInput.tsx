// components/ChatInput.tsx
"use client";
import { useState } from "react";
import { ArrowUp, LoaderCircle } from "lucide-react";
import { motion } from "framer-motion";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  className?: string;
}

export default function ChatInput({
  onSendMessage,
  isLoading,
  className,
}: ChatInputProps) {
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim());
      setInput("");
    }
  };

  return (
    <motion.div layout className={`w-full ${className}`}>
      <form onSubmit={handleSubmit} className="relative">
        <textarea
          // ... (props are the same)
          className="w-full pl-4 pr-16 py-4 text-base bg-black/20 backdrop-blur-sm rounded-2xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-[var(--accent-secondary)] transition-all duration-300 resize-none"
          // ...
        />
        <motion.button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] text-white disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
          whileHover={{ scale: isLoading ? 1 : 1.1 }}
          whileTap={{ scale: isLoading ? 1 : 0.95 }}
        >
          {isLoading ? (
            <LoaderCircle className="animate-spin" size={20} />
          ) : (
            <ArrowUp size={20} />
          )}
        </motion.button>
      </form>
    </motion.div>
  );
}
