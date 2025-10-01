"use client";

import * as React from "react";
import { Line, LineChart, CartesianGrid, XAxis, YAxis } from "recharts";
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

  // Theme-aware stroke colors (similar to StockPriceChart)
  const strokeColorPrimary = theme === "dark" ? "#10b981" : "#059669"; // green tone
  const strokeColorSecondary = theme === "dark" ? "#0dd3ff" : "#0284c7"; // cyan/blue tone

  const chartConfig = useMemo(() => {
    const config: ChartConfig = {};
    config[companyA.name] = {
      label: companyA.name,
      color:
        companyA.name === preferredCompany
          ? strokeColorPrimary
          : "var(--muted-foreground)",
    };
    config[companyB.name] = {
      label: companyB.name,
      color:
        companyB.name === preferredCompany
          ? strokeColorPrimary
          : strokeColorSecondary,
    };
    return config;
  }, [
    companyA.name,
    companyB.name,
    preferredCompany,
    strokeColorPrimary,
    strokeColorSecondary,
  ]);

  const mergedData = useMemo(() => {
    const dataMap = new Map<string, { [key: string]: number | undefined }>();

    companyA.data.forEach((point) => {
      if (!dataMap.has(point.date)) dataMap.set(point.date, {});
      dataMap.get(point.date)![companyA.name] = point.close;
    });

    companyB.data.forEach((point) => {
      if (!dataMap.has(point.date)) dataMap.set(point.date, {});
      dataMap.get(point.date)![companyB.name] = point.close;
    });

    const sortedDates = Array.from(dataMap.keys()).sort(
      (a, b) => new Date(a).getTime() - new Date(b).getTime()
    );

    let lastA: number | null = null;
    let lastB: number | null = null;

    return sortedDates
      .map((date) => {
        const values = dataMap.get(date)!;
        if (values[companyA.name] !== undefined) lastA = values[companyA.name]!;
        if (values[companyB.name] !== undefined) lastB = values[companyB.name]!;
        return {
          date,
          [companyA.name]:
            values[companyA.name] === undefined ? lastA : values[companyA.name],
          [companyB.name]:
            values[companyB.name] === undefined ? lastB : values[companyB.name],
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
          <LineChart
            data={filteredData}
            margin={{ left: -24, right: 12, top: 10 }}
          >
            <CartesianGrid vertical={false} stroke="var(--border)" />
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
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              width={60}
              tickFormatter={(value) =>
                `₹${Number(value).toLocaleString("en-IN")}`
              }
            />
            <ChartTooltip
              cursor
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Line
              dataKey={companyA.name}
              type="natural"
              stroke={strokeColorPrimary}
              strokeWidth={companyA.name === preferredCompany ? 2.5 : 2}
              dot={false}
            />
            <Line
              dataKey={companyB.name}
              type="natural"
              stroke={strokeColorSecondary}
              strokeWidth={companyB.name === preferredCompany ? 2.5 : 2}
              dot={false}
            />
            <ChartLegend content={<ChartLegendContent />} />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
