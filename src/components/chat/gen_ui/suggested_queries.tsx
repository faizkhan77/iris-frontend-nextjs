import React from 'react';

interface SuggestedQueriesProps {
  title?: string;
  data: string[];
  onOptionClick: (query: string) => void;
}

const SuggestedQueries: React.FC<SuggestedQueriesProps> = ({ title, data, onOptionClick }) => {
  return (
    // Reduced top margin for a tighter layout
    <div className="my-4">
      {/* Title is now extra small (text-xs) and has less bottom margin */}
      {title && (
        <h2 className="text-xs font-medium text-gray-500">
          {title}
        </h2>
      )}
      
      {/* Reduced gap between buttons */}
      <div className="flex flex-wrap gap-1.5">
        {data?.map((query: string, index: number) => (
          <button
            key={index}
            onClick={() => onOptionClick(query)}
            className="bg-transparent border border-gray-700 text-gray-400 px-3 py-1 rounded-full text-xs 
                       hover:bg-gray-800 hover:border-gray-600 transition-colors duration-200"
          >
            {query}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SuggestedQueries;