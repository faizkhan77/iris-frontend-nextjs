import React from 'react';

// You can define the props for the component if you need to pass down handlers
interface ActionButtonsProps {
  onShare?: () => void;
  onLike?: () => void;
  onDislike?: () => void;
  onCopy?: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ onShare, onLike, onDislike, onCopy }) => {
  return (
    <div className="flex items-center gap-4 mt-4">
      {/* Share Button */}
      <button 
        onClick={onShare} 
        className="text-gray-400 hover:text-gray-200 transition-colors duration-200"
        aria-label="Share"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
        </svg>
      </button>

      {/* Like Button */}
      <button 
        onClick={onLike} 
        className="text-gray-400 hover:text-gray-200 transition-colors duration-200"
        aria-label="Like"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.085a2 2 0 00-1.736.97l-2.714 4.223M7 20h-2a2 2 0 01-2-2v-6a2 2 0 012-2h2v10z" />
        </svg>
      </button>
      
      {/* Dislike Button */}
      <button 
        onClick={onDislike} 
        className="text-gray-400 hover:text-gray-200 transition-colors duration-200"
        aria-label="Dislike"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.738 3h4.017c.163 0 .326.02.485.06L17 4m-7 10v6a2 2 0 002 2h.085a2 2 0 001.736-.97l2.714-4.223M17 4h2a2 2 0 012 2v6a2 2 0 01-2 2h-2V4z" />
        </svg>
      </button>

      {/* Copy Button */}
      <button 
        onClick={onCopy} 
        className="text-gray-400 hover:text-gray-200 transition-colors duration-200"
        aria-label="Copy"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      </button>
    </div>
  );
};

export default ActionButtons;