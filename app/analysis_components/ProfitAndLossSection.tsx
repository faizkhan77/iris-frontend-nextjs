"use client";

import React, { useRef, useCallback, useMemo } from "react";
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

// Define data shapes
interface PLData {
  year: string;
  [key: string]: any;
}
interface GrowthMetric {
  [period: string]: string;
}
interface GrowthData {
  compoundedSalesGrowth?: GrowthMetric;
  compoundedProfitGrowth?: GrowthMetric;
  stockPriceCagr?: GrowthMetric;
  returnOnEquityTrend?: GrowthMetric;
}

const chartConfig = {
  sales: { label: "Revenue", color: "hsl(var(--chart-1))" },
  netProfit: { label: "Net Profit", color: "hsl(var(--chart-2))" },
} satisfies ChartConfig;

interface ProfitAndLossSectionProps {
  profitAndLossTableData: PLData[];
  annualFinancialsChartData: any[];
  growthData: GrowthData;
  stockName: string;
}

export default function ProfitAndLossSection({
  profitAndLossTableData,
  annualFinancialsChartData,
  growthData,
  stockName,
}: ProfitAndLossSectionProps) {
  const annualChartRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  const { revenueColor, profitColor } = useMemo(() => {
    return {
      revenueColor:
        theme === "light" ? "hsl(var(--chart-1))" : "hsl(var(--chart-1))",
      profitColor:
        theme === "light" ? "hsl(var(--chart-2))" : "hsl(var(--chart-2))",
    };
  }, [theme]);

  const onSummarizeRequest = useCallback(async (): Promise<string | void> => {
    console.log("Summarizing Profit & Loss...");
    // Placeholder for Gemini summarization logic
    return `Summary for ${stockName} P&L...`;
  }, [stockName]);

  const hasData =
    (profitAndLossTableData && profitAndLossTableData.length > 0) ||
    (annualFinancialsChartData && annualFinancialsChartData.length > 0);

  if (!hasData) {
    return (
      <ChartCard title="Profit & Loss">
        <div className="flex h-40 items-center justify-center text-text-secondary">
          No P&L data available.
        </div>
      </ChartCard>
    );
  }

  const tableHeaders = [
    { label: "Year", key: "year" },
    { label: "Sales", key: "sales", numeric: true },
    { label: "Expenses", key: "expenses", numeric: true },
    { label: "Op. Profit", key: "operatingProfit", numeric: true },
    { label: "OPM %", key: "opm", numeric: true },
    { label: "Net Profit", key: "netProfit", numeric: true },
    { label: "EPS (₹)", key: "eps", numeric: true, highlight: true },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-text-primary">Profit & Loss</h2>
      <ChartCard
        title="Annual Revenue & Net Profit (Cr)"
        chartRef={annualChartRef}
        onSummarizeRequest={() => Promise.resolve()}
      >
        <div className="h-[300px] w-full">
          <ChartContainer config={chartConfig} className="w-full h-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={annualFinancialsChartData}
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
                <YAxis tick={{ fontSize: 10 }} stroke="var(--text-secondary)" />
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
            {profitAndLossTableData.map((pl, index) => (
              <tr key={index} className="hover:bg-element-bg/50">
                {tableHeaders.map((header) => (
                  <td
                    key={header.key}
                    className={`px-4 py-3 whitespace-nowrap ${
                      header.numeric ? "text-right" : "text-left"
                    } ${
                      header.key === "year"
                        ? "font-semibold text-text-primary"
                        : "text-text-secondary"
                    } ${header.highlight ? "font-bold text-accent" : ""}`}
                  >
                    {pl[header.key] ?? "N/A"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {growthData && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(growthData).map(([key, data]) => {
            if (!data) return null;
            const title = key
              .replace(/([A-Z])/g, " $1")
              .replace(/^./, (str) => str.toUpperCase());
            return (
              <div
                key={key}
                className="p-4 rounded-lg bg-element-bg border border-element-border"
              >
                <h4 className="text-sm font-semibold text-text-primary mb-2">
                  {title}
                </h4>
                <div className="space-y-1">
                  {Object.entries(data).map(([period, value]) => (
                    <div
                      key={period}
                      className="flex justify-between text-xs text-text-secondary"
                    >
                      <span>{period}:</span>
                      <span className="font-medium text-text-primary">
                        {value}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
