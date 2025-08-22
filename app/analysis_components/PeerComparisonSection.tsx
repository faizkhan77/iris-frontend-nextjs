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

interface Peer {
  id: number;
  name: string;
  cmp: number | string;
  pe: number | string;
  marketCapFormatted?: string;
  dividendYield: number | string;
  roce: number | string;
  qtrProfitVar: number | string; // New field for profit variance
  [key: string]: any;
}

interface ChartData {
  data: { name: string; [key: string]: any }[];
  title: string;
  dataKey: string;
}

interface PeerComparisonSectionProps {
  peerComparisonData: Peer[];
  peerCmpChartData: ChartData;
  peerPeChartData: ChartData;
  stockName: string;
}

const chartConfig = {
  cmp: { label: "CMP (₹)", color: "hsl(var(--chart-1))" },
  pe: { label: "P/E Ratio", color: "hsl(var(--chart-2))" },
} satisfies ChartConfig;

export default function PeerComparisonSection({
  peerComparisonData,
  peerCmpChartData,
  peerPeChartData,
  stockName,
}: PeerComparisonSectionProps) {
  const cmpChartRef = useRef<HTMLDivElement>(null);
  const peChartRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  const chartColors = useMemo(() => {
    if (theme === "light") {
      return {
        cmpBar: "#1e3a8a", // Navy Blue
        peBar: "#047857", // Dark Emerald Green
        grid: "#e5e7eb",
      };
    }
    // Dark Theme Palette
    return {
      cmpBar: "#3b82f6", // Bright Blue
      peBar: "#2dd4bf", // Bright Teal
      grid: "rgba(255, 255, 255, 0.1)",
    };
  }, [theme]);

  const chartFillColor1 =
    theme === "light" ? "hsl(var(--chart-1))" : "hsl(var(--chart-2))";
  const chartFillColor2 =
    theme === "light" ? "hsl(var(--chart-3))" : "hsl(var(--chart-4))";

  const onSummarizeRequest = useCallback(async (): Promise<string | void> => {
    // Logic to capture charts using html-to-image
    const cmpImage = cmpChartRef.current
      ? await htmlToImage.toPng(cmpChartRef.current)
      : null;
    const peImage = peChartRef.current
      ? await htmlToImage.toPng(peChartRef.current)
      : null;
    console.log("Summarizing Peer Comparison...", { cmpImage, peImage });
    return `Summary for ${stockName} peers...`; // Placeholder
  }, [stockName]);

  if (!peerComparisonData || peerComparisonData.length === 0) {
    return (
      <ChartCard title="Peer Comparison">
        <div className="flex h-40 items-center justify-center text-text-secondary">
          No peer data available.
        </div>
      </ChartCard>
    );
  }

  const tableHeaders = [
    { label: "Name", key: "name" },
    { label: "CMP (₹)", key: "cmp", numeric: true },
    { label: "P/E", key: "pe", numeric: true },
    { label: "Market Cap (Cr)", key: "marketCapFormatted", numeric: true },
    { label: "Div Yield (%)", key: "dividendYield", numeric: true },
    {
      label: "Qtr Profit Var (%)",
      key: "qtrProfitVar",
      numeric: true,
      isColored: true,
    }, // New variance column
    { label: "ROCE (%)", key: "roce", numeric: true },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-text-primary">
        Peer Comparison
      </h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title={peerCmpChartData.title} chartRef={cmpChartRef}>
          <div className="h-[300px] w-full">
            <ChartContainer config={chartConfig} className="w-full h-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={peerCmpChartData.data}
                  layout="vertical"
                  margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={chartColors.grid}
                    horizontal={false}
                  />
                  <XAxis
                    type="number"
                    dataKey="cmp"
                    tick={{ fontSize: 10, fill: "var(--text-secondary)" }}
                    stroke="var(--element-border)"
                  />
                  <YAxis
                    dataKey="name"
                    type="category"
                    width={80}
                    tick={{ fontSize: 10, fill: "var(--text-secondary)" }}
                    stroke="var(--element-border)"
                    interval={0}
                  />
                  <Tooltip
                    content={<ChartTooltipContent indicator="dot" />}
                    cursor={{ fill: "rgba(128, 128, 128, 0.1)" }}
                  />
                  <Bar
                    dataKey="cmp"
                    fill={chartColors.cmpBar}
                    name="CMP (₹)"
                    radius={[0, 4, 4, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </ChartCard>
        <ChartCard title={peerPeChartData.title} chartRef={peChartRef}>
          <div className="h-[300px] w-full">
            <ChartContainer config={chartConfig} className="w-full h-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={peerPeChartData.data}
                  layout="vertical"
                  margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={chartColors.grid}
                    horizontal={false}
                  />
                  <XAxis
                    type="number"
                    dataKey="pe"
                    tick={{ fontSize: 10, fill: "var(--text-secondary)" }}
                    stroke="var(--element-border)"
                  />
                  <YAxis
                    dataKey="name"
                    type="category"
                    width={80}
                    tick={{ fontSize: 10, fill: "var(--text-secondary)" }}
                    stroke="var(--element-border)"
                    interval={0}
                  />
                  <Tooltip
                    content={<ChartTooltipContent indicator="dot" />}
                    cursor={{ fill: "rgba(128, 128, 128, 0.1)" }}
                  />
                  <Bar
                    dataKey="pe"
                    fill={chartColors.peBar}
                    name="P/E Ratio"
                    radius={[0, 4, 4, 0]}
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
            {peerComparisonData.map((peer, index) => (
              <tr key={peer.id || index} className="hover:bg-element-bg/50">
                {tableHeaders.map((header) => {
                  const value = peer[header.key] ?? "N/A";

                  // --- THIS IS THE NEW CONDITIONAL COLORING LOGIC ---
                  let textColorClass = "text-text-secondary";
                  if (header.key === "name") {
                    textColorClass = "font-semibold text-text-primary";
                  }
                  if (header.isColored && typeof value === "number") {
                    textColorClass =
                      value > 0
                        ? "text-success"
                        : value < 0
                        ? "text-destructive"
                        : "text-text-secondary";
                  }

                  return (
                    <td
                      key={header.key}
                      className={cn(
                        "px-4 py-3 whitespace-nowrap",
                        header.numeric ? "text-right" : "text-left",
                        textColorClass
                      )}
                    >
                      {/* Format numbers to 2 decimal places if they are numbers */}
                      {typeof value === "number"
                        ? value.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })
                        : value}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
