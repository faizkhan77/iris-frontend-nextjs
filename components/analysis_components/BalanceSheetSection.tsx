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
    // We use two distinct palettes for Liabilities and Assets
    if (theme === "light") {
      return {
        // Liabilities (cooler tones)
        equity: "#3b82f6", // Blue 500
        reserves: "#60a5fa", // Blue 400
        borrowings: "#f97316", // Orange 500
        otherLiabilities: "#fbbf24", // Amber 400
        // Assets (warmer/earthy tones)
        fixedAssets: "#16a34a", // Green 600
        cwip: "#4ade80", // Green 400
        investments: "#a855f7", // Purple 500
        otherAssets: "#d8b4fe", // Purple 300
        grid: "#e5e7eb",
      };
    }
    // Dark Theme Palette
    return {
      // Liabilities
      equity: "#60a5fa", // Blue 400
      reserves: "#93c5fd", // Blue 300
      borrowings: "#fb923c", // Orange 400
      otherLiabilities: "#facc15", // Yellow 400
      // Assets
      fixedAssets: "#22c55e", // Green 500
      cwip: "#86efac", // Green 300
      investments: "#c084fc", // Purple 400
      otherAssets: "#e9d5ff", // Purple 200
      grid: "rgba(255, 255, 255, 0.1)",
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
                    stroke={chartColors.grid}
                  />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 10, fill: "var(--text-secondary)" }}
                    stroke="var(--element-border)"
                  />
                  <YAxis
                    tick={{ fontSize: 10, fill: "var(--text-secondary)" }}
                    stroke="var(--element-border)"
                  />
                  <Tooltip
                    content={<ChartTooltipContent indicator="dot" />}
                    cursor={{ fill: "rgba(128, 128, 128, 0.1)" }}
                  />
                  <Legend
                    wrapperStyle={{
                      fontSize: "12px",
                      color: "var(--text-secondary)",
                    }}
                  />
                  <Bar
                    dataKey="Equity Capital"
                    stackId="a"
                    fill={chartColors.equity}
                    name="Equity"
                  />
                  <Bar
                    dataKey="Reserves"
                    stackId="a"
                    fill={chartColors.reserves}
                    name="Reserves"
                  />
                  <Bar
                    dataKey="Borrowings"
                    stackId="a"
                    fill={chartColors.borrowings}
                    name="Borrowings"
                  />
                  <Bar
                    dataKey="Other Liabilities"
                    stackId="a"
                    fill={chartColors.otherLiabilities}
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
                    stroke={chartColors.grid}
                  />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 10, fill: "var(--text-secondary)" }}
                    stroke="var(--element-border)"
                  />
                  <YAxis
                    tick={{ fontSize: 10, fill: "var(--text-secondary)" }}
                    stroke="var(--element-border)"
                  />
                  <Tooltip
                    content={<ChartTooltipContent indicator="dot" />}
                    cursor={{ fill: "rgba(128, 128, 128, 0.1)" }}
                  />
                  <Legend
                    wrapperStyle={{
                      fontSize: "12px",
                      color: "var(--text-secondary)",
                    }}
                  />
                  <Bar
                    dataKey="Fixed Assets"
                    stackId="a"
                    fill={chartColors.fixedAssets}
                    name="Fixed Assets"
                  />
                  <Bar
                    dataKey="CWIP"
                    stackId="a"
                    fill={chartColors.cwip}
                    name="CWIP"
                  />
                  <Bar
                    dataKey="Investments"
                    stackId="a"
                    fill={chartColors.investments}
                    name="Investments"
                  />
                  <Bar
                    dataKey="Other Assets"
                    stackId="a"
                    fill={chartColors.otherAssets}
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
