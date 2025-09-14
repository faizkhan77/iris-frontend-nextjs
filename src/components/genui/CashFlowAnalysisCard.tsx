import { useMemo } from "react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip as ChartTooltip,
  Legend,
} from "recharts";
import { useTheme } from "../providers/ThemeProvider"; // Correctly imported
import { staticCashFlowData } from "./constant";

// --- Type Definitions (assuming these are defined elsewhere) ---
interface CashFlowChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
  }[];
}

// --- Main Component ---
export default function CashFlowAnalysisCard() {
  const { theme } = useTheme();
  const data = staticCashFlowData;

  // A modern and accessible color palette for financial charts
  const themeColors = useMemo(() => {
    const isLight = theme === "light";

    // Base palette for dark mode - vibrant but not overly bright
    let palette = {
      ops: "#38bdf8",      // Sky Blue - for core operations
      investing: "#fb923c",  // Orange - for investment activities
      financing: "#d8b4fe",  // Purple - for financing activities
      net: "#2dd4bf",        // Teal - for positive net flow
      text: "#a1a1aa",        // Zinc - for axis text
      tooltipBg: "#1f2937",   // Slate Gray - for tooltip background
      tooltipBorder: "#374151",
      muted: "rgba(75, 85, 99, 0.5)", // Gray with transparency for cursor
    };

    // Override colors for light mode for better contrast and a softer look
    if (isLight) {
      palette = {
        ops: "#0284c7",      // Stronger Sky Blue
        investing: "#f97316",  // Stronger Orange
        financing: "#a855f7",  // Stronger Purple
        net: "#0d9488",        // Stronger Teal
        text: "#374151",        // Dark Gray for text
        tooltipBg: "#ffffff",   // White
        tooltipBorder: "#e5e7eb",
        muted: "rgba(229, 231, 235, 0.6)", // Light gray for cursor
      };
    }

    return palette;
  }, [theme]);

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
              cursor={{ fill: themeColors.muted }}
              contentStyle={{
                backgroundColor: themeColors.tooltipBg,
                border: `1px solid ${themeColors.tooltipBorder}`,
                borderRadius: "0.5rem",
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
              cursor={{ fill: themeColors.muted }}
              contentStyle={{
                backgroundColor: themeColors.tooltipBg,
                border: `1px solid ${themeColors.tooltipBorder}`,
                borderRadius: "0.5rem",
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