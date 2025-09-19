import { nanoid } from "nanoid";
import { useNavigate, useParams } from "react-router-dom"; // Use react-router-dom
import { useAppDispatch } from "@/redux/store";
import { setInputValue, addMessage } from "@/redux/slices/chat/chat.slice";
import {
  useCreateConversationMutation,
  useSendMessageMutation,
} from "@/redux/slices/chat/chat.api";

export const useSendMessageHandler = () => {
  const { id } = useParams<{ id: string | undefined }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [createConversation, { isLoading: isCreating }] = useCreateConversationMutation();
  const [sendMessage, { isLoading: isSending }] = useSendMessageMutation();

  // This function contains all the logic from your component
  const submitMessage = async (prompt: string) => {
    const trimmedPrompt = prompt.trim();
    if (!trimmedPrompt) return;

    // Add the user's message to the UI immediately
    dispatch(
      addMessage({
        id: nanoid(),
        role: "user",
        content: trimmedPrompt,
        created_at: new Date().toISOString(),
      })
    );

    let currentSessionId = id;


    if (!currentSessionId) {
      try {
        const newSession = await createConversation().unwrap();
        currentSessionId = newSession.chat_session_id;

        navigate(`/c/${currentSessionId}`, { replace: true });
        await sendMessage({
          message: trimmedPrompt,
          chat_session_id: currentSessionId,
        });

      } catch (error) {
        console.error("Failed to create conversation or send message:", error);
      }
    } 
    // Scenario 2: This is a message in an existing chat
    else {
      try {
        await sendMessage({
          message: trimmedPrompt,
          chat_session_id: currentSessionId,
        });
      } catch (error) {
        console.error("Failed to send message:", error);
      }
    }
  };

  return {
    submitMessage,
    isLoading: isCreating || isSending,
  };
};