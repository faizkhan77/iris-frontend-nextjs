import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import {companyApi  } from "./company.api";
import type { StockSummaryResponse } from "./types";

interface StockSummaryState {
  data: StockSummaryResponse | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: StockSummaryState = {
  data: null,
  isLoading: false,
  error: null,
};

const stockSummarySlice = createSlice({
  name: "stockSummary",
  initialState,
  reducers: {
    clearStockSummary: (state) => {
      state.data = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        companyApi.endpoints.getAllStockSummary.matchPending,
        (state) => {
          state.isLoading = true;
          state.error = null;
        }
      )
      .addMatcher(
        companyApi.endpoints.getAllStockSummary.matchFulfilled,
        (state, action: PayloadAction<StockSummaryResponse>) => {
          state.isLoading = false;
          state.data = action.payload || null;
        }
      )
      .addMatcher(
        companyApi.endpoints.getAllStockSummary.matchRejected,
        (state, action) => {
          state.isLoading = false;
          state.error =
            action.error.message || "Failed to fetch stock summary";
          state.data = null;
        }
      );
  },
});

export const { clearStockSummary } = stockSummarySlice.actions;
export default stockSummarySlice.reducer;
