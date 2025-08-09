// app/page.tsx
"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";

import ChatHeader from "./components/ChatHeader";
// import ChatFooter from "./components/ChatInputForm";
import { AnimatedAIChat } from "./components/WelcomeScreen";

import { useAppStore } from "./lib/store";
import { v4 as uuidv4 } from "uuid";
import { streamChatResponse, fetchSessionMessages } from "./lib/api";
import ChatInputForm from "./components/ChatInputForm";
// import Sidebar from "./components/Sidebar";
import { motion, AnimatePresence } from "framer-motion";
import ChatMessages, { Message, UiComponent } from "./components/ChatMessages";

import SecondarySidebar from "./components/layout/SecondarySidebar";

import ScreenerPage from "./analysis_components/ScreenerPage";

import ShareModal from "./components/ShareModal";
import { PdfDocumentLayout } from "./components/PdfDocumentLayout"; // <-- Import PDF layout
import { generatePdf } from "./lib/pdfGenerator"; // <-- Import PDF generator function

// --- Placeholder component for other tabs ---
const PlaceholderScreen = ({ title }: { title: string }) => (
  <div className="flex h-full w-full items-center justify-center">
    <div className="text-center">
      <h1 className="text-4xl font-bold text-text-primary">{title}</h1>
      <p className="mt-2 text-text-secondary">This feature is coming soon.</p>
    </div>
  </div>
);

// --- ANIMATION VARIANTS FOR THE SIDEBAR ---
const sidebarVariants = {
  initial: { x: "-100%", opacity: 0 },
  animate: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.3, ease: "easeInOut" },
  },
  exit: {
    x: "-100%",
    opacity: 0,
    transition: { duration: 0.3, ease: "easeInOut" },
  },
};

