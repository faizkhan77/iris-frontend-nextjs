import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../ui/button";
import { Sparkles, ChevronLeft } from "lucide-react";
 
interface SuggestedQueriesProps {
  queries: string[];
}
 
const containerVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.2,
    },
  },
};
 
const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
    },
  },
};
 
const SuggestedQueries: React.FC<SuggestedQueriesProps> = ({ queries }) => {
  const [open, setOpen] = useState(false);
 
  const handleQueryClick = (query: string) => {
    console.log("Clicked suggested query:", query);
  };
 
  return (
    <div className="flex items-center gap-2 mb-3 relative">
      {/* Toggle Button */}
      <Button
        size="sm"
        variant="ghost"
        className="h-8 w-8 p-0 flex items-center justify-center rounded-full hover:bg-accent/40 transition-colors z-10"
        onClick={() => setOpen(!open)}
      >
        {open ? <ChevronLeft size={18} /> : <Sparkles size={18} />}
      </Button>
 
      {/* Animated Queries Row */}
      <AnimatePresence>
        {open && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, x: -20 }}
            className="flex items-center gap-2 overflow-x-auto no-scrollbar relative"
          >
            {queries.map((query, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="flex-shrink-0"
              >
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs h-7 px-3 rounded-full shadow-sm hover:scale-105 transition-transform whitespace-nowrap"
                  onClick={() => handleQueryClick(query)}
                >
                  {query}
                </Button>
              </motion.div>
            ))}
 
            {/* Gradient fade edges */}
            <div className="pointer-events-none absolute left-0 top-0 h-full w-6 bg-gradient-to-r from-background to-transparent" />
            <div className="pointer-events-none absolute right-0 top-0 h-full w-6 bg-gradient-to-l from-background to-transparent" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
 
export default SuggestedQueries;