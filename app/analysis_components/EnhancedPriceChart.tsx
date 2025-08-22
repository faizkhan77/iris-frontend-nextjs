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
import ChartCard from "./ChartCard";

import {
  ChartContainer,
  ChartTooltipContent,
  ChartConfig,
} from "@/components/ui/chart";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
// const API_BASE_URL = "https://irisapi.brainfogagency.com/api";

interface EnhancedPriceChartProps {
  stockId: string;
  stockName: string;
}

// Reverted to your old chartConfig for the preferred single-color price line and MA colors
const chartConfig = {
  price: { label: "Price", color: "#0dd3ff" },
  dma50: { label: "50D MA", color: "hsl(var(--chart-3))" }, // Orange in your screenshot
  dma200: { label: "200D MA", color: "hsl(var(--chart-2))" }, // Pink/Purple in your screenshot
  volume: { label: "Volume", color: "hsl(var(--chart-4))" }, // Grey
} satisfies ChartConfig;

export default function EnhancedPriceChart({
  stockId,
  stockName,
}: EnhancedPriceChartProps) {
  const [rawData, setRawData] = useState<any[]>([]); // This will hold the full data from API
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("1y");
  const [show50DMA, setShow50DMA] = useState(true);
  const [show200DMA, setShow200DMA] = useState(true);
  const [showVolume, setShowVolume] = useState(true);

  const chartRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  const fetchChartData = useCallback(async () => {
    if (!stockId) return;
    setIsLoading(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/stock/${stockId}/price-chart?time_range=${timeRange}`
      );
      if (!response.ok) {
        throw new Error(`Failed to fetch price data: ${response.statusText}`);
      }
      const result = await response.json();
      setRawData(result.priceData || []);
    } catch (error) {
      console.error("Failed to fetch price chart data:", error);
      setRawData([]);
    } finally {
      setIsLoading(false);
    }
  }, [stockId, timeRange]);

  useEffect(() => {
    fetchChartData();
  }, [fetchChartData]);

  // --- THIS IS THE CRITICAL FIX ---
  // This hook takes the full rawData and slices it to the visible range for the chart.
  const chartData = useMemo(() => {
    if (!rawData || rawData.length === 0) return [];

    // Base the start date calculation on the LATEST date in our dataset
    const lastDataPointDate = new Date(rawData[rawData.length - 1].date);
    let startDate = new Date(lastDataPointDate);

    // Calculate the start date for the visible window
    switch (timeRange) {
      case "1m":
        startDate.setMonth(lastDataPointDate.getMonth() - 1);
        break;
      case "6m":
        startDate.setMonth(lastDataPointDate.getMonth() - 6);
        break;
      case "1y":
        startDate.setFullYear(lastDataPointDate.getFullYear() - 1);
        break;
      case "3y":
        startDate.setFullYear(lastDataPointDate.getFullYear() - 3);
        break;
      case "5y":
        startDate.setFullYear(lastDataPointDate.getFullYear() - 5);
        break;
      case "max":
        // For "max", we want to show everything, so we don't filter.
        return rawData;
      default:
        startDate.setFullYear(lastDataPointDate.getFullYear() - 1);
    }

    // Filter the rawData to get only the data points within the visible window
    return rawData.filter((item) => new Date(item.date) >= startDate);
  }, [rawData, timeRange]);

  // FIX #2: Revert to your preferred color scheme from the old code
  const chartColors = useMemo(() => {
    if (theme === "light") {
      // You can define light theme colors here if you want
      return {
        price: "#115e59",
        dma50: "#b45309",
        dma200: "#be123c",
        volume: "#9ca3af",
      };
    }
    // Dark Theme Palette from your screenshot/old code
    return {
      price: "#2dd4bf",
      dma50: "#fb923c",
      dma200: "#f472b6",
      volume: "#4b5563",
    };
  }, [theme]);

  // FIX #3: Intelligent date formatter based on the visible data range
  const formatDateTick = (tick: string) => {
    if (!chartData || chartData.length < 2) return tick;

    const firstDate = new Date(chartData[0].date);
    const lastDate = new Date(chartData[chartData.length - 1].date);
    const rangeInDays =
      (lastDate.getTime() - firstDate.getTime()) / (1000 * 3600 * 24);

    const date = new Date(tick);
    if (rangeInDays <= 90) {
      // Approx 3 months or less
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }
    if (rangeInDays <= 730) {
      // Approx 2 years or less
      return date.toLocaleDateString("en-US", {
        month: "short",
        year: "2-digit",
      });
    }
    return date.toLocaleDateString("en-US", { year: "numeric" });
  };

  const onSummarizeRequest = async (): Promise<string | void> => {
    /* ... */
  };
  const Controls = (
    <div className="flex items-center gap-4">
      {/* Time Range Buttons */}
      <div className="flex items-center gap-1 p-0.5 rounded-md bg-element-bg">
        {["1m", "6m", "1y", "3y", "5y", "max"].map((range) => (
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
        ) : !chartData || chartData.length === 0 ? (
          <div className="flex h-full w-full items-center justify-center text-text-secondary">
            No data available for the selected range.
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="w-full h-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={chartData}
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
                      stopColor={chartColors.price}
                      stopOpacity={0.2}
                    />
                    <stop
                      offset="95%"
                      stopColor={chartColors.price}
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
                  tickFormatter={formatDateTick}
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

                {/* --- FIX #4: Restored preferred Tooltip format --- */}
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (!active || !payload || payload.length === 0)
                      return null;

                    const price = payload.find(
                      (p) => p.dataKey === "price"
                    )?.value;
                    const dma50 = payload.find(
                      (p) => p.dataKey === "dma50"
                    )?.value;
                    const dma200 = payload.find(
                      (p) => p.dataKey === "dma200"
                    )?.value;
                    const volume = payload.find(
                      (p) => p.dataKey === "volume"
                    )?.value;
                    const prevVolume = payload[0]?.payload?.prevVolume || null;

                    const dateStr = new Date(label).toLocaleDateString(
                      "en-US",
                      {
                        month: "short",
                        day: "numeric",
                        year: "2-digit",
                      }
                    );

                    const volumeChange =
                      prevVolume && volume
                        ? (((volume - prevVolume) / prevVolume) * 100).toFixed(
                            1
                          )
                        : null;

                    return (
                      <div className="rounded-lg border bg-white p-3 shadow-md text-sm">
                        {/* Date */}
                        <div className="text-xs text-gray-500">{dateStr}</div>

                        {/* Price */}
                        {price !== undefined && (
                          <div className="font-medium text-gray-900">
                            ₹
                            {Number(price).toLocaleString("en-IN", {
                              maximumFractionDigits: 2,
                            })}
                          </div>
                        )}

                        {/* DMA Values */}
                        {dma50 !== undefined && (
                          <div className="text-gray-700">
                            DMA50: ₹{Number(dma50).toFixed(2)}
                          </div>
                        )}
                        {dma200 !== undefined && (
                          <div className="text-gray-700">
                            DMA200: ₹{Number(dma200).toFixed(2)}
                          </div>
                        )}

                        {/* Volume */}
                        {volume !== undefined && (
                          <div className="text-gray-700">
                            Vol:{" "}
                            {Number(volume) >= 1_000_000
                              ? `${(volume / 1_000_000).toFixed(1)}M`
                              : Number(volume) >= 1_000
                              ? `${(volume / 1_000).toFixed(0)}k`
                              : volume.toLocaleString()}{" "}
                            {volumeChange !== null && (
                              <span className="text-xs text-gray-500">
                                [D: {volumeChange}%]
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  }}
                />

                <Legend wrapperStyle={{ fontSize: "12px" }} />

                {/* FIX #3: Reverted to a single, simple Area component */}
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
