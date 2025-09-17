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
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

// --- Type Definitions ---
export interface ChartDataItem {
  [key: string]: string | number;
}

// This interface describes the shape of the `data` prop this component will receive
export interface RankingBarChartDataPayload {
  data: ChartDataItem[]; // The AI sends the array under the key "data"
  labelKey: string;
  valueKey: string;
}

interface RankingBarChartProps {
  title: string;
  data: RankingBarChartDataPayload;
  animationDuration?: number;
}

const formatIndianCurrency = (value: number) => {
  if (value >= 1_00_00_000) return `${(value / 1_00_00_000).toFixed(0)} Cr`;
  if (value >= 1_00_000) return `${(value / 1_00_000).toFixed(0)} L`;
  return value.toString();
};

export function RankingBarChart({
  title,
  data,
  animationDuration = 500,
}: RankingBarChartProps) {
  // "Adapter" logic: Destructure the props from the `data` object
  const { data: chartItems, labelKey, valueKey } = data;

  if (!chartItems || !labelKey || !valueKey) {
    return <div className="text-text-secondary">Chart data is incomplete.</div>;
  }

  const chartConfig: ChartConfig = {
    [valueKey]: {
      label: valueKey
        .replace(/_/g, " ")
        .replace(/\b\w/g, (l) => l.toUpperCase()),
      color: "hsl(var(--chart-1))", // Use theme-aware color
    },
  };

  const chartData = [...chartItems].reverse();

  return (
    <Card className="border-element-border bg-element-bg">
      <CardHeader>
        <CardTitle className="text-text-primary">{title}</CardTitle>
        <CardDescription className="text-text-secondary">
          Ranked results from your query
        </CardDescription>
      </CardHeader>

      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ left: 0, right: 50 }}
            animationDuration={animationDuration}
          >
            <CartesianGrid
              horizontal={false}
              stroke="var(--element-border)"
              opacity={0.5}
            />
            <YAxis dataKey={labelKey} type="category" hide />
            <XAxis dataKey={valueKey} type="number" hide />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  indicator="line"
                  className="bg-background text-text-primary border border-element-border"
                />
              }
            />
            <Bar
              dataKey={valueKey}
              layout="vertical"
              fill="var(--chart-1)"
              radius={4}
            >
              <LabelList
                dataKey={labelKey}
                position="insideLeft"
                offset={8}
                className="fill-white font-medium"
                fontSize={12}
              />
              <LabelList
                dataKey={valueKey}
                position="right"
                offset={8}
                className="fill-text-secondary"
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
