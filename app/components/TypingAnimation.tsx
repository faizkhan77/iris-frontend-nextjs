// components/TypingAnimation.tsx
"use client";
import { motion } from "framer-motion";

// --- MODIFIED: Added container variants to orchestrate children animations ---
const containerVariants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.2, // Time delay between each dot animating
    },
  },
};

const dotVariants = {
  initial: {
    y: "0%",
  },
  animate: {
    y: "-100%",
    transition: {
      duration: 0.5,
      ease: "easeInOut",
      repeat: Infinity,
      repeatType: "reverse",
    },
  },
};

export default function TypingAnimation() {
  return (
    <motion.div
      className="flex items-center space-x-1.5 p-2"
      // --- MODIFIED: Added variants to the container ---
      variants={containerVariants}
      initial="initial"
      animate="animate"
    >
      {/* --- MODIFIED: Each dot now uses variants to be animated by the parent --- */}
      <motion.div
        className="h-2 w-2 bg-purple-400 rounded-full"
        variants={dotVariants}
      />
      <motion.div
        className="h-2 w-2 bg-purple-400 rounded-full"
        variants={dotVariants}
      />
      <motion.div
        className="h-2 w-2 bg-purple-400 rounded-full"
        variants={dotVariants}
      />
    </motion.div>
  );
}
