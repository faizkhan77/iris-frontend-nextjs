import { createSlice } from "@reduxjs/toolkit";
import { newsApi } from "./news.api";
import type { NewsArticle } from "./types";

interface NewsState {
  
}

const initialState: NewsState = {
};

const newsSlice = createSlice({
  name: "news",
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
  },
});

export const { } = newsSlice.actions;

export default newsSlice.reducer;
