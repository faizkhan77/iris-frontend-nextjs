// app/page.tsx
"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";

import ChatHeader from "./components/ChatHeader";
// import ChatFooter from "./components/ChatInputForm";
import WelcomeScreen from "./components/WelcomeScreen";

import { useAppStore } from "./lib/store";
import { v4 as uuidv4 } from "uuid";
import { streamChatResponse, fetchSessionMessages } from "./lib/api";
import ChatInputForm from "./components/ChatInputForm";
import Sidebar from "./components/Sidebar";
import ChatMessages, { Message } from "./components/ChatMessages";
// import ChatInput from "./components/ChatInput";

export default function ChatPage() {
  const router = useRouter();
  const { user, threadId, setThreadId } = useAppStore();
  const [isInitialState, setIsInitialState] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) router.replace("/login");
    else if (!threadId) setThreadId(`thread_web_${uuidv4()}`);
  }, [user, threadId, router, setThreadId]);

  // --- THIS IS THE KEY LOGIC CHANGE ---
  useEffect(() => {
    // This effect runs whenever the active threadId changes.
    async function loadMessages() {
      if (!threadId) return;

      // Show a loading state briefly
      setIsLoading(true);
      try {
        const historicalMessages = await fetchSessionMessages(threadId);

        if (historicalMessages && historicalMessages.length > 0) {
          // We have history, so transition to the chat view.
          setMessages(
            historicalMessages.map((msg) => ({
              id: uuidv4(), // Generate a unique ID for the key prop
              role: msg.role,
              content: msg.content,
              timestamp: new Date(msg.timestamp), // Convert ISO string to Date object
            }))
          );
          setIsInitialState(false);
        } else {
          // No history, this is a new chat. Stay on the welcome screen.
          setMessages([]);
          setIsInitialState(true);
        }
      } catch (error) {
        console.error("Failed to load session history:", error);
        // Handle error, maybe show a toast notification
        setMessages([]);
        setIsInitialState(true);
      } finally {
        setIsLoading(false);
      }
    }

    loadMessages();
  }, [threadId]); // Dependency array ensures this runs on threadId change.

  useEffect(() => {
    // Scroll to bottom after messages are loaded or a new one is added
    messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
  }, [messages]);

  const handleSendMessage = async (input: string) => {
    if (!threadId || !user) return;
    if (isInitialState) setIsInitialState(false);

    const userMessage: Message = {
      id: uuidv4(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    // Use a variable to hold the complete assistant message content as it builds.
    let assistantContent = "";

    // Create a unique ID for the assistant's message placeholder.
    const assistantMessageId = uuidv4();

    // Add the user message and an initial, empty assistant message placeholder.
    setMessages((prev) => [
      ...prev,
      userMessage,
      {
        id: assistantMessageId,
        role: "assistant",
        content: "",
        timestamp: new Date(),
        isThinkingPlaceholder: true,
      },
    ]);

    setIsLoading(true);

    try {
      await streamChatResponse(
        { user_identifier: user.email, user_input: input, thread_id: threadId },
        (chunk) => {
          // Append the character chunk to our local variable.
          assistantContent += chunk;

          // Update the state. This functional form is key.
          // It finds the correct message by its unique ID and replaces its content.
          setMessages((prevMessages) =>
            prevMessages.map((msg) =>
              msg.id === assistantMessageId
                ? {
                    ...msg,
                    content: assistantContent,
                    isThinkingPlaceholder: false,
                  }
                : msg
            )
          );
        }
      );
    } catch (error) {
      console.error("Streaming failed:", error);
      // If an error occurs, update the placeholder with an error message.
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantMessageId
            ? {
                ...m,
                content: "An error occurred. Please try again.",
                isThinkingPlaceholder: false,
              }
            : m
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="flex h-screen bg-[var(--background)] text-gray-300 overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 h-full">
        {/* Conditionally render based on initial state OR if loading history */}
        {isInitialState && !isLoading ? null : <ChatHeader />}

        <div
          className={`flex-grow flex flex-col overflow-y-auto custom-scrollbar relative ${
            isInitialState ? "items-center justify-center" : "items-start"
          }`}
        >
          {isLoading && messages.length === 0 && (
            <div className="m-auto">Loading chat history...</div>
          )}

          {!isLoading && isInitialState && (
            <WelcomeScreen
              onSendMessage={handleSendMessage}
              isProcessing={isLoading}
            />
          )}

          {!isInitialState && (
            <>
              <ChatMessages messages={messages} />
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Only show footer when in chat view */}
        {!isInitialState && (
          <footer className="w-full px-4 md:px-6 pb-4 pt-2 shrink-0 bg-[var(--background)] sticky bottom-0 border-t border-[var(--border-color)]">
            <ChatInputForm
              onSendMessage={handleSendMessage}
              isProcessing={isLoading}
            />
          </footer>
        )}
      </div>
    </div>
  );
}
