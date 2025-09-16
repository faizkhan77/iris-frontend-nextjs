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
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

// Data shape definition
export interface ShareholdingDataItem {
  name: string;
  value: number;
}

interface ShareholdingPieChartProps {
  data: ShareholdingDataItem[];
  title: string;
  description?: string;
  animationDuration?: number;
}

interface CustomPieLabelProps extends React.SVGProps<SVGTextElement> {
  payload?: {
    name: string;
    value: number;
    [key: string]: any;
  };
  value?: number;
  percent?: number;
  textAnchor?: string;
  dominantBaseline?: string;
}

// Dynamically generate chart configuration from data
const generateChartConfig = (data: ShareholdingDataItem[]): ChartConfig => {
  const colorPalette = [
    "#80bfff", // Light Blue
    "#3498db", // Dodger Blue
    "#9b59b6", // Amethyst
    "#34495e", // Wet Asphalt
    "#1abc9c", // Turquoise
  ];

  const config: ChartConfig = {
    value: {
      label: "Percentage",
    },
  };

  data.forEach((item, index) => {
    // Sanitize the name to create a valid key (e.g., "FIIs (Foreign)" -> "fiisforeign")
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
  description,
  animationDuration = 800,
}: ShareholdingPieChartProps) {
  const chartConfig = generateChartConfig(data);

  // Map data to the format expected by Recharts, adding the 'fill' color
  const chartData = data.map((item) => {
    const key = item.name.toLowerCase().replace(/[\s()]/g, "");
    return {
      name: item.name,
      value: item.value,
      fill: chartConfig[key]?.color || "hsl(var(--chart-1))",
    };
  });

  return (
    // Updated styling to match the project's theme
    <Card className="flex flex-col border-element-border bg-element-bg">
      <CardHeader className="items-center pb-0">
        <CardTitle className="text-text-primary">{title}</CardTitle>
        {description && (
          <CardDescription className="text-text-secondary">
            {description}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[300px]"
        >
          <PieChart animationDuration={animationDuration}>
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  hideLabel
                  className="bg-background text-text-primary border border-element-border rounded-md px-2 py-1"
                  formatter={(value, name) => [`${value}%`, name]}
                />
              }
            />
            {/* IMPORTANT: The Pie component was commented out; it is now active */}
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              innerRadius={60}
              strokeWidth={3}
              stroke="hsl(var(--background))"
              outerRadius={100}
              label={({
                payload,
                value,
                percent,
                x,
                y,
                textAnchor,
                dominantBaseline,
              }: CustomPieLabelProps) => {
                if (!payload || typeof payload.value !== "number") return null;
                return (
                  <text
                    x={x}
                    y={y}
                    textAnchor={textAnchor}
                    dominantBaseline={dominantBaseline}
                    className="fill-text-primary text-[10px] font-medium"
                  >
                    {`${payload.value.toFixed(1)}%`}
                  </text>
                );
              }}
              labelLine={{
                stroke: "hsl(var(--muted-foreground))",
                strokeWidth: 0.5,
              }}
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm pt-4">
        <div className="flex w-full flex-wrap items-center justify-center gap-x-4 gap-y-1">
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
                  <span className="text-xs text-text-secondary">
                    {config.label}
                  </span>
                </div>
              );
            })}
        </div>
      </CardFooter>
    </Card>
  );
}
