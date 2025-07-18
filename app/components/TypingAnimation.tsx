// components/TypingAnimation.tsx
"use client";
import { motion } from "framer-motion";

const dotVariants = {
  initial: { y: "0%" },
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
      //...
    >
      <motion.div className="h-2 w-2 bg-purple-400 rounded-full" /*...*/ />
      <motion.div className="h-2 w-2 bg-purple-400 rounded-full" /*...*/ />
      <motion.div className="h-2 w-2 bg-purple-400 rounded-full" /*...*/ />
    </motion.div>
  );
}
