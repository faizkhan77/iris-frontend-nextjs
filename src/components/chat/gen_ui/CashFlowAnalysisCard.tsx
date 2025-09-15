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
import { useTheme } from "../../providers/ThemeProvider";

// --- Type Definitions ---
export interface CashFlowAnalysisData {
  summary: string;
  keyMetrics: {
    label: string;
    value: string;
    interpretation: string;
  }[];
  mainFlowsChart: {
    labels: string[];
    datasets: { label: string; data: number[] }[];
  };
  netCashFlowChart: {
    labels: string[];
    datasets: { label: string; data: number[] }[];
  };
  keyTakeaways: string[];
}

// --- Main Component ---
export function CashFlowAnalysisCard({
  title,
  data,
}: {
  title: string;
  data: CashFlowAnalysisData;
}) {
  const { theme } = useTheme();

  const themeColors = useMemo(() => {
    const isLight = theme === "light";
    let palette = {
      ops: "#38bdf8",
      ops_light: "#0284c7",
      investing: "#fb923c",
      investing_light: "#f97316",
      financing: "#d8b4fe",
      financing_light: "#a855f7",
      net: "#2dd4bf",
      net_light: "#0d9488",
      text: isLight ? "#374151" : "#a1a1aa",
      tooltipBg: isLight ? "#ffffff" : "#1f2937",
      tooltipBorder: isLight ? "#e5e7eb" : "#374151",
      muted: isLight ? "rgba(229, 231, 235, 0.6)" : "rgba(75, 85, 99, 0.5)",
    };
    return palette;
  }, [theme]);

  if (!data) {
    return (
      <div className="text-text-secondary">Cash flow data not available.</div>
    );
  }

  const formatChartData = (chartData) => {
    if (!chartData?.labels) return [];
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
      <h2 className="text-lg font-semibold text-text-primary">{title}</h2>

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
          Components of Cash Flow
        </h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={mainFlowsData}>
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
              tickFormatter={(value) => `${(value / 10000000).toFixed(0)} Cr`}
            />
            <ChartTooltip
              cursor={{ fill: themeColors.muted }}
              contentStyle={{
                backgroundColor: themeColors.tooltipBg,
                border: `1px solid ${themeColors.tooltipBorder}`,
                borderRadius: "0.5rem",
              }}
            />
            <Legend wrapperStyle={{ fontSize: "12px" }} />
            <Bar
              dataKey="Operations (CFO)"
              fill={theme === "light" ? themeColors.ops_light : themeColors.ops}
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="Investing (CFI)"
              fill={
                theme === "light"
                  ? themeColors.investing_light
                  : themeColors.investing
              }
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="Financing (CFF)"
              fill={
                theme === "light"
                  ? themeColors.financing_light
                  : themeColors.financing
              }
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div>
        <h3 className="text-base font-semibold text-text-primary mb-2">
          Net Cash Flow Trend
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
              tickFormatter={(value) => `${(value / 10000000).toFixed(0)} Cr`}
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
              fill={theme === "light" ? themeColors.net_light : themeColors.net}
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
