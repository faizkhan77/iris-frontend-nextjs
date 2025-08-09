// lib/api.ts
import { UiComponent } from "../components/ChatMessages";


const API_BASE_URL = "http://localhost:8000";

// --- Types for Login and History (Unchanged) ---
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

export const loginUser = async (
  credentials: LoginCredentials
): Promise<UserProfile> => {
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Login failed");
  }
  return response.json();
};

export interface ChatSession {
  id: number;
  user_id: number;
  thread_id: string;
  created_at: string;
  started_at: string;
  last_message_at: string;
}

export const fetchChatHistory = async (
  userId: number
): Promise<ChatSession[]> => {
  const response = await fetch(`${API_BASE_URL}/users/${userId}/sessions`);
  if (!response.ok) {
    throw new Error("Failed to fetch chat history");
  }
  return response.json();
};

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export const fetchSessionMessages = async (
  threadId: string
): Promise<ChatMessage[]> => {
  const response = await fetch(`${API_BASE_URL}/sessions/${threadId}/messages`);
  if (!response.ok) {
    if (response.status === 404) {
      return [];
    }
    throw new Error("Failed to fetch session messages");
  }
  return response.json();
};

// --- START: NEW AND UPDATED STREAMING LOGIC ---

// Define the shape of the request payload
interface ChatRequest {
  user_identifier: string;
  user_input: string;
  thread_id: string;
}

// Define a new callbacks interface for handling different event types
interface StreamCallbacks {
  onUiComponent: (components: UiComponent[]) => void;
  onTextChunk: (chunk: string) => void;
  onMessageComplete: (data: { messageId: number }) => void; 
  onError: (error: string) => void;
  onClose: () => void;
}

/**
 * Handles streaming chat responses using Server-Sent Events (SSE).
 * This function manually parses the SSE stream from a POST request,
 * which is more robust than the native EventSource API.
 */
export const streamChatResponse = async (
  payload: ChatRequest,
  callbacks: StreamCallbacks
) => {
  const { onUiComponent, onTextChunk, onMessageComplete, onError, onClose } = callbacks;

  try {
    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "text/event-stream",
      },
      body: JSON.stringify(payload),
    });

    if (!response.body) {
      throw new Error("Response body is null");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    // This loop continuously reads from the stream
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }

      // Add the new data to our buffer
      buffer += decoder.decode(value, { stream: true });

      // Process all complete messages in the buffer
      let boundary = buffer.indexOf("\n\n");
      while (boundary !== -1) {
        const messageChunk = buffer.substring(0, boundary);
        buffer = buffer.substring(boundary + 2);

        // Extract event and data from the message
        const eventLine = messageChunk
          .split("\n")
          .find((line) => line.startsWith("event: "));
        const dataLine = messageChunk
          .split("\n")
          .find((line) => line.startsWith("data: "));

        if (eventLine && dataLine) {
          const event = eventLine.replace("event: ", "").trim();
          const dataPayload = dataLine.replace("data: ", "").trim();
          const data = JSON.parse(dataPayload);

          // Call the appropriate callback based on the event type
          switch (event) {
            case "ui_component":
              onUiComponent(data);
              break;
            case "text_chunk":
              onTextChunk(data.chunk);
              break;
            case "message_complete":
                onMessageComplete(data);
                break;
            case "error":
              onError(data.error);
              break;
            case "end":
              onClose();
              return; // End the entire process
          }
        }
        boundary = buffer.indexOf("\n\n");
      }
    }
  } catch (error) {
    console.error("Chat streaming failed:", error);
    onError("Failed to connect to the server. Please try again.");
    onClose();
  }
};
// --- END: NEW AND UPDATED STREAMING LOGIC ---