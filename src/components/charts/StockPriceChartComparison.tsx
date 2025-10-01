"use client";

import * as React from "react";
import {
  ComposedChart,
  Bar,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMemo, useState, useEffect } from "react";
import { useTheme } from "../providers/ThemeProvider";

// Reuse same type
export interface ChartDataPoint {
  date: string;
  close: number;
  volume: number;
}

interface StockPriceChartComparisonProps {
  companyA: { name: string; data: ChartDataPoint[] };
  companyB: { name: string; data: ChartDataPoint[] };
  preferredCompany?: string;
  timeRange: "1y" | "6m" | "3m";
  setTimeRange: (value: "1y" | "6m" | "3m") => void;
  animationDuration?: number;
}

export function StockPriceChartComparison({
  companyA,
  companyB,
  preferredCompany,
  timeRange,
  setTimeRange,
  animationDuration = 500,
}: StockPriceChartComparisonProps) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Theme-aware stroke colors (like StockPriceChart)
  const strokeColorPrimary = theme === "dark" ? "#10b981" : "#059669"; // green
  const strokeColorSecondary = theme === "dark" ? "#0dd3ff" : "#0284c7"; // cyan/blue

  const chartConfig = useMemo(() => {
    const priceColorA = strokeColorPrimary;
    const priceColorB = strokeColorSecondary;
    const volumeColorA =
      theme === "dark" ? "rgba(16,185,129,0.3)" : "rgba(5,150,105,0.3)"; // green vol
    const volumeColorB =
      theme === "dark" ? "rgba(13,211,255,0.3)" : "rgba(2,132,199,0.3)"; // cyan vol

    const config: ChartConfig = {};
    // Price configs
    config[companyA.name] = {
      label: companyA.name,
      color: priceColorA,
    };
    config[companyB.name] = {
      label: companyB.name,
      color: priceColorB,
    };
    // Volume configs
    config[`${companyA.name}_volume`] = {
      label: `${companyA.name} Vol`,
      color: volumeColorA,
    };
    config[`${companyB.name}_volume`] = {
      label: `${companyB.name} Vol`,
      color: volumeColorB,
    };
    return config;
  }, [companyA.name, companyB.name, theme]);

  const mergedData = useMemo(() => {
    const dataMap = new Map<string, { [key: string]: number | undefined }>();
    const aVolKey = `${companyA.name}_volume`;
    const bVolKey = `${companyB.name}_volume`;

    companyA.data.forEach((point) => {
      if (!dataMap.has(point.date)) dataMap.set(point.date, {});
      const entry = dataMap.get(point.date)!;
      entry[companyA.name] = point.close;
      entry[aVolKey] = point.volume;
    });

    companyB.data.forEach((point) => {
      if (!dataMap.has(point.date)) dataMap.set(point.date, {});
      const entry = dataMap.get(point.date)!;
      entry[companyB.name] = point.close;
      entry[bVolKey] = point.volume;
    });

    const sortedDates = Array.from(dataMap.keys()).sort(
      (a, b) => new Date(a).getTime() - new Date(b).getTime()
    );

    let lastA_price: number | null = null,
      lastB_price: number | null = null;
    let lastA_vol: number | null = null,
      lastB_vol: number | null = null;

    return sortedDates
      .map((date) => {
        const values = dataMap.get(date)!;
        if (values[companyA.name] !== undefined)
          lastA_price = values[companyA.name]!;
        if (values[companyB.name] !== undefined)
          lastB_price = values[companyB.name]!;
        if (values[aVolKey] !== undefined) lastA_vol = values[aVolKey]!;
        if (values[bVolKey] !== undefined) lastB_vol = values[bVolKey]!;
        return {
          date,
          [companyA.name]:
            values[companyA.name] === undefined
              ? lastA_price
              : values[companyA.name],
          [companyB.name]:
            values[companyB.name] === undefined
              ? lastB_price
              : values[companyB.name],
          [aVolKey]:
            values[aVolKey] === undefined ? lastA_vol : values[aVolKey],
          [bVolKey]:
            values[bVolKey] === undefined ? lastB_vol : values[bVolKey],
        };
      })
      .filter((d) => d[companyA.name] !== null || d[companyB.name] !== null);
  }, [companyA, companyB]);

  const filteredData = React.useMemo(() => {
    const now = new Date();
    const startDate = new Date();
    if (timeRange === "6m") startDate.setMonth(now.getMonth() - 6);
    else if (timeRange === "3m") startDate.setMonth(now.getMonth() - 3);
    else startDate.setFullYear(now.getFullYear() - 1);
    return mergedData.filter((item) => {
      const date = new Date(item.date);
      return !isNaN(date.getTime()) && date >= startDate;
    });
  }, [mergedData, timeRange]);

  if (!mounted) {
    return (
      <div className="h-[350px] w-full bg-muted/30 rounded-lg animate-pulse" />
    );
  }

  return (
    <Card className="w-full border-element-border shadow-none pt-0">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b border-element-border py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle className="text-base font-bold text-text-primary">
            Price Performance Comparison
          </CardTitle>
          <CardDescription className="text-sm text-text-secondary">
            Comparing stock prices over the selected period.
          </CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="hidden w-[160px] rounded-lg border-element-border bg-element-bg text-text-primary sm:ml-auto sm:flex"
            aria-label="Select a value"
          >
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent className="rounded-xl border-element-border bg-background text-text-primary">
            <SelectItem value="1y" className="rounded-lg">
              Last 1 Year
            </SelectItem>
            <SelectItem value="6m" className="rounded-lg">
              Last 6 Months
            </SelectItem>
            <SelectItem value="3m" className="rounded-lg">
              Last 3 Months
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-video h-[250px] w-full"
        >
          <ComposedChart
            data={filteredData}
            margin={{ left: -24, right: -24, top: 10 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) =>
                new Date(value).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }
            />

            {/* Y-Axis for Price (left) */}
            <YAxis
              yAxisId="left"
              orientation="left"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              width={60}
              tickFormatter={(value) =>
                `₹${Number(value).toLocaleString("en-IN")}`
              }
            />

            {/* Y-Axis for Volume (right) - hidden for clarity */}
            <YAxis
              yAxisId="right"
              orientation="right"
              tick={false}
              axisLine={false}
            />

            <ChartTooltip
              cursor
              content={<ChartTooltipContent indicator="dot" />}
            />

            {/* Volume Bars - rendered first to be in the background */}
            <Bar
              dataKey={`${companyA.name}_volume`}
              yAxisId="right"
              fill={chartConfig[companyA.name].color}
              radius={4}
            />
            <Bar
              dataKey={`${companyB.name}_volume`}
              yAxisId="right"
              fill={chartConfig[companyB.name].color}
              radius={4}
            />

            {/* Price Lines */}
            <Line
              dataKey={companyA.name}
              yAxisId="left"
              type="natural"
              stroke={chartConfig[companyA.name].color}
              strokeWidth={companyA.name === preferredCompany ? 2.5 : 2}
              dot={false}
            />
            <Line
              dataKey={companyB.name}
              yAxisId="left"
              type="natural"
              stroke={chartConfig[companyB.name].color}
              strokeWidth={companyB.name === preferredCompany ? 2.5 : 2}
              dot={false}
            />

            <ChartLegend content={<ChartLegendContent />} />
          </ComposedChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
