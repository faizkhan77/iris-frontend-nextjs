export interface Conversation {
  id: string;
  user_id: string;
  langgraph_thread_id: string;
  started_at: string;
  ended_at: string | null;
  created_at: string;
  summary: string | null;
}

export interface ChatMessage {
  id: string;          // UUID
  role: "user" | "assistant"
  content: string;     
  created_at: string;  // ISO datetime string
}

export interface ChatSession {
  id: string;               // UUID
  started_at: string;       // ISO datetime string
  ended_at?: string | null; // optional ISO datetime
  summary?: string | null;
  messages: ChatMessage[];
}
