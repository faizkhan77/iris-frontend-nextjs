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
  text_response: string;
  ui_components: any[];
  message_id: string; // UUID comes as string in JSON
  route: string;
}

export interface ChatMessage {
  id: string; // UUID
  role: "user" | "assistant";
  content: string | AiResponse;
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

export interface UIComponent {
  type: string;
  props?: Record<string, any>;
}

export type MessageContent =  string | {
      text: string;
      ui?: UIComponent[];
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
  components: UIComponent[];
}