export default function MainPage() {
  const router = useRouter();
  const {
    user,
    threadId,
    setThreadId,
    activePrimaryTab,
    isSecondarySidebarOpen,
  } = useAppStore();

  const [isInitialState, setIsInitialState] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [shareModalData, setShareModalData] = useState<Message | null>(null);
  const [messageToDownload, setMessageToDownload] = useState<Message | null>(
    null
  );
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const pdfLayoutRef = useRef<HTMLDivElement>(null);

  // This useEffect is now solely for triggering the PDF generation
  useEffect(() => {
    const createPdf = async () => {
      // It only runs if we are in the "generating" state and have the necessary elements
      if (isGeneratingPdf && messageToDownload && pdfLayoutRef.current) {
        await generatePdf(
          pdfLayoutRef.current,
          `IRIS-Report-${messageToDownload.messageId}.pdf`
        );
        // Reset both states after the PDF is saved
        setMessageToDownload(null);
        setIsGeneratingPdf(false);
      }
    };

    createPdf();
    // This effect depends on the 'isGeneratingPdf' flag
  }, [isGeneratingPdf, messageToDownload]);

  // All your existing useEffect hooks for auth, history, and scrolling remain unchanged
  useEffect(() => {
    if (!user) router.replace("/login");
    else if (!threadId) setThreadId(`thread_web_${uuidv4()}`);
  }, [user, threadId, router, setThreadId]);

  useEffect(() => {
    async function loadMessages() {
      if (!threadId) return;
      setIsLoading(true);
      try {
        const historicalMessages = await fetchSessionMessages(threadId);
        if (historicalMessages && historicalMessages.length > 0) {
          // --- THIS IS THE ONLY CODE BLOCK YOU NEED TO CHANGE ---
          const formattedMessages = historicalMessages.map((msg): Message => {
            let content = "";
            let uiComponents: UiComponent[] = [];

            // This logic correctly handles both old string messages and new structured JSON messages
            try {
              // Try to parse the content string from the database
              const parsedContent = JSON.parse(msg.content);

              // Check if it's the structured object we expect
              if (
                parsedContent &&
                typeof parsedContent === "object" &&
                "text_response" in parsedContent
              ) {
                content = parsedContent.text_response;
                uiComponents = parsedContent.ui_components || [];
              } else {
                // It was valid JSON, but not our structured format, so treat it as a plain string.
                content = msg.content;
              }
            } catch (error) {
              // If JSON.parse fails, it's just a plain string message.
              content = msg.content;
            }

            return {
              id: uuidv4(),
              role: msg.role as "user" | "assistant",
              content: content,
              timestamp: new Date(msg.timestamp),
              uiComponents: uiComponents,
            };
          });

          setMessages(formattedMessages);
          // --- END OF THE CHANGED CODE BLOCK ---

          setIsInitialState(false);
        } else {
          setMessages([]);
          setIsInitialState(true);
        }
      } catch (error) {
        console.error("Failed to load session history:", error);
        setMessages([]);
        setIsInitialState(true);
      } finally {
        setIsLoading(false);
      }
    }
    loadMessages();
  }, [threadId]);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Your robust handleSendMessage function remains unchanged
  const handleSendMessage = async (input: string) => {
    if (!threadId || !user) return;
    if (isInitialState) setIsInitialState(false);

    const userMessage: Message = {
      id: uuidv4(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };
    const assistantMessageId = uuidv4();
    setMessages((prev) => [
      ...prev,
      userMessage,
      {
        id: assistantMessageId,
        role: "assistant",
        content: "",
        timestamp: new Date(),
        isThinkingPlaceholder: true,
        uiComponents: [],
      },
    ]);
    setIsLoading(true);

    let accumulatedText = "";
    try {
      await streamChatResponse(
        { user_identifier: user.email, user_input: input, thread_id: threadId },
        {
          onUiComponent: (components: UiComponent[]) => {
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === assistantMessageId
                  ? { ...msg, uiComponents: components }
                  : msg
              )
            );
          },
          onTextChunk: (chunk: string) => {
            accumulatedText += chunk;
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === assistantMessageId
                  ? {
                      ...msg,
                      content: accumulatedText,
                      isThinkingPlaceholder: false,
                    }
                  : msg
              )
            );
          },
          onError: (error: string) => {
            setMessages((prev) =>
              prev.map((m) =>
                m.id === assistantMessageId
                  ? { ...m, content: error, isThinkingPlaceholder: false }
                  : m
              )
            );
          },

          // --- MODIFICATION: Handle the new message_complete event ---
          onMessageComplete: (data: { messageId: number }) => {
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === assistantMessageId
                  ? { ...msg, messageId: data.messageId }
                  : msg
              )
            );
          },
          onClose: () => {
            setIsLoading(false);
          },
        }
      );
    } catch (error) {
      console.error("Streaming failed:", error);
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantMessageId
            ? {
                ...m,
                content: "An error occurred.",
                isThinkingPlaceholder: false,
              }
            : m
        )
      );
      setIsLoading(false);
    }
  };

  // --- NEW: Handler to open the modal ---
  const handleShareClick = (messageToShare: Message) => {
    setShareModalData(messageToShare);
  };

  const handleClarificationClick = (query: string) => {
    handleSendMessage(query);
  };

  // The new, robust download handler
  const handleDownloadClick = (msg: Message) => {
    setMessageToDownload(msg); // 1. Set the data for the hidden component
    setIsGeneratingPdf(true); // 2. Flip the flag to trigger the useEffect
  };

  const renderIrisContent = () => (
    <div className="flex flex-1 flex-col h-full overflow-y-auto custom-scrollbar">
      {/* {isInitialState && !isLoading ? null : <ChatHeader />} */}
      <div
        className={`flex-grow flex flex-col relative ${
          isInitialState ? "items-center justify-center" : ""
        }`}
      >
        {isLoading && messages.length === 0 && (
          <div className="m-auto text-text-secondary">
            Loading chat history...
          </div>
        )}
        {!isLoading && isInitialState && (
          <AnimatedAIChat
            onSendMessage={handleSendMessage}
            isProcessing={isLoading}
          />
        )}
        {!isInitialState && (
          <>
            <ChatMessages
              messages={messages}
              onClarificationOptionClick={handleClarificationClick}
              onShareClick={handleShareClick}
              onDownloadClick={handleDownloadClick}
            />
            <div ref={messagesEndRef} />
          </>
        )}
      </div>
      {!isInitialState && (
        <footer className="w-full px-4 md:px-6 pb-4 pt-2 shrink-0 bg-content-bg sticky bottom-0">
          <ChatInputForm
            onSendMessage={handleSendMessage}
            isProcessing={isLoading}
          />
        </footer>
      )}
    </div>
  );

  return (
    <div className="flex h-screen w-full bg-content-bg">
      {/* --- WRAP THE SIDEBAR IN ANIMATION COMPONENTS --- */}
      <AnimatePresence>
        {activePrimaryTab === "iris" && isSecondarySidebarOpen && (
          <motion.div
            key="secondary-sidebar"
            variants={sidebarVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <SecondarySidebar />
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-1 flex flex-col h-full overflow-hidden">
        {activePrimaryTab === "iris" && renderIrisContent()}
        {activePrimaryTab === "screener" && <ScreenerPage />}
        {activePrimaryTab === "profile" && (
          <PlaceholderScreen title="User Profile" />
        )}
      </main>

      <ShareModal
        isOpen={!!shareModalData}
        onClose={() => setShareModalData(null)}
        messageContent={shareModalData?.content || ""}
        messageId={shareModalData?.messageId || 0}
      />

      {/* The hidden component is always in the DOM but only gets data when needed */}
      <PdfDocumentLayout
        forwardedRef={pdfLayoutRef}
        message={messageToDownload}
      />
    </div>
  );
}
