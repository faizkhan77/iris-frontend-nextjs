export interface Conversation {
  id: string;
  user_id: string;
  langgraph_thread_id: string;
  started_at: string;
  ended_at: string | null;
  created_at: string;
  summary: string | null;
}