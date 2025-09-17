
import { Button } from "../ui/button";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { setInputValue } from "@/redux/slices/chat/chat.slice";


import { useSendMessageHandler } from "@/hooks/useSendMessageHandler";
interface ChatInputProps {
  messages: boolean;
}

const ChatInputForm: React.FC<ChatInputProps> = ({ messages }) => {

    const { submitMessage, isLoading } = useSendMessageHandler();
  const dispatch = useAppDispatch();


  const inputValue = useAppSelector((state) => state.chat.inputValue);

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await submitMessage(inputValue);
  };

  return (
    <div className="">
      <form
        onSubmit={handleFormSubmit}
        className="min-w-2xl p-4 flex flex-col gap-2 border rounded-lg bg-card"
      >
        <div className="flex">
          <input
            autoComplete="off"

            className="flex-1 w-full outline-none py-2 p-2 rounded-md"
            type="text"
            placeholder="Type your message..."

            value={inputValue}
            onChange={(e) => dispatch(setInputValue(e.target.value))}
          />
          <Button
            className={messages ? "" : "hidden"}
            type="submit"
            // 5. Disable the button if the input is empty
            disabled={!inputValue.trim()}
          >
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
            <Button type="submit" disabled={!inputValue.trim()}>Submit</Button>
          </div>
        )}
      </form>
    </div>
  );
};

export default ChatInputForm;