// lib/api.ts
const API_BASE_URL = "http://localhost:8000";

export interface LoginCredentials {
  email: string;
  name?: string;
}

export interface UserProfile {
  message: string;
  user_id: number;
  email: string;
  name: string;
}

export const loginUser = async (credentials: LoginCredentials): Promise<UserProfile> => {
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Login failed');
  }
  return response.json();
};

export interface ChatSession {
    id: number;
    user_id: number;
    thread_id: string;
    created_at: string;
    started_at: string; // This will be an ISO string
    last_message_at: string;
}

export const fetchChatHistory = async (userId: number): Promise<ChatSession[]> => {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/sessions`);
    if (!response.ok) {
        throw new Error('Failed to fetch chat history');
    }
    return response.json();
};

export const streamChatResponse = async (
    payload: { user_identifier: string; user_input: string; thread_id: string },
    onChunk: (chunk: string) => void
) => {
    const response = await fetch(`${API_BASE_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });

    if (!response.body) {
        throw new Error("Response body is null");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    
    while (true) {
        const { done, value } = await reader.read();
        if (done) {
            break;
        }
        const chunk = decoder.decode(value, { stream: true });
        onChunk(chunk);
    }
};


export interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
    timestamp: string; // ISO string from the backend
}

export const fetchSessionMessages = async (threadId: string): Promise<ChatMessage[]> => {
    const response = await fetch(`${API_BASE_URL}/sessions/${threadId}/messages`);
    if (!response.ok) {
        // If the session is new, the backend might return a 404 or 500.
        // We can treat "not found" as an empty array, which is a valid state for a new chat.
        if (response.status === 404) {
            return [];
        }
        throw new Error('Failed to fetch session messages');
    }
    const data = await response.json();
    return data;
};
