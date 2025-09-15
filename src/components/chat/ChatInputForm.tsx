import React from "react";
import { nanoid } from "nanoid";
import { Button } from "../ui/button";
import type { AiResponse, ChatRequest } from "@/redux/slices/chat/types";
import { useNavigate, useParams } from "react-router";
import { useAppDispatch, useAppSelector, type RootState } from "@/redux/store";
import {
  addAiMessage,
  addMessage,
  setLoading,
} from "@/redux/slices/chat/chat.slice";
import {
  useCreateConversationMutation,
  useSendMessageMutation,
} from "@/redux/slices/chat/chat.api";

interface ChatInputProps {
  messages: boolean;
}

const ChatInputForm: React.FC<ChatInputProps> = ({ messages }) => {
  const { id } = useParams<{ id: string | undefined }>(); // TypeScript typing
  const [createConversation] = useCreateConversationMutation();
  const [sendMessage] = useSendMessageMutation();
  const dispatch = useAppDispatch();

  const navigate = useNavigate();
  const handleMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formdata = new FormData(e.currentTarget);
    const prompt = formdata.get("prompt") as string;

    let sessionId = id;

    if (!sessionId) {
      const newSession = await createConversation().unwrap();
      sessionId = newSession.chat_session_id;
      navigate(`/c/${sessionId}`);
    }

    dispatch(
      addMessage({
        id: nanoid(), // generates UUID
        role: "user",
        content: prompt,
        created_at: new Date().toISOString(),
      })
    );

    const data = await sendMessage({
      message: prompt,
      chat_session_id: sessionId,
    });

    

    console.log(data.message);
  };

  return (
    <div className="">
      <form
        onSubmit={handleMessage}
        className="min-w-2xl p-4 flex flex-col gap-2 border rounded-lg bg-card"
      >
        <div className="flex">
          <input
            autoComplete="off"
            name="prompt"
            className="flex-1 w-full outline-none py-2 p-2 rounded-md"
            type="text"
            placeholder="Type your message..."
          />
          <Button className={messages ? "" : "hidden"} type="submit">
            Submit
          </Button>
        </div>

        {!messages && (
          <div className="flex mt-3 justify-between">
            <div>
              <Button className="shadow-none" variant="outline">
                Iris v1
              </Button>
            </div>
            <Button type="submit">Submit</Button>
          </div>
        )}
      </form>
    </div>
  );
};

export default ChatInputForm;
