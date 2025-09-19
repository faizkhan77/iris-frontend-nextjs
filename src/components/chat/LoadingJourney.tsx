import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

import TypingAnimation from "./TypingAnimation";
import { journeys } from "./constant";
import { Bot } from "lucide-react";

journeys.save_ltm = {
  steps: [{ text: "Saving to memory...", duration: 2000 }],
  icon: Bot,
};

type JourneyKey = keyof typeof journeys;

interface LoadingJourneyProps {
  route: string;
}

export default function LoadingJourney({ route }: LoadingJourneyProps) {
  const journey = journeys[route as JourneyKey] || journeys.unknown;
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentStep((prev) => (prev + 1) % journey.steps.length);
    }, journey.steps[currentStep].duration);

    return () => clearTimeout(timer);
  }, [currentStep, journey]);

  return (
    <div className="mt-4 space-y-3">
      {/* Typing dots animation */}
      {/* <TypingAnimation /> */}

      <div className="flex items-center text-xs sm:text-sm text-text-secondary pl-4">
        {/* Animated icon */}
        <div className="flex h-6 w-6 items-center justify-center mr-3">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, scale: 0.5, rotate: -15 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.5, rotate: 15 }}
              transition={{ duration: 0.4 }}
              className="drop-shadow-lg"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{
                  repeat: Infinity,
                  duration: 1.8,
                  ease: "easeInOut",
                }}
              >
                <journey.icon size={18} className="text-cyan-400" />
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Step text */}
        <div className="overflow-hidden">
          {" "}
          {/* Add a container to hide the text before it enters */}
          {/* Step text */}
          <AnimatePresence mode="wait">
            <motion.p
              key={currentStep}
              initial={{ y: 8, opacity: 0 }} // Enter from below, invisible
              animate={{ y: 0, opacity: 1 }} // Move into place, fade in
              exit={{ y: -8, opacity: 0 }} // Exit upward, fade out
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="font-mono tracking-wide text-text-primary"
            >
              {journey.steps[currentStep].text}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
