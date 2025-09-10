import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { stockApi } from "./priceChartApi";
import type { PriceChartResponse } from "./types";

// Define the state type
interface StockChartState {
  rawData: any[]; // Or a more specific type if you have one
  isLoading: boolean;
  error: string | null;
}

// Initial state
const initialState: StockChartState = {
  rawData: [],
  isLoading: false,
  error: null,
};

// Create the slice
const stockSlice = createSlice({
  name: "stockChart",
  initialState,
  reducers: {
    // You can add other reducers here if needed, for example, to clear the data
    clearChartData: (state) => {
      state.rawData = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        stockApi.endpoints.getPriceChart.matchPending,
        (state) => {
          state.isLoading = true;
          state.error = null;
        }
      )
      .addMatcher(
        stockApi.endpoints.getPriceChart.matchFulfilled,
        (state, action: PayloadAction<PriceChartResponse>) => {
          state.isLoading = false;
          state.rawData = action.payload.priceData || [];
        }
      )
      .addMatcher(
        stockApi.endpoints.getPriceChart.matchRejected,
        (state, action) => {
          state.isLoading = false;
          // You might want to customize the error message
          state.error = action.error.message || "Failed to fetch price chart data";
          state.rawData = [];
        }
      );
  },
});

// Export actions
export const { clearChartData } = stockSlice.actions;

// Export reducer
export default stockSlice.reducer;