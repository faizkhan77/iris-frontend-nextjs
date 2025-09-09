import { DynamicIcon } from "lucide-react/dynamic";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { ModeToggle } from "../moon-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import IrisLogo from "@/assets/Logo";
import { useState } from "react";
import { Link } from "react-router";
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

const ChatIconBar = () => {
  const [showHistory, setShowHistory] = useState(false);

  return (
    <div className="flex border-sidebar">
      {/* Icon Panel */}
      <div className="flex flex-col items-center gap-3 p-3 h-screen sticky top-0 z-10">
        {/* Logo */}
        <div className="flex items-center justify-center h-10 w-10 rounded-xl border  mb-3">
          <IrisLogo />
        </div>

        {/* New Chat */}
        <Tooltip>
          <Link to={"/new"}>
            <TooltipTrigger>
              <div className="p-3 flex items-center justify-center h-10 w-10 border rounded-xl cursor-pointer">
                <DynamicIcon size={20} name="plus" />
              </div>
            </TooltipTrigger>
            <TooltipContent side="right">New Chat</TooltipContent>
          </Link>
        </Tooltip>

        {/* History Toggle */}
        <Tooltip>
          <TooltipTrigger>
            <div
              className="p-3 flex items-center justify-center h-10 w-10 border rounded-xl cursor-pointer relative z-10"
              onClick={() => setShowHistory(!showHistory)}
            >
              <DynamicIcon size={20} name="clock" />
            </div>
          </TooltipTrigger>
          <TooltipContent side="right">Recent Chats</TooltipContent>
        </Tooltip>

        <Tooltip>
          <Link to={"/screener"}>
            <TooltipTrigger>
              <div
                className="p-3 flex items-center justify-center h-10 w-10 border rounded-xl cursor-pointer relative z-10"
                onClick={() => {}}
              >
                <DynamicIcon size={20} name="chart-gantt" />
              </div>
            </TooltipTrigger>
            <TooltipContent side="right">Stock Screener</TooltipContent>
          </Link>
        </Tooltip>

        <Tooltip>
          <Link to={"/technicals"}>
            <TooltipTrigger>
              <div
                className="p-3 flex items-center justify-center h-10 w-10 border rounded-xl cursor-pointer relative z-10"
                onClick={() => {}}
              >
                <DynamicIcon size={20} name="chart-line" />
              </div>
            </TooltipTrigger>
            <TooltipContent side="right">Technical Indicators</TooltipContent>
          </Link>
        </Tooltip>

        <div className="flex-1" />

        {/* Mode Toggle */}
        <ModeToggle />

        {/* Avatar */}
        <Avatar className="h-[2.3rem] w-[2.3rem] mt-3">
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </div>

      {/* Sliding Recent History Panel */}
      <div
        className={`flex flex-col border-r h-screen transition-all duration-300 ${
          showHistory ? "w-60 p-3" : "w-0 p-0 overflow-hidden"
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
                    <div className="p-2 truncate text-left rounded-lg hover:bg-accent/60 cursor-pointer text-[13px] truncate">
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

export default ChatIconBar;
