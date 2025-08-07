"use client";

import React, { useState } from "react";
import { Sparkles, AlertTriangle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface GeminiSummarizeButtonProps {
  sectionTitle: string;
  onSummarizeRequest: () => Promise<string | void>;
}

export default function GeminiSummarizeButton({
  sectionTitle,
  onSummarizeRequest,
}: GeminiSummarizeButtonProps) {
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleClick = async () => {
    setIsSummarizing(true);
    setError(null);
    setSummary(null);
    try {
      const result = await onSummarizeRequest();
      if (typeof result === "string") {
        setSummary(result);
        // In a real app, you would display this summary in a modal or alert
        alert(`Summary for ${sectionTitle}:\n\n${result}`);
      }
    } catch (err: any) {
      setError(err.message || "An unknown error occurred.");
      console.error(`Failed to summarize ${sectionTitle}:`, err);
    } finally {
      setIsSummarizing(false);
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={handleClick}
            disabled={isSummarizing}
            className="p-1.5 rounded-md hover:bg-element-bg disabled:opacity-50 disabled:cursor-wait transition-colors"
          >
            {isSummarizing ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-text-secondary border-t-accent" />
            ) : error ? (
              <AlertTriangle className="h-4 w-4 text-red-500" />
            ) : (
              <Sparkles className="h-4 w-4 text-accent" />
            )}
          </button>
        </TooltipTrigger>
        <TooltipContent className="bg-element-bg-hover border-element-border text-text-primary">
          <p>{error ? `Error: ${error}` : `Summarize ${sectionTitle}`}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
