"use client";

import React, { useRef, useCallback } from "react";
import { useTheme } from "next-themes";
import {
  ResponsiveContainer,
  LineChart,
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

const chartConfig = {
  sales: { label: "Revenue", color: "hsl(var(--chart-1))" },
  netProfit: { label: "Net Profit", color: "hsl(var(--chart-2))" },
  eps: { label: "EPS", color: "hsl(var(--chart-5))" },
} satisfies ChartConfig;

// Define data shapes
interface QuarterlyData {
  quarter: string;
  revenue: number;
  interest: number;
  netProfit: number;
  eps: number;
}
interface ChartData {
  name: string;
  [key: string]: any;
}
interface QuarterlyResultsSectionProps {
  quarterlyTableData: QuarterlyData[];
  financialsChartData: ChartData[];
  epsChartData: ChartData[];
  stockName: string;
}

export default function QuarterlyResultsSection({
  quarterlyTableData,
  financialsChartData,
  epsChartData,
  stockName,
}: QuarterlyResultsSectionProps) {
  const financialsChartRef = useRef<HTMLDivElement>(null);
  const epsChartRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  const chartStrokeColor1 =
    theme === "light" ? "hsl(var(--chart-1))" : "hsl(var(--chart-1))";
  const chartStrokeColor2 =
    theme === "light" ? "hsl(var(--chart-2))" : "hsl(var(--chart-2))";
  const chartStrokeColor3 =
    theme === "light" ? "hsl(var(--chart-5))" : "hsl(var(--chart-5))";

  const onSummarizeRequest = useCallback(async (): Promise<string | void> => {
    // Logic to capture charts using html-to-image
    console.log("Summarizing Quarterly Results...");
    return `Summary for ${stockName} quarterly results...`; // Placeholder
  }, [stockName]);

  const hasData =
    (quarterlyTableData && quarterlyTableData.length > 0) ||
    (financialsChartData && financialsChartData.length > 0);

  if (!hasData) {
    return (
      <ChartCard title="Quarterly Results">
        <div className="flex h-40 items-center justify-center text-text-secondary">
          No quarterly data available.
        </div>
      </ChartCard>
    );
  }

  const tableHeaders = [
    { label: "Quarter", key: "quarter" },
    { label: "Revenue (Cr)", key: "revenue", numeric: true },
    { label: "Interest (Cr)", key: "interest", numeric: true },
    { label: "Net Profit (Cr)", key: "netProfit", numeric: true },
    { label: "EPS (₹)", key: "eps", numeric: true, highlight: true },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-text-primary">
        Quarterly Results
      </h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="Revenue & Net Profit (Cr)"
          chartRef={financialsChartRef}
        >
          <div className="h-[300px] w-full">
            <ChartContainer config={chartConfig} className="w-full h-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={financialsChartData}
                  margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
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
                  <Line
                    type="monotone"
                    dataKey="sales"
                    name="Revenue"
                    stroke="var(--color-sales)"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="netProfit"
                    name="Net Profit"
                    stroke="var(--color-netProfit)"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </ChartCard>
        <ChartCard title="EPS (₹)" chartRef={epsChartRef}>
          <div className="h-[300px] w-full">
            <ChartContainer config={chartConfig} className="w-full h-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={epsChartData}
                  margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
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
                  <Tooltip
                    content={
                      <ChartTooltipContent
                        indicator="dot"
                        formatter={(value) => `₹${Number(value).toFixed(2)}`}
                      />
                    }
                  />
                  <Legend wrapperStyle={{ fontSize: "12px" }} />
                  <Line
                    type="monotone"
                    dataKey="eps"
                    name="EPS"
                    stroke="var(--color-eps)"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </ChartCard>
      </div>

      <div className="overflow-x-auto rounded-lg border border-element-border shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-element-bg/50">
            <tr>
              {tableHeaders.map((header) => (
                <th
                  key={header.key}
                  className={`px-4 py-3 text-xs font-semibold uppercase tracking-wider text-text-secondary ${
                    header.numeric ? "text-right" : "text-left"
                  }`}
                >
                  {header.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-content-bg divide-y divide-element-border">
            {quarterlyTableData.map((q, index) => (
              <tr key={index} className="hover:bg-element-bg/50">
                {tableHeaders.map((header) => (
                  <td
                    key={header.key}
                    className={`px-4 py-3 whitespace-nowrap ${
                      header.numeric ? "text-right" : "text-left"
                    } ${
                      header.key === "quarter"
                        ? "font-semibold text-text-primary"
                        : "text-text-secondary"
                    } ${header.highlight ? "font-bold text-accent" : ""}`}
                  >
                    {q[header.key as keyof QuarterlyData] ?? "N/A"}
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
