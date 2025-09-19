export interface ChatRequest {
  message: string;
  chat_session_id?: string; // UUIDs come as strings in JSON
}

export interface Conversation {
  id: string;
  user_id: string;
  langgraph_thread_id: string;
  started_at: string;
  ended_at: string | null;
  created_at: string;
  summary: string | null;
}

export interface AiResponse {
  message(message: any): unknown;
  text_response: string;
  data: any;
  ui_components: UiComponent[];
  message_id: string; // UUID comes as string in JSON
  route: string;
}

export interface ShareChatState {
  session_id: string | null;
  message: ChatMessage | null;
  modal: boolean;
}

export interface ChatMessage {
  id: string; // UUID
  role: "user" | "assistant";
  content: string;
  created_at: string; // ISO datetime string
}

export interface ChatSession {
  id: string; // UUID
  started_at: string; // ISO datetime string
  ended_at?: string | null; // optional ISO datetime
  summary?: string | null;
  messages: ChatMessage[];
}

// ----------------------

type UiComponent = {
  type: string;
  title?: string;
  data?: any;
};

export type MessageContent =
  | string
  | {
      text: string;
      ui?: UiComponent[];
    };

// Reducer payloads
export interface UpdateMessagePayload {
  id: string;
  chunk: string;
}

export interface FinalizeMessagePayload {
  tempId: string;
  realId: string;
}

export interface AttachUiComponentPayload {
  id: string;
  components: UiComponent[];
}
