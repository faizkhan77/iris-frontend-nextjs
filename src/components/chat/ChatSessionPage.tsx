import { useParams } from "react-router";
import ChatMessages from "./ChatMessages";
import { useGetSingleConversationQuery } from "@/redux/slices/chat/chat.api";
import ChatInputForm from "./ChatInputForm";
import { useEffect } from "react";
import { useAppDispatch } from "@/redux/store";
import { setActiveSession, setMessages } from "@/redux/slices/chat/chat.slice";

const ChatSessionPage = () => {
  const { id } = useParams();
  const { data } = useGetSingleConversationQuery(id!, { skip: !id }); // Add skip to prevent fetch on initial render

  const dispatch = useAppDispatch();

  // Effect for handling session ID changes
  useEffect(() => {
    if (!id) return;

    dispatch(setActiveSession(id));

    // Clear messages when navigating away from this session (on unmount or ID change)
    return () => {
      dispatch(setMessages([]));
    };
  }, [id, dispatch]);

  // Separate effect for loading messages when data arrives
  useEffect(() => {
    if (data?.messages) {
      dispatch(setMessages(data.messages));
    }
  }, [data, dispatch]);

  return (
    <div className="bg-background relative min-h-screen flex flex-col items-center rounded-xl border p-2 sm:p-4">
      <div className="flex-1 z-10 w-full flex items-center flex-col-reverse overflow-y-auto rounded-md p-2 pb-28">
        <ChatMessages />
      </div>
      <div className="w-full z-20 max-w-2xl fixed bottom-0 left-1/2 -translate-x-1/2 p-2 sm:p-3">
        <ChatInputForm messages={true} />
      </div>
    </div>
  );
};

export default ChatSessionPage;
