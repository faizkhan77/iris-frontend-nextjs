import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface ChatState {
 showHistory : boolean
}

const initialState: ChatState = {
  showHistory : false
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setShowHistory: (state,action : PayloadAction<boolean>) => {
        state.showHistory = action.payload
    }
  },
  extraReducers: (builder) => {},
});

export const {
    setShowHistory
} = chatSlice.actions;

export default chatSlice.reducer;
