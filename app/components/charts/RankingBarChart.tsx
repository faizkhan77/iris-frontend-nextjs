// components/charts/RankingBarChart.tsx
"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
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
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export interface ChartDataItem {
  [key: string]: string | number;
}

interface RankingBarChartProps {
  data: ChartDataItem[];
  title: string;
  labelKey: string;
  valueKey: string;
}

const formatIndianCurrency = (value: number) => {
  if (value >= 1_00_00_000) return `${(value / 1_00_00_000).toFixed(0)} Cr`;
  if (value >= 1_00_000) return `${(value / 1_00_000).toFixed(0)} L`;
  return value.toString();
};

export function RankingBarChart({
  data,
  title,
  labelKey,
  valueKey,
}: RankingBarChartProps) {
  /* --- 1.   Tell <ChartContainer> which colour to propagate ------------ */
  const chartConfig: ChartConfig = {
    [valueKey]: {
      label: valueKey
        .replace(/_/g, " ")
        .replace(/\b\w/g, (l) => l.toUpperCase()),
      /** vivid blue that matches the screenshot                    **/
      color: "#1E7AFF", // <‑‑ pick any blue you like
    },
  };

  const chartData = [...data].reverse();

  return (
    <Card className="border-zinc-800 bg-black/20 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-gray-200">{title}</CardTitle>
        <CardDescription className="text-gray-400">
          Ranked results from your query
        </CardDescription>
      </CardHeader>

      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ left: 0, right: 50 }}
          >
            {/* faint grid lines like the shot */}
            <CartesianGrid horizontal={false} stroke="rgba(255,255,255,0.08)" />

            <YAxis dataKey={labelKey} type="category" hide />
            <XAxis dataKey={valueKey} type="number" hide />

            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  indicator="line"
                  className="bg-black text-white border border-gray-700"
                />
              }
            />

            {/* --- 2.   Blue bars ---------------------------------------- */}
            <Bar dataKey={valueKey} layout="vertical" fill="#1E7AFF" radius={4}>
              {/* white‑ish label inside the bar */}
              <LabelList
                dataKey={labelKey}
                position="insideLeft"
                offset={8}
                className="fill-white"
                fontSize={12}
                formatter={(v: string) => v}
              />
              {/* light‑grey value at bar’s end */}
              <LabelList
                dataKey={valueKey}
                position="right"
                offset={8}
                className="fill-gray-300"
                fontSize={12}
                formatter={(v: number) => formatIndianCurrency(v)}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
