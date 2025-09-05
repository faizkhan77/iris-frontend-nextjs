// components/TypingAnimation.tsx
"use client";
import { motion, Variants, useAnimation } from "framer-motion";
import { useEffect } from "react";

const dotVariants: Variants = {
  animate: {
    y: ["0%", "-100%", "0%"], // smoother bounce loop
    transition: {
      duration: 0.8,
      ease: "easeInOut",
      repeat: Infinity,
    },
  },
};

export default function TypingAnimation() {
  const controls = useAnimation();

  useEffect(() => {
    // Start animation explicitly on mount
    controls.start("animate");
  }, [controls]);

  return (
    <div className="flex items-center space-x-3 px-4 py-2 rounded-md shadow-inner">
      <span className="text-sm font-medium text-text-secondary">Analyzing</span>
      <div className="flex items-center space-x-2">
        {[...Array(3)].map((_, index) => (
          <motion.div
            key={index}
            className="h-2.5 w-2.5 rounded-full bg-[#0dd3ff] shadow-md"
            variants={dotVariants}
            animate={controls}
          />
        ))}
      </div>
    </div>
  );
}
