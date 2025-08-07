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
    return {
      c1: `hsl(var(--chart-1))`,
      c2: `hsl(var(--chart-2))`,
      c3: `hsl(var(--chart-3))`,
      c4: `hsl(var(--chart-4))`,
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
                    dataKey="Debtor Days"
                    stroke="var(--color-Debtor Days)"
                    dot={false}
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="Inventory Days"
                    stroke="var(--color-Inventory Days)"
                    dot={false}
                    strokeWidth={2}
                    name="Inv. Days"
                  />
                  <Line
                    type="monotone"
                    dataKey="Payable Days"
                    stroke="var(--color-Payable Days)"
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
                    tickFormatter={(value) => `${value}%`}
                  />
                  <Tooltip
                    content={
                      <ChartTooltipContent
                        indicator="dot"
                        formatter={(value) => `${Number(value).toFixed(2)}%`}
                      />
                    }
                  />
                  <Bar
                    dataKey="ROCE %"
                    fill="var(--color-ROCE %)"
                    name="ROCE %"
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
