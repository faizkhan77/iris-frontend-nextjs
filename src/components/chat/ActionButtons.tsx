import {
  ArrowDown,
  ArrowDownCircle,
  Copy,
  Download,
  DownloadCloud,
  Share,
  Share2,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";
import React from "react";

// You can define the props for the component if you need to pass down handlers
interface ActionButtonsProps {
  onShare?: () => void;
  onLike?: () => void;
  onDislike?: () => void;
  onCopy?: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  onShare,
  onLike,
  onDislike,
  onCopy,
}) => {
  return (
    <div className="flex items-center mt-2 ">
      {/* Share Button */}
      <button
        onClick={onShare}
        className="text-gray-400 p-2 hover:bg-muted rounded-md hover:text-gray-200 transition-colors duration-200"
        aria-label="Share"
      >
        <Share2 size={18} />
      </button>

      <button
        onClick={onShare}
        className="text-gray-400 p-2 hover:bg-muted rounded-md hover:text-gray-200 transition-colors duration-200"
        aria-label="Share"
      >
        <ArrowDownCircle size={18} />
      </button>

      {/* Like Button */}
      <button
        onClick={onLike}
        className="text-gray-400 p-2 hover:bg-muted rounded-md hover:text-gray-200 transition-colors duration-200"
        aria-label="Like"
      >
        <ThumbsUp size={18} />
      </button>

      {/* Dislike Button */}
      <button
        onClick={onDislike}
        className="text-gray-400 p-2 hover:bg-muted rounded-md hover:text-gray-200 transition-colors duration-200"
        aria-label="Dislike"
      >
        <ThumbsDown size={18} />
      </button>

      {/* Copy Button */}
      <button
        onClick={onCopy}
        className="text-gray-400 p-2 hover:bg-muted rounded-md hover:text-gray-200 transition-colors duration-200"
        aria-label="Copy"
      >
        <Copy size={18} />
      </button>
    </div>
  );
};

export default ActionButtons;
