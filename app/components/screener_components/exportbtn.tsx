// components/ExportBtn.tsx
import React from "react";

// --- ADDED: onClick prop to make the button functional ---
interface ExportBtnProps {
  onClick: () => void;
}

// --- UPDATED: The component now accepts props ---
const ExportBtn: React.FC<ExportBtnProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="relative border-0 text-text-primary text-[15px] font-semibold cursor-pointer rounded z-[1] group"
    >
      {/* --- MODIFIED: Main button face --- */}
      <div className="flex items-center justify-between gap-[10px] min-h-[40px] px-[10px] rounded z-[1] bg-neutral-800 border border-brand-border transition-all duration-[500ms] ease-[cubic-bezier(0.77,0,0.175,1)] group-hover:shadow-lg">
        {/* --- REPLACED: New Excel/Table Icon --- */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="20"
          height="20"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M4 6h16M4 12h16M4 18h16" />
          <path d="M6 4v16M12 4v16M18 4v16" />
        </svg>
        {/* --- CHANGED: Text updated --- */}
        Export Excel
      </div>

      {/* --- MODIFIED: Animated hover section --- */}
      <div className="absolute inset-0 flex items-center justify-center max-w-[90%] mx-auto z-[-1] rounded transform translate-y-0 bg-cyan-500 border border-cyan-500/20 transition-all duration-[500ms] ease-[cubic-bezier(0.77,0,0.175,1)] group-hover:translate-y-full">
        {/* --- Unchanged: Download Icon --- */}
        <svg
          viewBox="0 0 24 24"
          width="24"
          height="24"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="animate-bounce"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
          <polyline points="7 10 12 15 17 10"></polyline>
          <line x1="12" y1="15" x2="12" y2="3"></line>
        </svg>
      </div>
    </button>
  );
};

export default ExportBtn;
