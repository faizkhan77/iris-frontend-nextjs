// components/ClarificationTabs.tsx
"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

interface ClarificationTabProps {
  title: string;
  options: { label: string; query: string }[];
  onOptionClick: (query: string) => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

export default function ClarificationTabs({
  title,
  options,
  onOptionClick,
}: ClarificationTabProps) {
  return (
    <div className="w-full">
      <h4 className="text-sm font-semibold text-gray-400 mb-2 px-2 flex items-center gap-2">
        <Sparkles size={16} className="text-yellow-400" />
        {title}
      </h4>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-wrap gap-2"
      >
        {options.map((option, index) => (
          <motion.button
            key={index}
            variants={itemVariants}
            onClick={() => onOptionClick(option.query)}
            className="text-sm font-medium px-3 py-1.5 rounded-full
                       bg-gray-700/50 text-gray-200 border border-gray-600
                       hover:bg-gray-600/70 hover:border-gray-500 transition-all
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {option.label}
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
}
