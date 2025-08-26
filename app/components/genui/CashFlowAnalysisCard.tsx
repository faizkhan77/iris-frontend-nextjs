// In components/genui/CashFlowAnalysisCard.tsx

"use client";

import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip as ChartTooltip,
  Legend,
} from "recharts";
import ReactMarkdown from "react-markdown";

// --- Data Structures ---
interface CashFlowKeyMetric {
  label: string;
  value: string;
  interpretation: string;
}

interface CashFlowChartDataset {
  label: string;
  data: number[];
  backgroundColor: string;
}

interface CashFlowChartData {
  labels: string[];
  datasets: CashFlowChartDataset[];
}

export interface CashFlowAnalysisData {
  summary: string;
  keyTakeaways: string[];
  keyMetrics: CashFlowKeyMetric[];
  mainFlowsChart: CashFlowChartData;
  netCashFlowChart: CashFlowChartData;
}

// --- Main Component ---
export function CashFlowAnalysisCard({
  data,
}: {
  title: string;
  data: CashFlowAnalysisData;
}) {
  const formatChartData = (chartData: CashFlowChartData) => {
    return chartData.labels.map((label, i) => {
      const entry: { [key: string]: string | number } = { name: label };
      chartData.datasets.forEach((dataset) => {
        entry[dataset.label] = dataset.data[i];
      });
      return entry;
    });
  };

  const mainFlowsData = formatChartData(data.mainFlowsChart);
  const netCashFlowData = formatChartData(data.netCashFlowChart);
  const themeColors = {
    ops: "hsl(var(--chart-1))",
    investing: "hsl(var(--chart-2))",
    financing: "hsl(var(--chart-3))",
    net: "hsl(var(--chart-5))",
    text: "hsl(var(--secondary-foreground))",
  };

  return (
    <div className="w-full text-sm space-y-6">
      <div>
        <h3 className="text-base font-semibold text-text-primary mb-1">
          Cash Flow Summary
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
          Components of Cash Flow (5 Years)
        </h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={mainFlowsData} barGap={-10}>
            <XAxis
              dataKey="name"
              stroke={themeColors.text}
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke={themeColors.text}
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${(value / 1000).toFixed(0)}k Cr`}
            />
            <ChartTooltip
              cursor={{ fill: "hsla(var(--muted))" }}
              contentStyle={{
                backgroundColor: "hsl(var(--background))",
                border: "1px solid hsl(var(--border))",
              }}
            />
            <Legend />
            <Bar
              dataKey="Operations (CFO)"
              fill={themeColors.ops}
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="Investing (CFI)"
              fill={themeColors.investing}
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="Financing (CFF)"
              fill={themeColors.financing}
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div>
        <h3 className="text-base font-semibold text-text-primary mb-2">
          Net Cash Flow Trend (5 Years)
        </h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={netCashFlowData}>
            <XAxis
              dataKey="name"
              stroke={themeColors.text}
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke={themeColors.text}
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${(value / 1000).toFixed(0)}k Cr`}
            />
            <ChartTooltip
              cursor={{ fill: "hsla(var(--muted))" }}
              contentStyle={{
                backgroundColor: "hsl(var(--background))",
                border: "1px solid hsl(var(--border))",
              }}
            />
            <Bar
              dataKey="Net Cash Flow"
              fill={themeColors.net}
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div>
        <h3 className="text-base font-semibold text-text-primary mb-1">
          Key Takeaways
        </h3>
        <ul className="text-text-secondary text-xs space-y-2 list-disc pl-5 mt-2">
          {data.keyTakeaways.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
