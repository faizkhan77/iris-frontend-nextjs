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
        Export Excel
      </div>
    </button>
  );
};

export default ExportBtn;
