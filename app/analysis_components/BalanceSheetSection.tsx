"use client";

import React, { useRef, useCallback, useMemo } from "react";
import { useTheme } from "next-themes";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import * as htmlToImage from "html-to-image";
import ChartCard from "./ChartCard";
import {
  ChartContainer,
  ChartTooltipContent,
  ChartConfig,
} from "@/components/ui/chart";
import { cn } from "@/lib/utils";

// Define data shapes
interface BSData {
  year: string;
  [key: string]: any;
}
interface ChartData {
  name: string;
  [key: string]: any;
}
interface BalanceSheetSectionProps {
  balanceSheetData: BSData[];
  liabilitiesChartData: ChartData[];
  assetsChartData: ChartData[];
  stockName: string;
}

const chartConfig = {
  "Equity Capital": { label: "Equity", color: "hsl(var(--chart-1))" },
  Reserves: { label: "Reserves", color: "hsl(var(--chart-2))" },
  Borrowings: { label: "Borrowings", color: "hsl(var(--chart-3))" },
  "Other Liabilities": { label: "Other Liab.", color: "hsl(var(--chart-4))" },
  "Fixed Assets": { label: "Fixed Assets", color: "hsl(var(--chart-1))" },
  CWIP: { label: "CWIP", color: "hsl(var(--chart-2))" },
  Investments: { label: "Investments", color: "hsl(var(--chart-3))" },
  "Other Assets": { label: "Other Assets", color: "hsl(var(--chart-4))" },
} satisfies ChartConfig;

export default function BalanceSheetSection({
  balanceSheetData,
  liabilitiesChartData,
  assetsChartData,
  stockName,
}: BalanceSheetSectionProps) {
  const liabilitiesChartRef = useRef<HTMLDivElement>(null);
  const assetsChartRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  const chartColors = useMemo(() => {
    // Using HSL values from globals.css for shadcn chart colors
    return {
      c1: `hsl(var(--chart-1))`,
      c2: `hsl(var(--chart-2))`,
      c3: `hsl(var(--chart-3))`,
      c4: `hsl(var(--chart-4))`,
      c5: `hsl(var(--chart-5))`,
    };
  }, [theme]);

  const onSummarizeRequest = useCallback(async (): Promise<string | void> => {
    console.log("Summarizing Balance Sheet...");
    return `Summary for ${stockName} balance sheet...`; // Placeholder
  }, [stockName]);

  const hasData = balanceSheetData && balanceSheetData.length > 0;
  if (!hasData) {
    return (
      <ChartCard title="Balance Sheet">
        <div className="flex h-40 items-center justify-center text-text-secondary">
          No balance sheet data available.
        </div>
      </ChartCard>
    );
  }

  const tableHeaders = [
    { key: "equityCapital", label: "Equity Capital" },
    { key: "reserves", label: "Reserves" },
    { key: "borrowings", label: "Borrowings" },
    { key: "otherLiabilities", label: "Other Liabilities" },
    { key: "totalLiabilities", label: "Total Liabilities", isTotal: true },
    { key: "fixedAssets", label: "Fixed Assets" },
    { key: "cwip", label: "CWIP" },
    { key: "investments", label: "Investments" },
    { key: "otherAssets", label: "Other Assets" },
    { key: "totalAssets", label: "Total Assets", isTotal: true },
  ];

  const years = balanceSheetData.map((bs) => bs.year);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-text-primary">Balance Sheet</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="Liabilities Composition (Cr)"
          chartRef={liabilitiesChartRef}
        >
          <div className="h-[300px] w-full">
            <ChartContainer config={chartConfig} className="w-full h-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={liabilitiesChartData}
                  margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="var(--element-border)"
                  />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 10 }}
                    stroke="var(--text-secondary)"
                  />
                  <YAxis
                    tick={{ fontSize: 10 }}
                    stroke="var(--text-secondary)"
                  />
                  <Tooltip content={<ChartTooltipContent indicator="dot" />} />
                  <Legend wrapperStyle={{ fontSize: "12px" }} />
                  <Bar
                    dataKey="Equity Capital"
                    stackId="a"
                    fill="var(--color-Equity Capital)"
                    name="Equity"
                  />
                  <Bar
                    dataKey="Reserves"
                    stackId="a"
                    fill="var(--color-Reserves)"
                    name="Reserves"
                  />
                  <Bar
                    dataKey="Borrowings"
                    stackId="a"
                    fill="var(--color-Borrowings)"
                    name="Borrowings"
                  />
                  <Bar
                    dataKey="Other Liabilities"
                    stackId="a"
                    fill="var(--color-Other Liabilities)"
                    name="Other Liab."
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </ChartCard>

        <ChartCard title="Assets Composition (Cr)" chartRef={assetsChartRef}>
          <div className="h-[300px] w-full">
            <ChartContainer config={chartConfig} className="w-full h-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={assetsChartData}
                  margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="var(--element-border)"
                  />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 10 }}
                    stroke="var(--text-secondary)"
                  />
                  <YAxis
                    tick={{ fontSize: 10 }}
                    stroke="var(--text-secondary)"
                  />
                  <Tooltip content={<ChartTooltipContent indicator="dot" />} />
                  <Legend wrapperStyle={{ fontSize: "12px" }} />
                  <Bar
                    dataKey="Fixed Assets"
                    stackId="a"
                    fill="var(--color-Fixed Assets)"
                    name="Fixed Assets"
                  />
                  <Bar
                    dataKey="CWIP"
                    stackId="a"
                    fill="var(--color-CWIP)"
                    name="CWIP"
                  />
                  <Bar
                    dataKey="Investments"
                    stackId="a"
                    fill="var(--color-Investments)"
                    name="Investments"
                  />
                  <Bar
                    dataKey="Other Assets"
                    stackId="a"
                    fill="var(--color-Other Assets)"
                    name="Other Assets"
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </ChartCard>
      </div>
      <div className="overflow-x-auto rounded-lg border border-element-border shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-element-bg/50">
            <tr>
              <th className="sticky left-0 bg-element-bg/50 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-text-secondary"></th>
              {years.map((year) => (
                <th
                  key={year}
                  className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-text-secondary"
                >
                  {year}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-content-bg divide-y divide-element-border">
            {tableHeaders.map((header) => (
              <tr
                key={header.key}
                className={cn(
                  "hover:bg-element-bg/50",
                  header.isTotal && "bg-element-bg/30"
                )}
              >
                <td
                  className={cn(
                    "sticky left-0 px-4 py-3 whitespace-nowrap font-semibold text-text-primary",
                    header.isTotal
                      ? "bg-element-bg"
                      : "bg-content-bg group-hover:bg-element-bg/50"
                  )}
                >
                  {header.label}
                </td>
                {balanceSheetData.map((bs) => (
                  <td
                    key={`${bs.year}-${header.key}`}
                    className={cn(
                      "px-4 py-3 text-right whitespace-nowrap text-text-secondary",
                      header.isTotal && "font-bold text-text-primary"
                    )}
                  >
                    {bs[header.key] ?? "N/A"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
