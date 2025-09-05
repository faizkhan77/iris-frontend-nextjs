// In components/genui/BalanceSheetAnalysisCard.tsx

"use client";

import {
  Bar,
  BarChart,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip as ChartTooltip,
  Legend,
} from "recharts";
import ReactMarkdown from "react-markdown";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

// --- Data Structures (The Contract) ---
interface BalanceSheetKeyMetric {
  label: string;
  value: string;
  trend?: "up" | "down" | "neutral";
  interpretation: string;
}

interface BalanceSheetChartDataset {
  label: string;
  data: number[];
  borderColor: string;
}

interface BalanceSheetChartData {
  labels: string[];
  datasets: BalanceSheetChartDataset[];
}

export interface BalanceSheetAnalysisData {
  summary: string;
  keyTakeaways: string[];
  keyMetrics: BalanceSheetKeyMetric[];
  assetsLiabilitiesChart: BalanceSheetChartData;
  debtToEquityChart: BalanceSheetChartData;
}

// --- Sub-Components ---
const TrendIcon = ({ trend }: { trend?: string }) => {
  if (trend === "up") return <TrendingUp className="h-4 w-4 text-green-500" />;
  if (trend === "down")
    return <TrendingDown className="h-4 w-4 text-red-500" />;
  return <Minus className="h-4 w-4 text-gray-500" />;
};

const formatChartData = (chartData: BalanceSheetChartData) => {
  return chartData.labels.map((label, i) => {
    const entry: { [key: string]: string | number } = { name: label };
    chartData.datasets.forEach((dataset) => {
      entry[dataset.label] = dataset.data[i];
    });
    return entry;
  });
};

// --- Main Component ---
export function BalanceSheetAnalysisCard({
  data,
}: {
  title: string;
  data: BalanceSheetAnalysisData;
}) {
  const assetsLiabilitiesData = formatChartData(data.assetsLiabilitiesChart);
  const debtEquityData = formatChartData(data.debtToEquityChart);

  return (
    <div className="w-full text-sm space-y-6">
      <div>
        <h3 className="text-base font-semibold text-text-primary mb-1">
          Executive Summary
        </h3>
        <p className="text-text-secondary prose prose-sm max-w-none prose-p:my-1">
          {data.summary}
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {data.keyMetrics.map((metric) => (
          <div
            key={metric.label}
            className="rounded-lg border border-element-border bg-element-bg p-3"
          >
            <p className="text-xs text-text-secondary truncate">
              {metric.label}
            </p>
            <p className="text-lg font-bold text-text-primary mt-1">
              {metric.value}
            </p>
            <p className="text-xs text-text-tertiary mt-2 h-8 overflow-hidden">
              {metric.interpretation}
            </p>
          </div>
        ))}
      </div>

      <div>
        <h3 className="text-base font-semibold text-text-primary mb-2">
          Assets vs. Liabilities Trend (5 Years)
        </h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={assetsLiabilitiesData}>
            <XAxis
              dataKey="name"
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${(value / 100000).toFixed(0)}k Cr`}
            />
            <ChartTooltip
              contentStyle={{
                backgroundColor: "#1f2937",
                border: "1px solid #374151",
              }}
            />
            <Legend />
            <Bar
              dataKey="Total Assets"
              fill="rgba(74, 222, 128, 0.6)"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="Total Liabilities"
              fill="rgba(251, 146, 60, 0.6)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div>
        <h3 className="text-base font-semibold text-text-primary mb-2">
          Debt-to-Equity Ratio Trend (5 Years)
        </h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={debtEquityData}>
            <XAxis
              dataKey="name"
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              domain={["auto", "auto"]}
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <ChartTooltip
              contentStyle={{
                backgroundColor: "#1f2937",
                border: "1px solid #374151",
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="Debt to Equity Ratio"
              stroke="rgba(239, 68, 68, 0.8)"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div>
        <h3 className="text-base font-semibold text-text-primary mb-1">
          Key Takeaways
        </h3>
        <ul className="text-text-secondary text-xs space-y-2 list-disc pl-5 mt-2">
          {data.keyTakeaways.map((takeaway, index) => (
            <li key={index}>{takeaway}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
