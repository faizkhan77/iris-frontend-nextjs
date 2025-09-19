import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { chatapi } from "./chat.api";
import type { ChatMessage, Conversation, ShareChatState } from "./types";

interface ChatState {
  showHistory: boolean;
  conversations: Conversation[];
  activeSession?: string | null;
  messages: ChatMessage[];
  loading: boolean;
  inputValue: string;
  share : ShareChatState
}

const initialState: ChatState = {
  loading: false,
  showHistory: false,
  conversations: [],
  messages: [],
  activeSession: null,
  inputValue: "",
  share : {
    session_id : null,
    message : null,
    modal : false
  }
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setInputValue: (state, action: PayloadAction<string>) => {
      state.inputValue = action.payload;
    },
    setShowHistory: (state, action: PayloadAction<boolean>) => {
      state.showHistory = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setActiveSession: (state, action: PayloadAction<string | null>) => {
      state.activeSession = action.payload;
    },
    clickShareMessage : (state , action : PayloadAction<ChatMessage>)=>{
      state.share.message = action.payload
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
      // Clear the input field after the message is sent
      state.inputValue = "";
    });
    builder.addMatcher(
      chatapi.endpoints.sendMessage.matchFulfilled,
      (state, action) => {
        state.loading = false;

        // push AI message when the API call succeeds
        state.messages.push({
          id: action.payload.message.message_id,
          role: "assistant",
          content: JSON.stringify(action.payload.message),
          created_at: new Date().toISOString(),
        });
      }
    );
  },
});

export const {
  setInputValue,
  setShowHistory,
  setActiveSession,
  addMessage,
  setMessages,
  addAiMessage,
  setLoading,
  clickShareMessage
} = chatSlice.actions;

export default chatSlice.reducer;
