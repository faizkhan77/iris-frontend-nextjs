import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

interface ClarificationTabProps {
  title: string;
  data: { label: string; query: string }[];
  onOptionClick: (query: string) => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { y: 10, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

export default function ClarificationTabs({
  title,
  data,
  onOptionClick,
}: ClarificationTabProps) {
  return (
    <div className="w-full my-4">
      <h4 className="text-xs font-semibold mb-3 px-2 flex items-center gap-2 text-gray-600 dark:text-gray-300 uppercase tracking-wide">
        <Sparkles size={14} className="text-yellow-400" />
        {title}
      </h4>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-wrap gap-3"
      >
        {data?.map((option, index) => (
          <motion.button
            key={index}
            variants={itemVariants}
            onClick={() => onOptionClick(option.query)}
            className="relative flex items-center gap-2 px-4 py-2 min-w-[120px] rounded-lg
                       bg-gradient-to-br from-gray-100/80 to-gray-200/80 dark:from-gray-800/70 dark:to-gray-700/70
                       border-l-4 border-cyan-400 dark:border-cyan-500
                       text-gray-800 dark:text-gray-100
                       shadow-sm dark:shadow-md
                       hover:bg-gray-200/60 dark:hover:bg-gray-700/60
                       transition-colors duration-300 overflow-hidden"
          >
            <Sparkles size={12} className="text-yellow-400 flex-shrink-0" />
            <span className="truncate">{option.label}</span>

            {/* subtle neon shimmer effect on hover */}
            <span
              className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-cyan-400/10 to-cyan-500/20 
                             opacity-0 hover:opacity-30 pointer-events-none transition-opacity duration-300 rounded-lg"
            ></span>
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
}
