import { api } from "@/redux/api/api";
import type { StockSummaryRequest, StockSummaryResponse } from "./types";

export const companyApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({

    getAllStockSummary: builder.query<StockSummaryResponse, StockSummaryRequest>({
      query: ({ selectedIndicators }) => {
        const params = new URLSearchParams({
          selectedIndicators: selectedIndicators.join(","),
        });

        return {
          url: `/company/stock?${params.toString()}`,
          method: "GET",
        };
      },
    }),
  }),
});

export const { useGetAllStockSummaryQuery } = companyApi;