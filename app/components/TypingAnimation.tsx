// components/TypingAnimation.tsx
"use client";
import { motion, Variants } from "framer-motion";

// --- MODIFIED: Added container variants to orchestrate children animations ---
const containerVariants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.2, // Time delay between each dot animating
    },
  },
};

const dotVariants: Variants = {
  initial: {
    y: "0%",
  },
  animate: {
    y: "-100%",
    transition: {
      duration: 0.5,
      ease: "easeInOut",
      repeat: Infinity,
      repeatType: "reverse" as const, // ✅ explicitly a string literal
    },
  },
};

export default function TypingAnimation() {
  return (
    <div className="flex items-center space-x-3 px-4 py-2 rounded-md shadow-inner">
      <span className="text-sm font-medium text-text-secondary">Analyzing</span>
      <motion.div
        className="flex items-center space-x-2"
        variants={containerVariants}
        initial="initial"
        animate="animate"
      >
        {[...Array(3)].map((_, index) => (
          <motion.div
            key={index}
            className="h-2.5 w-2.5 rounded-full bg-[#0dd3ff] shadow-md"
            variants={dotVariants}
          />
        ))}
      </motion.div>
    </div>
  );
}
