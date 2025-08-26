"use client";

import React from "react";
import GeminiSummarizeButton from "./GeminiSummarizeButton"; // <-- Use the real component

interface ChartCardProps {
  title: string;
  subtitle?: string;
  chartRef?:  React.RefObject<HTMLDivElement | null>;
  controls?: React.ReactNode;
  children: React.ReactNode;
  onSummarizeRequest?: () => Promise<string | void>;
}

export default function ChartCard({
  title,
  subtitle,
  chartRef,
  controls,
  children,
  onSummarizeRequest,
}: ChartCardProps) {
  return (
    <div className="rounded-xl border border-element-border bg-content-bg shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 border-b border-element-border">
        <div>
          <h3 className="text-base font-semibold text-text-primary">{title}</h3>
          {subtitle && (
            <p className="text-xs text-text-secondary mt-1">{subtitle}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {controls}
          {onSummarizeRequest && (
            <GeminiSummarizeButton
              sectionTitle={title}
              onSummarizeRequest={onSummarizeRequest}
            />
          )}
        </div>
      </div>
      <div ref={chartRef} className="p-2 md:p-4 bg-content-bg rounded-b-xl">
        {children}
      </div>
    </div>
  );
}
