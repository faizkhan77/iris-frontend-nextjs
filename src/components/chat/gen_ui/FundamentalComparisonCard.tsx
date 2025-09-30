// --- START OF FILE FundamentalComparisonCard.tsx ---

import { useState } from "react";
import { motion } from "framer-motion";
import { StockPriceChart } from "../../charts/StockPriceChart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowUp } from "lucide-react";

// --- Type Definitions for the new component's props ---
type DetailItem = {
  label: string;
  value: string | number;
};

type CompanyData = {
  companyName: string;
  chartInterpretation1Y?: string;
  chartInterpretation6M?: string;
  chartInterpretation3M?: string;
  priceChartData?: any[];
  detailsTable?: DetailItem[];
  finalVerdict?: string;
  recommendation?: string;
};

export type FundamentalComparisonCardProps = {
  title: string;
  data: {
    comparisonData: [CompanyData, CompanyData];
    finalSuggestion?: string;
    preferredCompany?: string;
  };
};

// --- Main Component ---
export function FundamentalComparisonCard({
  title,
  data: { comparisonData, finalSuggestion, preferredCompany },
}: FundamentalComparisonCardProps) {
  const [company1, company2] = comparisonData;

  // State for the mini charts
  const [timeRange1, setTimeRange1] = useState<"1y" | "6m" | "3m">("1y");
  const [timeRange2, setTimeRange2] = useState<"1y" | "6m" | "3m">("1y");

  const metricLabels = company1.detailsTable?.map((item) => item.label) || [];

  const formatValue = (value: string | number) => {
    if (typeof value !== "number") return value;
    if (value > 1_00_00_000) return `${(value / 1_00_00_000).toFixed(2)} Cr`;
    if (value > 1_00_000) return `${(value / 1_00_000).toFixed(2)} L`;
    return value.toLocaleString("en-IN", { maximumFractionDigits: 2 });
  };

  return (
    <div className="w-full rounded-lg bg-accent/20 border my-2 text-sm">
      <div className="p-5">
        <h2 className="text-lg font-semibold text-text-primary mb-4">
          {title}
        </h2>

        {/* Side-by-Side Mini Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="border rounded-md p-2 bg-background/20">
            <StockPriceChart
              data={company1.priceChartData || []}
              title={company1.companyName}
              timeRange={timeRange1}
              setTimeRange={setTimeRange1}
            />
          </div>
          <div className="border rounded-md p-2 bg-background/20">
            <StockPriceChart
              data={company2.priceChartData || []}
              title={company2.companyName}
              timeRange={timeRange2}
              setTimeRange={setTimeRange2}
            />
          </div>
        </div>

        {/* Comparison Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-element-border">
                <th className="py-2 px-3 text-left font-semibold text-text-secondary text-xs">
                  Metric
                </th>
                <th className="py-2 px-3 text-right font-semibold text-text-primary text-xs">
                  {company1.companyName}
                </th>
                <th className="py-2 px-3 text-right font-semibold text-text-primary text-xs">
                  {company2.companyName}
                </th>
              </tr>
            </thead>
            <tbody>
              {metricLabels.map((label, index) => {
                const value1 = company1.detailsTable?.[index]?.value ?? "N/A";
                const value2 = company2.detailsTable?.[index]?.value ?? "N/A";
                const isBetter =
                  typeof value1 === "number" && typeof value2 === "number"
                    ? value1 > value2
                    : false;

                return (
                  <tr
                    key={label}
                    className="border-b border-element-border last:border-b-0"
                  >
                    <td className="py-3 px-3 text-text-secondary text-xs">
                      {label}
                    </td>
                    <td
                      className={cn("py-3 px-3 text-right font-medium", {
                        "text-success": isBetter,
                      })}
                    >
                      {formatValue(value1)}
                    </td>
                    <td
                      className={cn("py-3 px-3 text-right font-medium", {
                        "text-success": !isBetter,
                      })}
                    >
                      {formatValue(value2)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Verdict & Recommendation Tabs */}
      <div className="bg-background/20 p-5 border-t border-element-border">
        <Tabs defaultValue={company1.companyName} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value={company1.companyName}>
              {company1.companyName}
            </TabsTrigger>
            <TabsTrigger value={company2.companyName}>
              {company2.companyName}
            </TabsTrigger>
          </TabsList>
          {/* --- START: FIX FOR COMPANY 1 --- */}
          <TabsContent value={company1.companyName} className="mt-4">
            <div className="prose prose-sm max-w-none text-text-secondary prose-p:my-1">
              <ReactMarkdown>
                {`${company1.finalVerdict}\n\n${company1.recommendation}`}
              </ReactMarkdown>
            </div>
          </TabsContent>
          {/* --- END: FIX FOR COMPANY 1 --- */}

          {/* --- START: FIX FOR COMPANY 2 --- */}
          <TabsContent value={company2.companyName} className="mt-4">
            <div className="prose prose-sm max-w-none text-text-secondary prose-p:my-1">
              <ReactMarkdown>
                {`${company2.finalVerdict}\n\n${company2.recommendation}`}
              </ReactMarkdown>
            </div>
          </TabsContent>
          {/* --- END: FIX FOR COMPANY 2 --- */}
        </Tabs>
      </div>

      {/* Final Suggestion & Actions */}
      {finalSuggestion && (
        <div className="p-5 border-t border-element-border">
          <h3 className="text-base font-semibold text-text-primary mb-2">
            Head-to-Head
          </h3>
          <p className="text-text-secondary prose prose-sm max-w-none prose-p:my-1 mb-4">
            {finalSuggestion}
          </p>
          <div className="flex gap-4">
            <Button
              variant={
                preferredCompany === company1.companyName
                  ? "success"
                  : "outline"
              }
              className="flex-1"
            >
              <ArrowUp className="mr-2 h-4 w-4" /> Buy {company1.companyName}
            </Button>
            <Button
              variant={
                preferredCompany === company2.companyName
                  ? "success"
                  : "outline"
              }
              className="flex-1"
            >
              <ArrowUp className="mr-2 h-4 w-4" /> Buy {company2.companyName}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
