// components/charts/StockPriceChart.tsx
"use client";

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

export function StockPriceChart({ data, title }: StockPriceChartProps) {
  const [timeRange, setTimeRange] = React.useState("1y");

  // STEP 3: Map OUR data to the format the template expects
  const chartData = React.useMemo(() => {
    return data.map((item) => ({
      date: item.date,
      desktop: item.close, // Map 'close' to 'desktop'
      mobile: item.volume, // Map 'volume' to 'mobile'
    }));
  }, [data]);

  // STEP 4: Adapt the filtering logic for our dynamic time ranges
  const filteredData = React.useMemo(() => {
    const now = new Date();
    const startDate = new Date();

    if (timeRange === "6m") {
      startDate.setMonth(now.getMonth() - 6);
    } else if (timeRange === "3m") {
      startDate.setMonth(now.getMonth() - 3);
    } else {
      // Default to "1y"
      startDate.setFullYear(now.getFullYear() - 1);
    }

    return chartData.filter((item) => {
      const date = new Date(item.date);
      // Ensure date is valid before comparing
      return !isNaN(date.getTime()) && date >= startDate;
    });
  }, [chartData, timeRange]);

  return (
    // Use the exact same Card component and structure
    <Card className="border-gray-800 bg-black/20 backdrop-blur-sm w-full pt-0">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b border-gray-800 py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle className="text-base font-bold text-white">
            {title}
          </CardTitle>
          <CardDescription className="text-sm text-gray-400">
            Price and volume over the selected period
          </CardDescription>
        </div>
        {/* Use our time range state and options */}
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="hidden w-[160px] rounded-lg sm:ml-auto sm:flex border-gray-700 bg-gray-800/50 text-gray-300"
            aria-label="Select a value"
          >
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent className="rounded-xl border-gray-700 bg-gray-900 text-gray-200">
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
          {/* THE FIX: Add a negative margin to the chart itself */}
          <AreaChart data={filteredData} margin={{ left: -24, right: -24 }}>
            <defs>
              <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-desktop)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-desktop)"
                  stopOpacity={0.1}
                />
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
            <CartesianGrid vertical={false} stroke="white" />
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
            {/* Minimal necessary change: Add Y-axes to prevent data squashing */}
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
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                  indicator="dot"
                />
              }
            />
            {/* The Area components are identical to the template */}
            <Area
              dataKey="mobile"
              yAxisId="left" // Assign volume to one axis
              type="natural"
              fill="url(#fillMobile)"
              stroke="var(--color-mobile)"
              stackId="a"
            />
            <Area
              dataKey="desktop"
              yAxisId="right" // Assign price to the other axis
              type="natural"
              fill="url(#fillDesktop)"
              stroke="purple"
              stackId="a"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
