// components/charts/StockPriceChart.tsx
"use client";

import { useTheme } from "next-themes";
import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"; // Added YAxis for proper scaling

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// STEP 1: Define the shape of OUR data
export interface ChartDataPoint {
  date: string;
  close: number; // This will map to 'desktop'
  volume: number; // This will map to 'mobile'
}

interface StockPriceChartProps {
  data: ChartDataPoint[];
  title: string;
  animationDuration?: number;
}

// STEP 2: Configure the chart. We will map our data keys to the template's keys.
const chartConfig = {
  price: {
    label: "Price",
  },
  volume: {
    label: "Volume",
  },
  // Keep the original keys for styling, but update labels
  desktop: {
    label: "Price", // Was "Desktop"
    color: "black",
  },
  mobile: {
    label: "Volume", // Was "Mobile"
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

// This is the full function with the required changes applied.
export function StockPriceChart({
  data,
  title,
  animationDuration = 500,
}: StockPriceChartProps) {
  const [timeRange, setTimeRange] = React.useState("1y");
  const { theme } = useTheme();

  // This variable is now used for the stroke color of the price line
  const strokeColor = theme === "dark" ? "#10b981" : "#059669";

  // Your data mapping logic remains untouched
  const chartData = React.useMemo(() => {
    return data.map((item) => ({
      date: item.date,
      desktop: item.close,
      mobile: item.volume,
    }));
  }, [data]);

  const filteredData = React.useMemo(() => {
    const now = new Date();
    const startDate = new Date();

    if (timeRange === "6m") {
      startDate.setMonth(now.getMonth() - 6);
    } else if (timeRange === "3m") {
      startDate.setMonth(now.getMonth() - 3);
    } else {
      startDate.setFullYear(now.getFullYear() - 1);
    }

    return chartData.filter((item) => {
      const date = new Date(item.date);
      return !isNaN(date.getTime()) && date >= startDate;
    });
  }, [chartData, timeRange]);

  return (
    // THEME-AWARE STYLING: Replaced hardcoded colors with theme variables
    <Card className="w-full border-element-border bg-background pt-0">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b border-element-border py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle className="text-base font-bold text-text-primary">
            {title}
          </CardTitle>
          <CardDescription className="text-sm text-text-secondary">
            Price and volume over the selected period
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
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart
            data={filteredData}
            margin={{ left: -24, right: -24 }}
            animationDuration={animationDuration}
          >
            <defs>
              {/* These definitions remain untouched */}
              <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={strokeColor} stopOpacity={0.4} />
                <stop offset="95%" stopColor={strokeColor} stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-mobile)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-mobile)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="var(--border)" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <YAxis
              yAxisId="left"
              orientation="left"
              tick={false}
              axisLine={false}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tick={false}
              axisLine={false}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) =>
                    new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  }
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="mobile"
              yAxisId="left"
              type="natural"
              fill="url(#fillMobile)"
              stroke="#0dd3ff" // Use theme variable for consistency
              stackId="a"
            />
            <Area
              dataKey="desktop"
              yAxisId="right"
              type="natural"
              // --- YOUR CORE REQUIREMENT FULFILLED HERE ---
              fill={theme === "light" ? "white" : "url(#fillDesktop)"}
              stroke={strokeColor} // Use dynamic stroke color
              stackId="a"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
