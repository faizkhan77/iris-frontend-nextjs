// in a file like 'stock/types.ts'

export interface PriceChartDataPoint {
  // Define the structure of a single data point in your chart
  // For example:
  date: string;
  price: number;
}

export interface PriceChartResponse {
  priceData: PriceChartDataPoint[];
  // Add any other properties that your API returns
}