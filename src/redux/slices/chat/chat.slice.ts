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
}

const initialState: ChatState = {
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
    setActiveSession: (state, action: PayloadAction<string | null>) => {
      state.activeSession = action.payload;
    },
    addMessage: (state, action: PayloadAction<ChatMessage>) => {
      state.messages.push(action.payload);
    },
    setMessages : (state, action: PayloadAction<ChatMessage[]>)=>{
      state.messages = action.payload
    }
  },
  extraReducers: (builder) => {
    // builder.addMatcher(
    //   chatapi.endpoints.getSingleConversation.matchFulfilled,
    //   (state, action: PayloadAction<string>) => {
    //     state.token = action.payload.access_token;
    //   }
    // );
  },
});

export const {
  setShowHistory,
  setActiveSession,
  addMessage,
  setMessages
} = chatSlice.actions;

export default chatSlice.reducer;
