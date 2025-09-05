// In components/genui/ShareholdingDetailsCard.tsx

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { ShareholdingPieChart } from "../charts/ShareholdingPieChart";
import ReactMarkdown from "react-markdown";

// --- Data Structures (The Contract with the Backend) ---
export interface ShareholderHistory {
  date: string;
  percentage: number;
  num_of_shares: number;
  subcategory?: string;
}

export interface Shareholder {
  srno: number;
  name: string;
  percentage: number;
  history: ShareholderHistory[];
}

export interface CategoryDetail {
  categoryName: string;
  totalPercentage: number;
  shareholders: Shareholder[];
}

export interface ShareholdingDetailsData {
  pieChartInterpretation: string;
  keyTakeaways: string;
  pieChartData: { name: string; value: number }[];
  categoryDetails: CategoryDetail[];
}

// --- Reusable Accordion Component ---
const AccordionSection = ({
  title,
  rightContent,
  children,
  defaultOpen = false,
}: {
  title: React.ReactNode;
  rightContent?: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-element-border">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full justify-between items-center py-3 text-left font-medium text-text-primary hover:bg-element-bg/50 px-2 rounded-t-md"
      >
        <div className="flex items-center gap-2">{title}</div>
        <div className="flex items-center gap-2">
          {rightContent}
          <ChevronDown
            size={18}
            className={cn("transition-transform duration-200", {
              "rotate-180": isOpen,
            })}
          />
        </div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden bg-element-bg/30 rounded-b-md"
          >
            <div className="p-4">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- Shareholder History Table Component ---
const ShareholderHistoryTable = ({
  history,
}: {
  history: ShareholderHistory[];
}) => {
  return (
    <div className="bg-background p-3 rounded-lg mt-2">
      <table className="w-full text-xs">
        <thead className="text-text-tertiary">
          <tr className="border-b border-element-border">
            <th className="text-left font-normal p-2">Date</th>
            <th className="text-right font-normal p-2">Percentage</th>
            <th className="text-right font-normal p-2">Num. of Shares</th>
            <th className="text-left font-normal p-2 hidden sm:table-cell">
              Subcategory
            </th>
          </tr>
        </thead>
        <tbody className="text-text-secondary">
          {history.map((item, index) => {
            const prevItem = history[index + 1]; // History is sorted desc, so previous is next in array
            const change = prevItem ? item.percentage - prevItem.percentage : 0;
            return (
              <tr
                key={item.date}
                className="border-b border-element-border/50 last:border-none"
              >
                <td className="p-2">
                  {new Date(item.date).toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  })}
                </td>
                <td className="p-2 text-right">
                  <div className="flex items-center justify-end gap-1.5 font-medium">
                    {change > 0.001 && (
                      <ArrowUpRight size={12} className="text-green-500" />
                    )}
                    {change < -0.001 && (
                      <ArrowDownRight size={12} className="text-red-500" />
                    )}
                    <span
                      className={cn({
                        "text-green-500": change > 0,
                        "text-red-500": change < 0,
                        "text-text-primary": change === 0,
                      })}
                    >
                      {item.percentage.toFixed(2)}%
                    </span>
                  </div>
                </td>
                <td className="p-2 text-right font-mono">
                  {item.num_of_shares.toLocaleString("en-IN")}
                </td>
                <td className="p-2 hidden sm:table-cell">{item.subcategory}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

// --- Main Card Component ---
export function ShareholdingDetailsCard({
  title,
  data,
}: {
  title: string;
  data: ShareholdingDetailsData;
}) {
  return (
    <div className="w-full text-sm">
      <p className="text-text-secondary mb-4 px-2">
        {data.pieChartInterpretation}
      </p>

      <AccordionSection title="Ownership Summary" defaultOpen={true}>
        <ShareholdingPieChart data={data.pieChartData} title="" />
      </AccordionSection>

      <div className="mt-4 space-y-1">
        {data.categoryDetails.map((category) => (
          <AccordionSection
            key={category.categoryName}
            title={
              <span className="text-cyan-400">{category.categoryName}</span>
            }
            rightContent={
              <span className="font-bold text-text-primary bg-element-bg px-2 py-1 text-xs rounded-md">
                {category.totalPercentage.toFixed(2)}%
              </span>
            }
          >
            <p className="text-xs text-text-tertiary mb-3">
              Top {category.shareholders.length} Shareholders
            </p>
            <div className="space-y-1">
              {category.shareholders.map((holder) => (
                <AccordionSection
                  key={holder.name}
                  title={
                    <div className="flex flex-col text-left">
                      <span className="text-sm font-normal text-text-primary">
                        {holder.name}
                      </span>
                    </div>
                  }
                  rightContent={
                    <span className="text-xs font-semibold text-text-secondary">
                      {holder.percentage.toFixed(2)}%
                    </span>
                  }
                >
                  <ShareholderHistoryTable history={holder.history} />
                </AccordionSection>
              ))}
            </div>
          </AccordionSection>
        ))}
      </div>

      <div className="mt-8 pt-6 border-t border-dashed border-element-border">
        <h3 className="text-base font-semibold text-text-primary mb-2">
          Key Takeaways
        </h3>
        <div className="text-text-secondary prose prose-sm max-w-none prose-p:my-1">
          <ReactMarkdown>{data.keyTakeaways}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
