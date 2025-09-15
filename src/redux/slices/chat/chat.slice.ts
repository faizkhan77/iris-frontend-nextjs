import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { chatapi } from "./chat.api";
import type {
  AiResponse,
  ChatMessage,
  Conversation,
  MessageContent,
} from "./types";

interface ChatState {
  showHistory: boolean;
  conversations: Conversation[];
  activeSession?: string | null;
  messages: ChatMessage[];
  loading: boolean;
}

const initialState: ChatState = {
  loading: false,
  showHistory: false,
  conversations: [],
  messages: [],
  activeSession: null,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setShowHistory: (state, action: PayloadAction<boolean>) => {
      state.showHistory = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setActiveSession: (state, action: PayloadAction<string | null>) => {
      state.activeSession = action.payload;
    },
    addMessage: (state, action: PayloadAction<ChatMessage>) => {
      state.messages.push(action.payload);
    },
    addAiMessage: (state, action: PayloadAction<ChatMessage>) => {
      state.messages.push(action.payload);
    },
    setMessages: (state, action: PayloadAction<ChatMessage[]>) => {
      state.messages = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(chatapi.endpoints.sendMessage.matchPending, (state) => {
      state.loading = true;
    });
    builder.addMatcher(
      chatapi.endpoints.sendMessage.matchFulfilled,
      (state, action) => {
        state.loading = false;
        

        // push AI message immediately
        state.messages.push({
          id: action.payload.message.message_id, // backend id if available
          role: "assistant",
          content: JSON.stringify(action.payload.message), // keep same format
          created_at: new Date().toISOString(),
        });
      }
    );
  },
});

export const {
  setShowHistory,
  setActiveSession,
  addMessage,
  setMessages,
  addAiMessage,
  setLoading,
} = chatSlice.actions;

export default chatSlice.reducer;
