"use client";

import React, { useRef, useCallback, useMemo, useState } from "react";
import { useTheme } from "next-themes";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Sector,
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
interface SHPData {
  date: string;
  [key: string]: any;
}
interface PieData {
  name: string;
  value: number;
}
interface TrendData {
  date: string;
  [key: string]: any;
}
interface ShareholdingPatternSectionProps {
  shareholdingHistory: SHPData[];
  shareholdingPieData: PieData[];
  shareholdingTrendData: TrendData[];
  stockName: string;
}

const chartConfig = {
  Promoters: { label: "Promoters", color: "hsl(var(--chart-1))" },
  FII: { label: "FII", color: "hsl(var(--chart-2))" },
  DII: { label: "DII", color: "hsl(var(--chart-3))" },
  Public: { label: "Public", color: "hsl(var(--chart-4))" },
  Others: { label: "Others", color: "hsl(var(--chart-5))" },
} satisfies ChartConfig;

// Custom active shape for the Pie Chart
const renderActiveShape = (props: any) => {
  const {
    cx,
    cy,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
  } = props;
  return (
    <g>
      <text
        x={cx}
        y={cy - 5}
        dy={8}
        textAnchor="middle"
        fill={fill}
        className="text-sm font-semibold"
      >
        {payload.name}
      </text>
      <text
        x={cx}
        y={cy + 15}
        dy={8}
        textAnchor="middle"
        fill="var(--text-secondary)"
        className="text-xs"
      >
        {`${(percent * 100).toFixed(2)}%`}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 4}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        stroke="var(--content-bg)"
        strokeWidth={2}
      />
    </g>
  );
};

export default function ShareholdingPatternSection({
  shareholdingHistory,
  shareholdingPieData,
  shareholdingTrendData,
  stockName,
}: ShareholdingPatternSectionProps) {
  const pieChartRef = useRef<HTMLDivElement>(null);
  const trendChartRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const { theme } = useTheme();

  const chartColors = useMemo(() => {
    return {
      c1: `hsl(var(--chart-1))`,
      c2: `hsl(var(--chart-2))`,
      c3: `hsl(var(--chart-3))`,
      c4: `hsl(var(--chart-4))`,
      c5: `hsl(var(--chart-5))`,
    };
  }, [theme]);

  const onPieEnter = useCallback(
    (_: any, index: number) => setActiveIndex(index),
    []
  );
  const onPieLeave = useCallback(() => setActiveIndex(null), []);

  const onSummarizeRequest = useCallback(async (): Promise<string | void> => {
    console.log("Summarizing Shareholding Pattern...");
    return `Summary for ${stockName} shareholding...`; // Placeholder
  }, [stockName]);

  const hasData = shareholdingHistory && shareholdingHistory.length > 0;
  if (!hasData) {
    return (
      <ChartCard title="Shareholding Pattern">
        <div className="flex h-40 items-center justify-center text-text-secondary">
          No shareholding data available.
        </div>
      </ChartCard>
    );
  }

  const tableHeaders = [
    "Date",
    "Promoters %",
    "FII %",
    "DII %",
    "Public %",
    "Others %",
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-text-primary">
        Shareholding Pattern
      </h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title={`Distribution (${shareholdingHistory[0]?.date})`}
          chartRef={pieChartRef}
        >
          <div className="h-[350px] w-full">
            <ChartContainer config={chartConfig} className="w-full h-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip
                    content={<ChartTooltipContent indicator="dot" hideLabel />}
                  />
                  <Pie
                    activeIndex={activeIndex ?? undefined}
                    activeShape={renderActiveShape}
                    data={shareholdingPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={110}
                    dataKey="value"
                    nameKey="name"
                    onMouseEnter={onPieEnter}
                    onMouseLeave={onPieLeave}
                  >
                    {shareholdingPieData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={`var(--color-${entry.name})`}
                      />
                    ))}
                  </Pie>
                  <Legend wrapperStyle={{ fontSize: "12px" }} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </ChartCard>
        <ChartCard title="Shareholding Trend (%)" chartRef={trendChartRef}>
          <div className="h-[350px] w-full">
            <ChartContainer config={chartConfig} className="w-full h-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={shareholdingTrendData}
                  margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="var(--element-border)"
                  />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 10 }}
                    stroke="var(--text-secondary)"
                  />
                  <YAxis
                    tick={{ fontSize: 10 }}
                    stroke="var(--text-secondary)"
                    unit="%"
                  />
                  <Tooltip content={<ChartTooltipContent indicator="dot" />} />
                  <Legend wrapperStyle={{ fontSize: "12px" }} />
                  <Line
                    type="monotone"
                    dataKey="Promoters"
                    stroke="var(--color-Promoters)"
                    dot={false}
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="FII"
                    stroke="var(--color-FII)"
                    dot={false}
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="DII"
                    stroke="var(--color-DII)"
                    dot={false}
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="Public"
                    stroke="var(--color-Public)"
                    dot={false}
                    strokeWidth={2}
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
              {tableHeaders.map((label) => (
                <th
                  key={label}
                  className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-text-secondary text-right first:text-left"
                >
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-content-bg divide-y divide-element-border">
            {shareholdingHistory.map((sh, index) => (
              <tr key={index} className="hover:bg-element-bg/50">
                <td className="px-4 py-3 whitespace-nowrap font-semibold text-text-primary">
                  {sh.date}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-right text-text-secondary">
                  {sh.promoters}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-right text-text-secondary">
                  {sh.fii}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-right text-text-secondary">
                  {sh.dii}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-right text-text-secondary">
                  {sh.public}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-right text-text-secondary">
                  {sh.others}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
