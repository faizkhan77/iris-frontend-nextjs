import { Button } from "../ui/button";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { setInputValue } from "@/redux/slices/chat/chat.slice";
import { useSendMessageHandler } from "@/hooks/useSendMessageHandler";
import { ArrowUp } from "lucide-react";

interface ChatInputProps {
  messages: boolean;
}

const ChatInputForm: React.FC<ChatInputProps> = ({ messages }) => {
  const { submitMessage, isLoading } = useSendMessageHandler();
  const dispatch = useAppDispatch();
  const inputValue = useAppSelector((state) => state.chat.inputValue);

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isLoading || !inputValue.trim()) return;
    await submitMessage(inputValue);
  };

  return (
    <div className="w-full">
      <form
        onSubmit={handleFormSubmit}
        className="w-full p-3 sm:p-4 flex flex-col gap-3 border rounded-lg bg-card"
      >
        {/* --- TOP ROW: INPUT + BUTTONS --- */}
        <div className="flex items-center gap-2">
          <input
            autoComplete="off"
            className="flex-1 w-full outline-none bg-transparent py-2 px-2 rounded-md text-sm disabled:opacity-50"
            type="text"
            placeholder="Type your message..."
            value={inputValue}
            onChange={(e) => dispatch(setInputValue(e.target.value))}
            disabled={isLoading}
          />

          <Button
            className={messages ? "flex" : "hidden"}
            type="submit"
            disabled={!inputValue.trim() || isLoading}
          >
            Submit
          </Button>

          {/* B. MOBILE-ONLY button for WELCOME SCREEN */}
          {!messages && (
            <Button
              type="submit"
              size="icon"
              className="flex md:hidden rounded-full"
              disabled={!inputValue.trim() || isLoading}
            >
              <ArrowUp className="h-5 w-5" />
            </Button>
          )}
        </div>

        {!messages && (
          // This entire div is now visible on all screen sizes for the welcome screen
          <div className="flex items-center justify-between mt-2">
            {/* "Iris v1" button is now always visible */}
            <Button
              className="shadow-none text-xs sm:text-sm"
              variant="outline"
              disabled={isLoading}
            >
              Iris v1
            </Button>

            {/* The text "Submit" button is now ONLY for desktop */}
            <Button
              type="submit"
              className="hidden md:flex"
              disabled={!inputValue.trim() || isLoading}
            >
              Submit
            </Button>
          </div>
        )}
      </form>
    </div>
  );
};

export default ChatInputForm;
