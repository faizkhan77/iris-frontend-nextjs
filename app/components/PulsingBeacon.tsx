// components/PulsingBeacon.tsx
"use client";
import { motion } from "framer-motion";

export default function PulsingBeacon() {
  return (
    <motion.div
      className="flex items-center justify-center"
      transition={{
        staggerChildren: 0.1,
      }}
    >
      <motion.div
        className="w-2 h-2 rounded-full bg-gray-500"
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.7, 1, 0.7],
        }}
        transition={{
          duration: 1.2,
          ease: "easeInOut",
          repeat: Infinity,
        }}
      />
    </motion.div>
  );
}
