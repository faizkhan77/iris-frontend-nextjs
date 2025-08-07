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
    return {
      operating: `hsl(var(--chart-1))`,
      investing: `hsl(var(--chart-2))`,
      financing: `hsl(var(--chart-3))`,
      netChange: `hsl(var(--chart-5))`,
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
        onSummarizeRequest={() => Promise.resolve()}
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
                  stroke="var(--element-border)"
                />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 10 }}
                  stroke="var(--text-secondary)"
                />
                <YAxis tick={{ fontSize: 10 }} stroke="var(--text-secondary)" />
                <Tooltip content={<ChartTooltipContent indicator="dot" />} />
                <Legend wrapperStyle={{ fontSize: "12px" }} />
                <Bar
                  dataKey="cashFromOperating"
                  name="Operating"
                  fill="var(--color-cashFromOperating)"
                />
                <Bar
                  dataKey="cashFromInvesting"
                  name="Investing"
                  fill="var(--color-cashFromInvesting)"
                />
                <Bar
                  dataKey="cashFromFinancing"
                  name="Financing"
                  fill="var(--color-cashFromFinancing)"
                />
                <Line
                  type="monotone"
                  dataKey="netCashFlow"
                  name="Net Flow"
                  stroke="var(--color-netCashFlow)"
                  strokeWidth={2}
                  dot={false}
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
