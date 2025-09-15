import { DynamicIcon } from "lucide-react/dynamic";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { ModeToggle } from "../moon-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import IrisLogo from "@/assets/Logo";
import { useState } from "react";
import { Link, useLocation } from "react-router";
import ChatHistory from "./ChatHistory";
import ChatHistoryIcon from "./ChatHistoryIcon";
import { LogOut } from "lucide-react";
import { useAppDispatch } from "@/redux/store";
import { logout } from "@/redux/slices/auth/auth.slice";


const ChatIconBar = () => {

  const dispatch = useAppDispatch()
 

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

        {/* History Toggle - Only show toggle functionality on home/new pages, otherwise navigate to home */}
        <ChatHistoryIcon />

        <Tooltip>
          <Link to={"/company"}>
            <TooltipTrigger>
              <div
                className="p-3 flex items-center justify-center h-10 w-10 border rounded-xl cursor-pointer relative z-10"
                onClick={() => {}}
              >
                <DynamicIcon size={20} name="search" />
              </div>
            </TooltipTrigger>
            <TooltipContent side="right">Search Company</TooltipContent>
          </Link>
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

        <div onClick={()=>dispatch(logout())} className="p-3 flex items-center justify-center h-10 w-10 border rounded-xl cursor-pointer relative z-10">
         <DynamicIcon size={20} name="log-out" />
        </div>

        {/* Mode Toggle */}
        <ModeToggle  />

        {/* Avatar */}
        <Avatar className="h-[2.3rem] w-[2.3rem] mt-3">
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </div>

      <ChatHistory />
    </div>
  );
};

export default ChatIconBar;