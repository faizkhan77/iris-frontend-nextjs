import { motion, useAnimation, type Variants } from "framer-motion";
import { useEffect } from "react";

const containerVariants: Variants = {
  animate: {
    transition: {
      staggerChildren: 0.2, // This will apply a delay between each child animation
    },
  },
};

const dotVariants: Variants = {
  animate: {
    opacity: [0.5, 1, 0.5], // Fades from 50% opacity to 100% and back to 50%
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
    controls.start("animate");
  }, [controls]);

  return (
    <div className="bg-accent/20 text-sm border max-w-xl px-2 flex w-fit items-center gap-2 rounded-lg">
      <div className="flex items-end space-x-3 px-2 py-2 rounded-md">
        <span className="text-sm font-medium text-text-secondary">
          Analyzing
        </span>
        <motion.div
          className="flex gap-1"
          variants={containerVariants}
          initial="initial"
          animate={controls}
        >
          {[...Array(3)].map((_, index) => (
            <motion.div
              key={index}
              className="h-1.5 w-1.5 mb-1 rounded-full bg-[#0dd3ff] shadow-md opacity-65"
              variants={dotVariants}
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
}
