 
import { useParams } from "react-router";
import ChatMessages from "./ChatMessages";
import { useGetSingleConversationQuery } from "@/redux/slices/chat/chat.api";
import ChatInputForm from "./ChatInputForm";
import { useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector, type RootState } from "@/redux/store";
import { setActiveSession, setMessages } from "@/redux/slices/chat/chat.slice";
import SuggestedQueries from "./SuggestedQueries";
import { useSendMessageHandler } from "@/hooks/useSendMessageHandler";

 
const ChatSessionPage = () => {
  const { id } = useParams();
  const { data } = useGetSingleConversationQuery(id!);
    const { submitMessage } = useSendMessageHandler(); 
    const [suggestedQueries, setSuggestedQueries] = useState<string[]>([]);
 
  const dispatch = useAppDispatch();
  const messages = useAppSelector((state: RootState) => state.chat.messages);
 
  useEffect(() => {
    if (!id) return;
 
    dispatch(setActiveSession(id));
    console.log(id);
 
    if (data?.messages) {
      dispatch(setMessages(data.messages));
    }
  }, [id, data, dispatch]);
 
  // 👇 3. Memoized logic to find the latest suggested queries
  const latestSuggestedQueries = useMemo(() => {
    // Find the very last message that came from the assistant
    const lastAiMessage = [...messages]
      .reverse()
      .find((msg) => msg.role === "assistant");
 
    if (!lastAiMessage) return null;
 
    try {
      const parsedContent = JSON.parse(lastAiMessage.content) as AiResponse;
      if (!parsedContent.ui_components) return null;
 
      // Find the specific ui_component for suggestions
      const suggestionComponent = parsedContent.ui_components.find(
        (comp) => comp.type === "suggested_queries"
      );
      // console.log("Suggestion Component:", suggestionComponent);
      setSuggestedQueries((suggestionComponent as any).data || []);

      if (suggestionComponent && (suggestionComponent as any).data) {
        return (suggestionComponent as any).data as string[];
      }
 
      return null;
    } catch (error) {
      // If parsing fails, it's not a valid AI message structure
      console.error("Failed to parse AI message content:", error);
      return null;
    }
  }, [messages]); // This will re-run only when the messages array changes
 
  return (
    <div className="bg-background relative h-full flex flex-col items-center rounded-xl border p-2">
      {/* Messages container */}
      <div className="flex-1 z-10 w-full flex items-center flex-col-reverse overflow-y-auto rounded-md p-2">
        <ChatMessages />
      </div>
 
      {/* Input fixed at bottom */}
      <div className="w-full z-10 max-w-2xl my-3">
        {/* {latestSuggestedQueries && latestSuggestedQueries.length > 0 && (
          <SuggestedQueries queries={latestSuggestedQueries} onQueryClick={submitMessage} />
        )} */}

     
        <ChatInputForm messages={true} />
      </div>
    </div>
  );
};
 
export default ChatSessionPage;