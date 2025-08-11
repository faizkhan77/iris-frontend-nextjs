import React from 'react';

interface CombineModeBarProps {
  selectedCount: number;
  onSave: () => void;
  onCancel: () => void;
}

const CombineModeBar: React.FC<CombineModeBarProps> = ({ selectedCount, onSave, onCancel }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-brand-container border-t border-brand-border z-40">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <p className="text-brand-text-primary font-medium">
            <span className="text-brand-primary font-bold">{selectedCount}</span> screen{selectedCount !== 1 && 's'} selected
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium rounded-lg bg-neutral-800 text-brand-text-primary hover:bg-neutral-700 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onSave}
              disabled={selectedCount < 2}
              className="px-4 py-2 text-sm font-medium rounded-lg bg-brand-primary text-black hover:bg-opacity-80 transition-colors disabled:bg-neutral-600 disabled:text-neutral-400 disabled:cursor-not-allowed"
            >
              Save Combination
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CombineModeBar;