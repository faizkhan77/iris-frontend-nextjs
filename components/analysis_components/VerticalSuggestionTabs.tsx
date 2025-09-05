// components/VerticalSuggestionTabs.tsx
"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

interface VerticalSuggestionTabsProps {
  title: string;
  options: { label: string; query: string }[];
  onOptionClick: (query: string) => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08, // A little faster stagger
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { x: -20, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24,
    },
  },
};

export default function VerticalSuggestionTabs({
  title,
  options,
  onOptionClick,
}: VerticalSuggestionTabsProps) {
  return (
    <div className="w-full max-w-md my-2">
      <h4 className="text-sm font-semibold text-gray-400 mb-3 px-1 flex items-center gap-2">
        <Sparkles size={16} className="text-yellow-400" />
        {title}
      </h4>
      <motion.ul
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col gap-2"
      >
        {options.map((option, index) => (
          <motion.li key={index} variants={itemVariants}>
            <button
              onClick={() => onOptionClick(option.query)}
              className="w-full text-left text-sm font-medium px-4 py-3 rounded-lg
                         bg-gray-800/60 text-gray-200 border border-gray-700
                         hover:bg-gray-700/80 hover:border-blue-500 transition-all
                         focus:outline-none focus:ring-2 focus:ring-blue-500
                         flex justify-between items-center group"
            >
              <span>{option.label}</span>
              <ArrowRight
                size={16}
                className="text-gray-500 opacity-0 group-hover:opacity-100 
                           transform group-hover:translate-x-1 transition-all duration-300"
              />
            </button>
          </motion.li>
        ))}
      </motion.ul>
    </div>
  );
}
