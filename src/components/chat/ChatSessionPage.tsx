import { useParams } from "react-router";
import ChatMessages from "./ChatMessages";
import { useGetSingleConversationQuery } from "@/redux/slices/chat/chat.api";
import ChatInputForm from "./ChatInputForm";
import { useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector, type RootState } from "@/redux/store";
import { setActiveSession, setMessages } from "@/redux/slices/chat/chat.slice";
import SuggestedQueries from "./SuggestedQueries";
import { useSendMessageHandler } from "@/hooks/useSendMessageHandler";
import type { AiResponse } from "@/redux/slices/chat/types"; // Assuming AiResponse type is defined here

const ChatSessionPage = () => {
  const { id } = useParams();
  const { data } = useGetSingleConversationQuery(id!, { skip: !id }); // Add skip to prevent fetch on initial render
  const { submitMessage } = useSendMessageHandler();
  const [suggestedQueries, setSuggestedQueries] = useState<string[]>([]);

  const dispatch = useAppDispatch();
  const messages = useAppSelector((state: RootState) => state.chat.messages);

  useEffect(() => {
    if (!id) return;

    dispatch(setActiveSession(id));

    if (data?.messages) {
      dispatch(setMessages(data.messages));
    }
    // Set messages to empty array when navigating to a new chat to prevent flash of old content
    return () => {
        dispatch(setMessages([]));
    }
  }, [id, data, dispatch]);

  const latestSuggestedQueries = useMemo(() => {
    const lastAiMessage = [...messages]
      .reverse()
      .find((msg) => msg.role === "assistant");
    if (!lastAiMessage) return null;
    try {
      const parsedContent = JSON.parse(lastAiMessage.content) as AiResponse;
      if (!parsedContent.ui_components) return null;
      const suggestionComponent = parsedContent.ui_components.find(
        (comp) => comp.type === "suggested_queries"
      );
      if (suggestionComponent && (suggestionComponent as any).data) {
        return (suggestionComponent as any).data as string[];
      }
      return null;
    } catch (error) {
      return null;
    }
  }, [messages]);

  return (
    // CHANGE: Replaced `h-full` with `min-h-screen` for more robust height handling on all devices.
    // CHANGE: Made padding responsive.
    <div className="bg-background relative min-h-screen flex flex-col items-center rounded-xl border p-2 sm:p-4">
      {/* Messages container */}
      {/* CHANGE: Added `pb-4` to prevent messages from hiding under the input form on scroll */}
      <div className="flex-1 z-10 w-full flex items-center flex-col-reverse overflow-y-auto rounded-md p-2 pb-4">
        <ChatMessages />
      </div>

      {/* Input fixed at bottom */}
      {/* CHANGE: Reduced vertical margin on mobile */}
      <div className="w-full z-10 max-w-2xl my-2 sm:my-3">
        {latestSuggestedQueries && latestSuggestedQueries.length > 0 && (
          <SuggestedQueries queries={latestSuggestedQueries} onQueryClick={submitMessage} />
        )}
        <ChatInputForm messages={true} />
      </div>
    </div>
  );
};

export default ChatSessionPage;