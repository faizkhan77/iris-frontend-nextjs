import React from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, LineChart } from "lucide-react";

interface SuggestedQueriesProps {
  title?: string;
  data: string[];
  onOptionClick: (query: string) => void;
}

const icons = [TrendingUp, TrendingDown, LineChart];

const SuggestedQueries: React.FC<SuggestedQueriesProps> = ({
  title = "Next Suggested Queries",
  data,
  onOptionClick,
}) => {
  return (
    <div className="my-6">
      {/* Title with cyan accent */}
      {title && (
        <h2 className="text-sm font-semibold text-cyan-400 mb-3 tracking-wide uppercase">
          {title}
        </h2>
      )}

      <div className="flex flex-wrap gap-2">
        {data?.map((query: string, index: number) => {
          const Icon = icons[index % icons.length];
          return (
            <motion.button
              key={index}
              onClick={() => onOptionClick(query)}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="relative flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium 
                         text-gray-200 bg-gradient-to-r from-gray-900/80 to-gray-800/80 backdrop-blur-md
                         border border-gray-700 shadow-md
                         hover:from-cyan-900/60 hover:to-cyan-800/60 hover:text-cyan-300
                         hover:scale-105 hover:shadow-cyan-500/30
                         transition-all duration-300 group"
            >
              <Icon className="w-3.5 h-3.5 text-cyan-400" />
              {query}

              {/* subtle cyan underline effect */}
              <span
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-cyan-400 
                               transition-all duration-300 group-hover:w-4/5"
              ></span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default SuggestedQueries;
