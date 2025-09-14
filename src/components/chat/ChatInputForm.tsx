import React from "react";
import { Button } from "../ui/button";

interface ChatInputProps {
  messages: boolean;
}

const ChatInputForm: React.FC<ChatInputProps> = ({ messages }) => {

  const handleMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <div className="">
      <form
        onSubmit={handleMessage}
        className="min-w-2xl p-4 flex flex-col gap-2 border rounded-lg bg-card"
      >
        <div className="flex">
          <input
            name=""
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
