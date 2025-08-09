// components/charts/ShareholdingPieChart.tsx
"use client";

import { Pie, PieChart } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { PieLabelRenderProps } from "recharts";
// STEP 1: Define the shape of OUR data from the backend
export interface ShareholdingDataItem {
  name: string; // e.g., "Promoters", "FIIs"
  value: number; // e.g., 50.30, 22.10
}

interface ShareholdingPieChartProps {
  data: ShareholdingDataItem[];
  title: string;
  animationDuration?: number;
}

// STEP 2: Create a dynamic ChartConfig based on the data
// This function generates the config, so we don't have to hard-code it.
const generateChartConfig = (data: ShareholdingDataItem[]): ChartConfig => {
  const colorPalette = [
    "#80bfff", // Light Blue
    "#eb4034", // Dodger Blue
    "#a834eb", // Royal Blue
    "#0047b3", // Deep Blue
    "#002f66", // Navy Blue
  ];

  const config: ChartConfig = {
    // A generic "value" key for the tooltip label
    value: {
      label: "Percentage",
    },
  };

  // Assign a unique color to each shareholder category
  data.forEach((item, index) => {
    const key = item.name.toLowerCase().replace(/[\s()]/g, "");
    config[key] = {
      label: item.name,
      color: colorPalette[index % colorPalette.length],
    };
  });

  return config;
};

export function ShareholdingPieChart({
  data,
  title,
  animationDuration = 800,
}: ShareholdingPieChartProps) {
  // Generate the config dynamically from the passed-in data
  const chartConfig = generateChartConfig(data);

  // STEP 3: Map OUR data to the format the template expects
  // The template expects a 'fill' property for color, so we add it.
  const chartData = data.map((item) => {
    const key = item.name.toLowerCase().replace(/[\s()]/g, "");
    return {
      name: item.name,
      value: item.value,
      fill: chartConfig[key]?.color || "hsl(var(--chart-1))",
    };
  });

  return (
    <Card className="flex flex-col border-zinc-800 bg-black/20 backdrop-blur-sm">
      <CardHeader className="items-center pb-0">
        <CardTitle className="text-gray-200">{title}</CardTitle>
        <CardDescription className="text-gray-400">
          Latest available shareholding breakdown
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[300px]" // Increased max height slightly
        >
          <PieChart animationDuration={animationDuration}>
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  hideLabel // The labels are on the pie slices, so hide the tooltip label
                  className="bg-black/70 text-white border border-gray-700 rounded-md px-2 py-1"
                  formatter={(value, name) => [`${value}%`, name]} // Add '%' to the value
                />
              }
            />
            {/* The Pie component now uses our prepared 'chartData' */}
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              innerRadius={60}
              strokeWidth={5}
              outerRadius={100}
              label={({ payload, ...props }: PieLabelRenderProps) => {
                return (
                  <text
                    {...props}
                    className="fill-white text-[10px]"
                    textAnchor={props.textAnchor}
                  >
                    {`${payload?.value}%`}
                  </text>
                );
              }}
              labelLine
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm pt-4">
        {/* We can use the legend from the config to show the categories */}
        <div className="flex w-full items-center justify-center gap-2">
          {Object.keys(chartConfig)
            .filter((key) => key !== "value")
            .map((key) => {
              const config = chartConfig[key];
              if (typeof config !== "object" || !config) return null;
              return (
                <div
                  key={String(config.label || key)}
                  className="flex items-center gap-1.5"
                >
                  <div
                    className="h-2.5 w-2.5 shrink-0 rounded-sm"
                    style={{ backgroundColor: config.color }}
                  />
                  <span className="text-xs text-gray-400">{config.label}</span>
                </div>
              );
            })}
        </div>
      </CardFooter>
    </Card>
  );
}
