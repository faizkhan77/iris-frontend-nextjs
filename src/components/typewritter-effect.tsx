import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface TypewriterProps {
  text?: string;
  speed?: number; // typing speed in ms
}

export const Typewriter: React.FC<TypewriterProps> = ({ text = "", speed = 50 }) => {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    if (!text) return;

    setDisplayedText(""); // reset when text changes
    let i = 0;

    const interval = setInterval(() => {
      setDisplayedText((prev) => {
        if (i < text.length) {
          const next = prev + text.charAt(i);
          i++;
          return next;
        } else {
          clearInterval(interval);
          return prev;
        }
      });
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed]);

  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="whitespace-pre-wrap"
    >
      {displayedText}
      {text && (
        <motion.span
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 0.8, repeat: Infinity }}
        >
          .
        </motion.span>
      )}
    </motion.span>
  );
};
