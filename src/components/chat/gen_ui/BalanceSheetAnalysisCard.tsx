import { useMemo } from "react";
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
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { useTheme } from "../../providers/ThemeProvider";
import ReactMarkdown from "react-markdown";

// --- Type Definitions ---
export interface BalanceSheetAnalysisData {
  summary: string;
  keyMetrics: {
    label: string;
    value: string;
    trend: "up" | "down" | "stable";
    interpretation: string;
  }[];
  assetsLiabilitiesChart: {
    labels: string[];
    datasets: { label: string; data: number[] }[];
  };
  debtToEquityChart: {
    labels: string[];
    datasets: { label: string; data: number[] }[];
  };
  keyTakeaways: string[];
}

const formatYearMonth = (label: string): string => {
  if (typeof label !== "string" || label.length !== 6) {
    return label; // Return original if format is unexpected
  }
  const year = label.substring(0, 4);
  const month = parseInt(label.substring(4, 6), 10);

  // Create a date object to get the month name.
  // Using a specific day (like the 2nd) avoids timezone issues.
  const date = new Date(parseInt(year), month - 1, 2);
  const monthName = date.toLocaleString("default", { month: "long" });

  return `${year} ${monthName}`;
};

// --- Sub-Components ---
const TrendIcon = ({ trend }: { trend: "up" | "down" | "stable" }) => {
  if (trend === "up") return <TrendingUp className="h-4 w-4 text-green-500" />;
  if (trend === "down")
    return <TrendingDown className="h-4 w-4 text-red-500" />;
  return <Minus className="h-4 w-4 text-text-tertiary" />;
};

const formatChartData = (chartData) => {
  if (!chartData?.labels) return [];
  return chartData.labels.map((label, i) => {
    const entry = {
      // Apply formatting here for the tooltip display
      name: formatYearMonth(label),
      // Keep original for potential filtering if needed
      originalLabel: label,
    };
    chartData.datasets.forEach((dataset) => {
      entry[dataset.label] = dataset.data[i];
    });
    return entry;
  });
};

// --- Main Component ---
export function BalanceSheetAnalysisCard({
  title,
  data,
}: {
  title: string;
  data: BalanceSheetAnalysisData;
}) {
  const { theme } = useTheme();

  const themeColors = useMemo(
    () => ({
      text: theme === "light" ? "#374151" : "#a1a1aa",
      tooltipBg: theme === "light" ? "#ffffff" : "#1f2937",
      tooltipBorder: theme === "light" ? "#e5e7eb" : "#374151",
      muted:
        theme === "light"
          ? "rgba(229, 231, 235, 0.6)"
          : "rgba(75, 85, 99, 0.5)",
    }),
    [theme]
  );

  if (!data) {
    return (
      <div className="text-text-secondary">
        Balance sheet data not available.
      </div>
    );
  }

  const assetsLiabilitiesData = formatChartData(data.assetsLiabilitiesChart);
  const debtEquityData = formatChartData(data.debtToEquityChart);

  return (
    <div className="w-full text-sm space-y-6">
      <h2 className="text-lg font-semibold text-text-primary">{title}</h2>

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
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-text-secondary truncate">
                {metric.label}
              </p>
              <TrendIcon trend={metric.trend} />
            </div>
            <p className="text-lg font-bold text-text-primary">
              {metric.value}
            </p>
            <p className="text-xs text-text-tertiary mt-2 line-clamp-3">
              {metric.interpretation}
            </p>
          </div>
        ))}
      </div>

      <div>
        <h3 className="text-base font-semibold text-text-primary mb-2">
          Assets vs. Liabilities Trend
        </h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={assetsLiabilitiesData}>
            <XAxis
              dataKey="name"
              stroke={themeColors.text}
              fontSize={12}
              tickLine={false}
              axisLine={false}
              // --- APPLY FORMATTING TO THE AXIS TICK ---
              tickFormatter={formatYearMonth}
            />
            <YAxis
              stroke={themeColors.text}
              fontSize={12}
              tickLine={false}
              axisLine={false}
              // Corrected the tickFormatter logic from your original file
              tickFormatter={(value) => `${(value / 100000).toFixed(0)} Cr`}
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
            <Bar dataKey="Total Assets" fill="#2dd4bf" radius={[4, 4, 0, 0]} />
            <Bar
              dataKey="Total Liabilities"
              fill="#fb923c"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div>
        <h3 className="text-base font-semibold text-text-primary mb-2">
          Debt-to-Equity Ratio Trend
        </h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={debtEquityData}>
            <XAxis
              dataKey="name"
              stroke={themeColors.text}
              fontSize={12}
              tickLine={false}
              axisLine={false}
              // --- APPLY FORMATTING TO THE AXIS TICK ---
              tickFormatter={formatYearMonth}
            />
            <YAxis
              domain={["auto", "auto"]}
              stroke={themeColors.text}
              fontSize={12}
              tickLine={false}
              axisLine={false}
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
            <Line
              type="monotone"
              dataKey="Debt to Equity Ratio"
              stroke="#f472b6"
              strokeWidth={2}
              dot={{ fill: "#f472b6", strokeWidth: 1 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div>
        <h3 className="text-base font-semibold text-text-primary mb-1">
          Key Takeaways
        </h3>
        <div className="text-text-secondary prose prose-sm max-w-none prose-p:my-1">
          <ul className="list-disc list-inside space-y-1">
            {data.keyTakeaways.map((takeaway, index) => (
              <li key={index}>{takeaway}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
