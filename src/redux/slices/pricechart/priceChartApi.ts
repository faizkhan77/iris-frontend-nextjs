import { api } from "@/redux/api/api";
import type { PriceChartResponse } from "./types"; 
interface PriceChartRequest {
  stockId: string;
  timeRange: string;
}

export const stockApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getPriceChart: builder.query<PriceChartResponse, PriceChartRequest>({
      query: ({ stockId, timeRange }) => ({
        url: `/company/stock/${stockId}/price-chart`,
        method: "GET",
        params: { time_range: timeRange },
      }),

    }),
  }),
});

export const { useGetPriceChartQuery } = stockApi;