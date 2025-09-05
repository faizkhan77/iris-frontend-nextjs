"use client";

import React, { useRef, useCallback, useMemo } from "react";
import { useTheme } from "next-themes";
import {
  ResponsiveContainer,
  LineChart,
  Line,
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
interface RatiosData {
  year: string;
  [key: string]: any;
}
interface ChartData {
  name: string;
  [key: string]: any;
}
interface FinancialRatiosSectionProps {
  ratiosTableData: RatiosData[];
  efficiencyDaysChartData: ChartData[];
  roceTrendChartData: ChartData[];
  stockName: string;
}

const chartConfig = {
  "Debtor Days": { label: "Debtor Days", color: "hsl(var(--chart-1))" },
  "Inventory Days": { label: "Inv. Days", color: "hsl(var(--chart-2))" },
  "Payable Days": { label: "Payable Days", color: "hsl(var(--chart-3))" },
  "ROCE %": { label: "ROCE %", color: "hsl(var(--chart-4))" },
} satisfies ChartConfig;

export default function FinancialRatiosSection({
  ratiosTableData,
  efficiencyDaysChartData,
  roceTrendChartData,
  stockName,
}: FinancialRatiosSectionProps) {
  const efficiencyChartRef = useRef<HTMLDivElement>(null);
  const roceChartRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  const chartColors = useMemo(() => {
    if (theme === "light") {
      return {
        debtor: "#c026d3", // Fuchsia 600
        inventory: "#ea580c", // Orange 600
        payable: "#2563eb", // Blue 600
        roce: "#16a34a", // Green 600
        grid: "#e5e7eb",
      };
    }
    // Dark Theme Palette
    return {
      debtor: "#f0abfc", // Fuchsia 300
      inventory: "#fb923c", // Orange 400
      payable: "#93c5fd", // Blue 300
      roce: "#4ade80", // Green 400
      grid: "rgba(255, 255, 255, 0.1)",
    };
  }, [theme]);
  const onSummarizeRequest = useCallback(async (): Promise<string | void> => {
    console.log("Summarizing Financial Ratios...");
    return `Summary for ${stockName} financial ratios...`; // Placeholder
  }, [stockName]);

  const hasData = ratiosTableData && ratiosTableData.length > 0;
  if (!hasData) {
    return (
      <ChartCard title="Financial Ratios">
        <div className="flex h-40 items-center justify-center text-text-secondary">
          No ratio data available.
        </div>
      </ChartCard>
    );
  }

  const tableHeaders = [
    { key: "debtorDays", label: "Debtor Days" },
    { key: "inventoryDays", label: "Inventory Days" },
    { key: "daysPayable", label: "Days Payable" },
    {
      key: "cashConversionCycle",
      label: "Cash Conversion Cycle",
      isTotal: true,
    },
    { key: "workingCapitalDays", label: "Working Capital Days" },
    { key: "roce", label: "ROCE %", isTotal: true },
  ];
  const years = ratiosTableData.map((item) => item.year);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-text-primary">
        Financial Ratios
      </h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Efficiency Days Trend" chartRef={efficiencyChartRef}>
          <div className="h-[300px] w-full">
            <ChartContainer config={chartConfig} className="w-full h-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={efficiencyDaysChartData}
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
                    cursor={{
                      stroke: "var(--text-secondary)",
                      strokeDasharray: "3 3",
                    }}
                  />
                  <Legend
                    wrapperStyle={{
                      fontSize: "12px",
                      color: "var(--text-secondary)",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="Debtor Days"
                    stroke={chartColors.debtor}
                    dot={false}
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="Inventory Days"
                    stroke={chartColors.inventory}
                    dot={false}
                    strokeWidth={2}
                    name="Inv. Days"
                  />
                  <Line
                    type="monotone"
                    dataKey="Payable Days"
                    stroke={chartColors.payable}
                    dot={false}
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </ChartCard>
        <ChartCard title="ROCE % Trend" chartRef={roceChartRef}>
          <div className="h-[300px] w-full">
            <ChartContainer config={chartConfig} className="w-full h-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={roceTrendChartData}
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
                    tickFormatter={(value) => `${value}%`}
                  />
                  <Tooltip
                    content={
                      <ChartTooltipContent
                        indicator="dot"
                        formatter={(value) => `${Number(value).toFixed(2)}%`}
                      />
                    }
                    cursor={{ fill: "rgba(128, 128, 128, 0.1)" }}
                  />
                  {/* --- THIS IS THE FIX: ROCE Bar fill --- */}
                  <Bar dataKey="ROCE %" fill={chartColors.roce} name="ROCE %" />
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
              <th className="sticky left-0 bg-element-bg/50 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-text-secondary">
                Ratio
              </th>
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
                {ratiosTableData.map((yearlyData) => (
                  <td
                    key={`${yearlyData.year}-${header.key}`}
                    className={cn(
                      "px-4 py-3 text-right whitespace-nowrap text-text-secondary",
                      header.isTotal && "font-bold text-text-primary"
                    )}
                  >
                    {yearlyData[header.key] ?? "N/A"}
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
