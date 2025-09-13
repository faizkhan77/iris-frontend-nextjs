import { useAppSelector, type RootState } from "@/redux/store";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { Search } from "lucide-react";

type History = {
  chatId: string;
  title: string;
};

const chatHistory: History[] = [
  { chatId: "98u1bs9uha", title: "Project Updates" },
  { chatId: "b73kd92ksl", title: "Team Meeting Notes" },
  { chatId: "a82jd91kdm", title: "Personal Chats with whats is" },
  { chatId: "c91jd28lsl", title: "Client Discussion" },
  { chatId: "d01kd83kdp", title: "Ideas & Brainstorming" },
];

const ChatHistory = () => {
   const showHistory = useAppSelector((state : RootState) => state.chat.showHistory)

  return (
    <div>
      {/* Sliding Recent History Panel - Only show on home/new pages */}
      <div
        className={`flex flex-col border-r h-screen transition-all duration-300 ${
          showHistory  ? "w-60 p-3" : "w-0 p-0 overflow-hidden"
        }`}
      >
        {showHistory && (
          <div className="">
            <div className="flex mb-8 border px-2 rounded-lg items-center justify-center">
              <Search size={18} />
              <input
                placeholder="Search Chats"
                className="w-full text-sm p-2 focus:outline-none h-full"
                type="text"
              />
            </div>
            <h2 className="font-medium text-base">Recent Chats</h2>
            <hr className="my-2" />
            <div className="flex flex-col overflow-y-auto">
              {chatHistory.map(({ chatId, title }) => (
                <Tooltip key={chatId}>
                  <TooltipTrigger>
                    <div className="p-2 truncate text-left rounded-lg hover:bg-accent/60 cursor-pointer text-[13px]">
                      {title}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="right">{title}</TooltipContent>
                </Tooltip>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatHistory;
