"client";

import React, { useRef, useCallback, useMemo } from "react";
import { useTheme } from "next-themes";
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
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

const chartConfig = {
  cashFromOperating: { label: "Operating", color: "hsl(var(--chart-1))" },
  cashFromInvesting: { label: "Investing", color: "hsl(var(--chart-2))" },
  cashFromFinancing: { label: "Financing", color: "hsl(var(--chart-3))" },
  netCashFlow: { label: "Net Flow", color: "hsl(var(--chart-5))" },
} satisfies ChartConfig;

// Define data shapes
interface CFData {
  year: string;
  [key: string]: any;
}
interface ChartData {
  name: string;
  [key: string]: any;
}
interface CashFlowSectionProps {
  cashFlowTableData: CFData[];
  cashFlowsChartData: ChartData[];
  stockName: string;
}

export default function CashFlowSection({
  cashFlowTableData,
  cashFlowsChartData,
  stockName,
}: CashFlowSectionProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  const chartColors = useMemo(() => {
    if (theme === "light") {
      return {
        operating: "#2563eb", // Blue 600
        investing: "#dc2626", // Red 600
        financing: "#16a34a", // Green 600
        netChange: "#f59e0b", // Amber 500
        grid: "#e5e7eb",
      };
    }
    // Dark Theme Palette
    return {
      operating: "#60a5fa", // Blue 400
      investing: "#f87171", // Red 400
      financing: "#4ade80", // Green 400
      netChange: "#fbbf24", // Amber 400
      grid: "rgba(255, 255, 255, 0.1)",
    };
  }, [theme]);

  const onSummarizeRequest = useCallback(async (): Promise<string | void> => {
    console.log("Summarizing Cash Flow...");
    return `Summary for ${stockName} cash flow...`; // Placeholder
  }, [stockName]);

  const hasData = cashFlowTableData && cashFlowTableData.length > 0;
  if (!hasData) {
    return (
      <ChartCard title="Cash Flows">
        <div className="flex h-40 items-center justify-center text-text-secondary">
          No cash flow data available.
        </div>
      </ChartCard>
    );
  }

  const tableHeaders = [
    { label: "Year", key: "year" },
    { label: "Operating", key: "cashFromOperating", numeric: true },
    { label: "Investing", key: "cashFromInvesting", numeric: true },
    { label: "Financing", key: "cashFromFinancing", numeric: true },
    {
      label: "Net Cash Flow",
      key: "netCashFlow",
      numeric: true,
      highlight: true,
    },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-text-primary">Cash Flows</h2>
      <ChartCard
        title="Annual Cash Flow Analysis (Cr)"
        chartRef={chartRef}
        onSummarizeRequest={onSummarizeRequest}
      >
        <div className="h-[300px] w-full">
          <ChartContainer config={chartConfig} className="w-full h-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={cashFlowsChartData}
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
                  dataKey="cashFromOperating"
                  name="Operating"
                  fill={chartColors.operating}
                />
                <Bar
                  dataKey="cashFromInvesting"
                  name="Investing"
                  fill={chartColors.investing}
                />
                <Bar
                  dataKey="cashFromFinancing"
                  name="Financing"
                  fill={chartColors.financing}
                />
                <Line
                  type="monotone"
                  dataKey="netCashFlow"
                  name="Net Flow"
                  stroke={chartColors.netChange}
                  strokeWidth={2}
                  dot={{ r: 3, strokeWidth: 1, fill: chartColors.netChange }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </ChartCard>

      <div className="overflow-x-auto rounded-lg border border-element-border shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-element-bg/50">
            <tr>
              {tableHeaders.map((header) => (
                <th
                  key={header.key}
                  className={`px-4 py-3 text-xs font-semibold uppercase tracking-wider text-text-secondary whitespace-nowrap ${
                    header.numeric ? "text-right" : "text-left"
                  }`}
                >
                  {header.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-content-bg divide-y divide-element-border">
            {cashFlowTableData.map((cf, index) => (
              <tr key={index} className="hover:bg-element-bg/50">
                {tableHeaders.map((header) => (
                  <td
                    key={header.key}
                    className={cn(
                      "px-4 py-3 whitespace-nowrap",
                      header.numeric ? "text-right" : "text-left",
                      header.key === "year"
                        ? "font-semibold text-text-primary"
                        : "text-text-secondary",
                      header.highlight ? "font-bold text-accent" : ""
                    )}
                  >
                    {cf[header.key] ?? "N/A"}
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
