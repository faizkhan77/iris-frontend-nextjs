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
import { sampleDataofBalanceSheetAnalysisCard } from "./constant";

// --- Sub-Components ---
const TrendIcon = ({ trend }) => {
  if (trend === "up")
    return <TrendingUp className="h-4 w-4 text-green-500" />;
  if (trend === "down")
    return <TrendingDown className="h-4 w-4 text-red-500" />;
  return <Minus className="h-4 w-4 text-gray-500" />;
};

const formatChartData = (chartData) => {
  return chartData.labels.map((label, i) => {
    const entry = { name: label };
    chartData.datasets.forEach((dataset) => {
      entry[dataset.label] = dataset.data[i];
    });
    return entry;
  });
};

// --- Main Component ---
export default function BalanceSheetAnalysisCard() {
  const data = sampleDataofBalanceSheetAnalysisCard;
  const assetsLiabilitiesData = formatChartData(data.assetsLiabilitiesChart);
  const debtEquityData = formatChartData(data.debtToEquityChart);

  return (
    <div className="max-w-6xl mx-auto p-6 bg-card text-card-foreground rounded-xl shadow-md space-y-8">
      {/* Executive Summary */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Executive Summary</h3>
        <p className="text-sm text-muted-foreground">{data.summary}</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {data.keyMetrics.map((metric) => (
          <div
            key={metric.label}
            className="p-4 bg-muted rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-medium text-muted-foreground truncate">
                {metric.label}
              </p>
              <TrendIcon trend={metric.trend} />
            </div>
            <p className="text-lg font-bold">{metric.value}</p>
            <p className="text-xs text-muted-foreground mt-2 line-clamp-3">
              {metric.interpretation}
            </p>
          </div>
        ))}
      </div>

      {/* Assets vs Liabilities Chart */}
      <div>
        <h3 className="text-lg font-semibold mb-2">
          Assets vs. Liabilities Trend (5 Years)
        </h3>
        <div className="h-64 bg-card rounded-lg p-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={assetsLiabilitiesData}>
              <XAxis
                dataKey="name"
                stroke="var(--color-muted-foreground)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="var(--color-muted-foreground)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${(value / 100000).toFixed(0)}k Cr`}
              />
              <ChartTooltip
                contentStyle={{
                  backgroundColor: "var(--color-card)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
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
      </div>

      {/* Debt to Equity Ratio Chart */}
      <div>
        <h3 className="text-lg font-semibold mb-2">
          Debt-to-Equity Ratio Trend (5 Years)
        </h3>
        <div className="h-64 bg-card rounded-lg p-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={debtEquityData}>
              <XAxis
                dataKey="name"
                stroke="var(--color-muted-foreground)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                domain={["auto", "auto"]}
                stroke="var(--color-muted-foreground)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <ChartTooltip
                contentStyle={{
                  backgroundColor: "var(--color-card)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="Debt to Equity Ratio"
                stroke="rgba(239, 68, 68, 0.8)"
                strokeWidth={2}
                dot={{ fill: "rgba(239, 68, 68, 0.8)", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Key Takeaways */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Key Takeaways</h3>
        <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
          {data.keyTakeaways.map((takeaway, index) => (
            <li key={index}>{takeaway}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
