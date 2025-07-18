// components/ChatMessages.tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import TypingAnimation from "./TypingAnimation"; // Make sure this exists

export interface Message {
  id: string; // Add ID for keying
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  isThinkingPlaceholder?: boolean;
}

interface ChatMessagesProps {
  messages: Message[];
}

const messageVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
  exit: { opacity: 0, x: -20, transition: { duration: 0.3, ease: "easeIn" } },
};

export default function ChatMessages({ messages }: ChatMessagesProps) {
  // ... (messageVariants and component definition are the same)
  return (
    <main className="w-full max-w-3xl px-4 md:px-6 py-6 space-y-1 flex-grow self-center">
      <AnimatePresence>
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            layout
            variants={messageVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={`flex flex-col ${
              msg.role === "user" ? "items-end" : "items-start"
            }`}
          >
            <div
              className={`max-w-[85%] md:max-w-[75%] px-4 py-2.5 rounded-2xl shadow-md break-words ${
                msg.role === "user"
                  ? "bg-[var(--chat-bubble-user)] text-white rounded-br-none"
                  : "bg-[var(--chat-bubble-ai)] text-gray-200 rounded-bl-none"
              }`}
            >
              {msg.isThinkingPlaceholder ? (
                <TypingAnimation />
              ) : (
                <>
                  {/* THIS IS THE FIX:
                                        1. Wrap ReactMarkdown in the 'prose' div.
                                        2. Remove whitespace-pre-wrap from the outer <p> tag.
                                    */}
                  <div className="prose prose-invert prose-sm md:prose-base max-w-none">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {msg.content}
                    </ReactMarkdown>
                  </div>
                  <p
                    className={`text-xs mt-1.5 opacity-70 ${
                      msg.role === "user"
                        ? "text-right text-purple-200"
                        : "text-left text-gray-500"
                    }`}
                  >
                    {msg.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </>
              )}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </main>
  );
}
