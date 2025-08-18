// app/page.tsx
"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import ChatHeader from "./components/ChatHeader";
import { fetchScreenerStrategies } from "./lib/api";

// import ChatFooter from "./components/ChatInputForm";
import { AnimatedAIChat } from "./components/WelcomeScreen";

import { useAppStore } from "./lib/store";
import { v4 as uuidv4 } from "uuid";
import {
  streamChatResponse,
  fetchSessionMessages,
  ChatMessage,
} from "./lib/api";
import ChatInputForm from "./components/ChatInputForm";
// import Sidebar from "./components/Sidebar";
import { motion, AnimatePresence } from "framer-motion";
import ChatMessages, { Message, UiComponent } from "./components/ChatMessages";

import SecondarySidebar from "./components/layout/SecondarySidebar";

import ScreenerPage from "./analysis_components/ScreenerPage";

import ShareModal from "./components/ShareModal";
import { PdfDocumentLayout } from "./components/PdfDocumentLayout"; // <-- Import PDF layout
import { generatePdf } from "./lib/pdfGenerator"; // <-- Import PDF generator function

// --- NEW: Screener Components ---
import { Screen, ScreenCategory, Stock } from "./lib/types"; // Create a types.ts file in /lib
import ScreenerHeader from "./components/screener_components/Header";
import ScreenerSidebar from "./components/screener_components/Sidebar";
import ScreenerDashboard from "./components/screener_components/ScreenerDashboard";
import ScreenerCategoryPage from "./components/screener_components/ScreenerCategoryPage";
import ScreenerResultsPage from "./components/screener_components/ScreenerResultsPage";
import CombineModeBar from "./components/screener_components/CombineModeBar";

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

  // Auto-open screener sidebar when switching to Screener tab
  useEffect(() => {
    if (activePrimaryTab === "screener" && !isSecondarySidebarOpen) {
      useAppStore.setState({ isSecondarySidebarOpen: true });
    }
  }, [activePrimaryTab, isSecondarySidebarOpen]);

  // IRIS Chat State
  const [messages, setMessages] = useState<Message[]>([]);
  const [isInitialState, setIsInitialState] = useState(true);
  const [shareModalData, setShareModalData] = useState<Message | null>(null);
  const [messageToDownload, setMessageToDownload] = useState<Message | null>(
    null
  );
  const [isDownloading, setIsDownloading] = useState(false);
  const pdfLayoutRef = useRef<HTMLDivElement>(null);

  // Screener State
  const [screenerPage, setScreenerPage] = useState<
    "dashboard" | "category" | "results"
  >("dashboard");
  const [activeCategory, setActiveCategory] = useState<ScreenCategory | null>(
    null
  );
  const [activeScreens, setActiveScreens] = useState<Screen[]>([]);
  const [isCombining, setIsCombining] = useState(false);
  const [selectedForCombination, setSelectedForCombination] = useState<
    Screen[]
  >([]);
  const [globalSearch, setGlobalSearch] = useState("");
  const [selectedSectors, setSelectedSectors] = useState<string[]>(["All"]);
  const [sectorSearch, setSectorSearch] = useState("");
  const [screenerCategories, setScreenerCategories] = useState<
    ScreenCategory[]
  >([]);
  const [isStrategiesLoading, setIsStrategiesLoading] = useState(true);

  // --- Combined Loading State ---
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // --- DERIVED STATE ---
  const allScreens = useMemo(
    () => screenerCategories.flatMap((cat) => cat.screens),
    [screenerCategories]
  );
  const popularScreens = useMemo(
    () =>
      screenerCategories.find((cat) => cat.title === "Popular Themes")
        ?.screens || [],
    [screenerCategories]
  );
  const growthScreens = useMemo(
    () =>
      screenerCategories.find((cat) => cat.title === "Growth Screens")
        ?.screens || [],
    [screenerCategories]
  );

  useEffect(() => {
    if (activePrimaryTab === "screener" && !isSecondarySidebarOpen) {
      useAppStore.setState({ isSecondarySidebarOpen: true });
    }
  }, [activePrimaryTab, isSecondarySidebarOpen]);

  useEffect(() => {
    async function getStrategies() {
      setIsStrategiesLoading(true);
      try {
        const strategiesData = await fetchScreenerStrategies();
        const categories = Object.entries(strategiesData).map(
          ([title, screens]) => ({ title, screens })
        );
        setScreenerCategories(categories);
      } catch (error) {
        console.error("Failed to load screener strategies:", error);
        toast.error("Could not load screener strategies.");
      } finally {
        setIsStrategiesLoading(false);
      }
    }
    getStrategies();
  }, []);

  // --- THIS IS THE NEW, ROBUST DOWNLOAD HANDLER ---
  const handleDownloadClick = (msg: Message) => {
    if (isDownloading) return; // Prevent multiple clicks

    // --- ADD THIS LINE ---
    toast.info("Preparing your PDF report, download will start shortly...");

    // 1. Set the downloading state for immediate UI feedback
    setIsDownloading(true);
    // 2. Set the data for the hidden component, which triggers a re-render
    setMessageToDownload(msg);

    // 3. Use setTimeout to wait for the next "tick" of the browser's event loop.
    // This gives React enough time to finish its re-render and update the DOM.
    setTimeout(async () => {
      if (pdfLayoutRef.current) {
        // 4. Now that the component is rendered, generate the PDF
        await generatePdf(
          pdfLayoutRef.current,
          `IRIS-Report-${msg.messageId}.pdf`
        );
      }
      // 5. Reset the states after generation is complete
      setIsDownloading(false);
      setMessageToDownload(null);
    }, 100); // 100ms is a safe delay
  };

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
            // By default, the messageId is the ID from the database row.
            // This ensures old plain-text messages still get their ID.
            let messageId: number | undefined = msg.id;

            try {
              // Try to parse the content string from the database
              const parsedContent = JSON.parse(msg.content);

              if (
                parsedContent &&
                typeof parsedContent === "object" &&
                "text_response" in parsedContent
              ) {
                // It's our new structured format
                content = parsedContent.text_response;
                uiComponents = parsedContent.ui_components || [];
                // If the structured content has an ID, it's more authoritative. Use it.
                // This handles the case where you might re-save messages.
                if (parsedContent.message_id) {
                  messageId = parsedContent.message_id;
                }
              } else {
                // It was valid JSON, but not our format (e.g., a simple string in quotes)
                content = msg.content;
              }
            } catch (error) {
              // If JSON.parse fails, it's just a plain string message.
              // We don't need to do anything here, because messageId is already set
              // from the database row, and content is already correct.
              content = msg.content;
            }

            return {
              id: uuidv4(), // The client-side unique ID for React keys
              role: msg.role as "user" | "assistant",
              content: content,
              timestamp: new Date(msg.timestamp),
              uiComponents: uiComponents,
              messageId: messageId, // Assign the final determined ID
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

  // --- NEW: Handlers for Screener Logic ---
  const handleRunScreen = (screen: Screen) => {
    setActiveScreens([screen]);
    setScreenerPage("results");
  };

  const handleSeeAll = (category: ScreenCategory) => {
    setActiveCategory(category);
    setScreenerPage("category");
  };

  const handleBackToDashboard = () => {
    setActiveCategory(null);
    setActiveScreens([]);
    setScreenerPage("dashboard");
  };

  const handleToggleCombineMode = () => {
    setIsCombining(!isCombining);
    setSelectedForCombination([]); // Reset selection when toggling
  };

  const handleSelectForCombination = (screen: Screen) => {
    setSelectedForCombination((prev) =>
      prev.some((s) => s.title === screen.title)
        ? prev.filter((s) => s.title !== screen.title)
        : [...prev, screen]
    );
  };

  const handleRunCombination = () => {
    if (selectedForCombination.length > 0) {
      setActiveScreens(selectedForCombination);
      setScreenerPage("results");
      setIsCombining(false);
      setSelectedForCombination([]);
    }
  };

  const handleSelectSector = (sector: string) => {
    if (sector === "All") {
      setSelectedSectors(["All"]);
      return;
    }
    setSelectedSectors((prev) => {
      const newSectors = prev.includes(sector)
        ? prev.filter((s) => s !== sector)
        : [...prev.filter((s) => s !== "All"), sector];

      if (newSectors.length === 0) return ["All"];
      return newSectors;
    });
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
              onDownloadClick={handleDownloadClick} // Pass the new handler
              isDownloading={isDownloading} // Pass the state for UI feedback
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

  const renderScreenerContent = () => (
    <div className="flex h-full w-full">
      <AnimatePresence>
        {isSecondarySidebarOpen && (
          <motion.div
            key="screener-sidebar"
            variants={sidebarVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <ScreenerSidebar
              selectedSectors={selectedSectors}
              onSelectSector={handleSelectSector}
              sectorSearch={sectorSearch}
              onSectorSearchChange={setSectorSearch}
              onRunScreen={handleRunScreen}
              popularScreens={popularScreens}
              growthScreens={growthScreens}
              allScreens={allScreens}
            />
          </motion.div>
        )}
      </AnimatePresence>
      <div className="flex-1 p-6 overflow-y-auto">
        {screenerPage === "dashboard" && (
          <ScreenerDashboard
            screenCategories={screenerCategories}
            isLoading={isStrategiesLoading}
            onSeeAll={handleSeeAll}
            onRunScreen={handleRunScreen}
            globalSearch={globalSearch}
            isCombining={isCombining}
            selectedForCombination={selectedForCombination}
            onSelectForCombination={handleSelectForCombination}
          />
        )}
        {screenerPage === "category" && activeCategory && (
          <ScreenerCategoryPage
            category={activeCategory}
            onClose={handleBackToDashboard}
            onRunScreen={handleRunScreen}
            isCombining={isCombining}
            selectedForCombination={selectedForCombination}
            onSelectForCombination={handleSelectForCombination}
          />
        )}
        {screenerPage === "results" && activeScreens.length > 0 && (
          <ScreenerResultsPage
            initialScreens={activeScreens}
            onClose={handleBackToDashboard}
            selectedSectors={selectedSectors}
            allScreens={allScreens}
          />
        )}
      </div>
    </div>
  );

  return (
    // --- 1. Change the root to be a vertical flex container ---
    <div className="flex flex-col h-screen w-full bg-content-bg">
      {/* --- The Header is now the first item in the vertical stack --- */}
      {activePrimaryTab === "screener" && (
        <ScreenerHeader
          globalSearch={globalSearch}
          onGlobalSearchChange={setGlobalSearch}
          isCombining={isCombining}
          onToggleCombineMode={handleToggleCombineMode}
        />
      )}

      {/* --- 2. Create a new div to handle the horizontal layout for the main content --- */}
      <div className="flex flex-1 overflow-hidden">
        {/* --- SIMPLIFIED: This block now ONLY handles the IRIS chat sidebar --- */}
        <AnimatePresence>
          {activePrimaryTab === "iris" && isSecondarySidebarOpen && (
            <motion.div
              key="iris-sidebar"
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
          {activePrimaryTab === "analysis" && <ScreenerPage />}
          {activePrimaryTab === "screener" && renderScreenerContent()}
          {/* {activePrimaryTab === "profile" && (
            <PlaceholderScreen title="User Profile" />
          )} */}
        </main>
      </div>

      {/* --- The CombineModeBar remains at the bottom, outside the main scroll area --- */}
      {isCombining && (
        <CombineModeBar
          selectedCount={selectedForCombination.length}
          onCancel={handleToggleCombineMode}
          onSave={handleRunCombination}
        />
      )}

      {/* ... (Modals and hidden layouts are unaffected) ... */}
      <ShareModal
        isOpen={!!shareModalData}
        onClose={() => setShareModalData(null)}
        messageContent={shareModalData?.content || ""}
        messageId={shareModalData?.messageId || 0}
        userName={user?.name || "User"}
      />
      <PdfDocumentLayout
        forwardedRef={pdfLayoutRef}
        message={messageToDownload}
      />
    </div>
  );
}
