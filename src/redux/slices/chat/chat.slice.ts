import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { chatapi } from "./chat.api";
import type { ChatMessage, ChatSession, Conversation } from "./types";

interface ChatState {
  showHistory: boolean;
  conversations : Conversation[],
  activeSession?: ChatSession | null;
  messages: ChatMessage[];
}

const initialState: ChatState = {
  showHistory: false,
  conversations : [],
  messages : [],
  activeSession : null
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setShowHistory: (state, action: PayloadAction<boolean>) => {
      state.showHistory = action.payload;
    },
    setActiveSession: (state, action: PayloadAction<ChatSession | null>) => {
      state.activeSession = action.payload;
      state.messages = action.payload ? action.payload.messages : [];
    },
    addMessage: (state, action: PayloadAction<ChatMessage>) => {
      state.messages.push(action.payload);
    },
    clearMessages: (state) => {
      state.messages = [];
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      chatapi.endpoints.getConversations.matchFulfilled,
      (state, action) => {
        state.conversations = action.payload.conversations
      }
    )
  },
});

export const { setShowHistory } = chatSlice.actions;

export default chatSlice.reducer;
