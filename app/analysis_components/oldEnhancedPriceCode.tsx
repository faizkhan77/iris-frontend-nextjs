"use client";

import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from "react";
import { useTheme } from "next-themes";
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import * as htmlToImage from "html-to-image";
import { cn } from "@/lib/utils";
import ChartCard from "./ChartCard"; // <-- Import the new container

import {
  ChartContainer,
  ChartTooltipContent,
  ChartConfig,
} from "@/components/ui/chart";

const API_BASE_URL = "http://127.0.0.1:8000/api";

interface EnhancedPriceChartProps {
  stockId: number;
  stockName: string;
}

const chartConfig = {
  price: { label: "Price", color: "#0dd3ff" },
  dma50: { label: "50D MA", color: "hsl(var(--chart-3))" },
  dma200: { label: "200D MA", color: "hsl(var(--chart-2))" },
  volume: { label: "Volume", color: "hsl(var(--chart-4))" },
} satisfies ChartConfig;

export default function EnhancedPriceChart({
  stockId,
  stockName,
}: EnhancedPriceChartProps) {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("1y");
  const [show50DMA, setShow50DMA] = useState(true);
  const [show200DMA, setShow200DMA] = useState(true);
  const [showVolume, setShowVolume] = useState(true);

  const chartRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  const strokeColor = theme === "dark" ? "#10b981" : "#059669";

  const fetchChartData = useCallback(async () => {
    if (!stockId) return;
    setIsLoading(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/stock/${stockId}/price-chart?time_range=${timeRange}`
      );
      if (!response.ok) throw new Error("Failed to fetch price data");
      const result = await response.json();
      setData(result.priceData || []);
    } catch (error) {
      console.error("Failed to fetch price chart data:", error);
      setData([]);
    } finally {
      setIsLoading(false);
    }
  }, [stockId, timeRange]);

  useEffect(() => {
    fetchChartData();
  }, [fetchChartData]);

  // --- Dynamic Chart Colors ---
  const chartColors = useMemo(() => {
    if (theme === "light") {
      return {
        price: "#115e59", // Dark Teal
        dma50: "#b45309", // Amber
        dma200: "#be123c", // Rose
        volume: "#9ca3af", // Cool Gray
        grid: "#e5e7eb", // Gray 200 for grid lines
      };
    }
    // Dark Theme Palette
    return {
      price: "#2dd4bf", // Bright Teal
      dma50: "#fb923c", // Bright Orange
      dma200: "#f472b6", // Bright Pink
      volume: "#4b5563", // Gray 600 (semi-transparent feel)
      grid: "rgba(255, 255, 255, 0.1)", // Subtle white grid lines
    };
  }, [theme]);

  const onSummarizeRequest = async (): Promise<string | void> => {
    if (chartRef.current) {
      try {
        const dataUrl = await htmlToImage.toPng(chartRef.current);
        const imageBase64 = dataUrl.split(",")[1];
        // Here you would call your Gemini service
        console.log(
          "Captured chart image for summarization:",
          imageBase64.substring(0, 50) + "..."
        );
        return `Summary for ${stockName} price chart...`; // Placeholder
      } catch (error) {
        console.error("Error capturing chart:", error);
      }
    }
  };

  const Controls = (
    <div className="flex items-center gap-4">
      {/* Time Range Buttons */}
      <div className="flex items-center gap-1 p-0.5 rounded-md bg-element-bg">
        {["1m", "6m", "1y", "3y", "5y"].map((range) => (
          <button
            key={range}
            onClick={() => setTimeRange(range)}
            className={cn(
              "px-2 py-1 text-xs font-medium rounded transition-colors",
              timeRange === range
                ? "bg-accent text-accent-foreground shadow-sm"
                : "text-text-secondary hover:text-text-primary"
            )}
          >
            {range.toUpperCase()}
          </button>
        ))}
      </div>
      {/* Checkboxes */}
      <div className="hidden md:flex items-center gap-3">
        {[
          { label: "Volume", state: showVolume, setState: setShowVolume },
          { label: "50D MA", state: show50DMA, setState: setShow50DMA },
          { label: "200D MA", state: show200DMA, setState: setShow200DMA },
        ].map((item) => (
          <label
            key={item.label}
            className="flex items-center gap-2 cursor-pointer text-xs text-text-secondary"
          >
            <input
              type="checkbox"
              checked={item.state}
              onChange={() => item.setState((v) => !v)}
              className="h-4 w-4 rounded border-element-border-hover bg-element-bg text-accent focus:ring-accent accent-accent"
            />
            {item.label}
          </label>
        ))}
      </div>
    </div>
  );

  return (
    <ChartCard
      title="Price Chart"
      controls={Controls}
      chartRef={chartRef}
      onSummarizeRequest={onSummarizeRequest}
    >
      <div className="h-[450px] w-full">
        {isLoading ? (
          <div className="flex h-full w-full items-center justify-center text-text-secondary">
            Loading Chart...
          </div>
        ) : !data || data.length === 0 ? (
          <div className="flex h-full w-full items-center justify-center text-text-secondary">
            No data available.
          </div>
        ) : (
          // --- THIS IS THE FIX: Wrap with ChartContainer ---
          <ChartContainer config={chartConfig} className="w-full h-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={data}
                margin={{ top: 5, right: 5, left: -25, bottom: 5 }}
              >
                <defs>
                  <linearGradient
                    id="priceAreaGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor="var(--color-price)"
                      stopOpacity={0.2}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--color-price)"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--element-border)"
                />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 10 }}
                  tickLine={false}
                  axisLine={false}
                  stroke="var(--text-secondary)"
                />
                <YAxis
                  yAxisId="price"
                  orientation="left"
                  tick={{ fontSize: 10 }}
                  tickLine={false}
                  axisLine={false}
                  stroke="var(--text-secondary)"
                />
                {showVolume && (
                  <YAxis
                    yAxisId="volume"
                    orientation="right"
                    tick={{ fontSize: 10 }}
                    tickLine={false}
                    axisLine={false}
                    stroke="var(--text-secondary)"
                  />
                )}

                <Tooltip
                  content={
                    <ChartTooltipContent
                      indicator="dot"
                      labelFormatter={(value) =>
                        new Date(value).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "2-digit",
                        })
                      }
                      formatter={(value, name) =>
                        name === "Volume"
                          ? Number(value).toLocaleString()
                          : `₹${Number(value).toFixed(2)}`
                      }
                    />
                  }
                />

                <Legend wrapperStyle={{ fontSize: "12px" }} />

                <Area
                  yAxisId="price"
                  type="monotone"
                  dataKey="price"
                  name="Price"
                  stroke={chartColors.price}
                  fill="url(#priceAreaGradient)"
                  strokeWidth={2}
                />
                {show50DMA && (
                  <Line
                    yAxisId="price"
                    type="monotone"
                    dataKey="dma50"
                    name="50D MA"
                    stroke={chartColors.dma50}
                    dot={false}
                    strokeWidth={1.5}
                  />
                )}
                {show200DMA && (
                  <Line
                    yAxisId="price"
                    type="monotone"
                    dataKey="dma200"
                    name="200D MA"
                    stroke={chartColors.dma200}
                    dot={false}
                    strokeWidth={1.5}
                  />
                )}
                {showVolume && (
                  <Bar
                    yAxisId="volume"
                    dataKey="volume"
                    name="Volume"
                    fill={chartColors.volume}
                  />
                )}
              </ComposedChart>
            </ResponsiveContainer>
          </ChartContainer>
        )}
      </div>
    </ChartCard>
  );
}
