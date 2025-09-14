import React from "react";
import { Tooltip, TooltipTrigger, TooltipContent } from "../ui/tooltip";
import { DynamicIcon } from "lucide-react/dynamic";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector, type RootState } from "@/redux/store";
import { setShowHistory } from "@/redux/slices/chat/chat.slice";

const ChatHistoryIcon: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const showHistory = useAppSelector((state : RootState) => state.chat.showHistory)


  const handleClick = () => {
    if (location.pathname === "/" || location.pathname === "/new" || location.pathname.startsWith("/c/")) {
      dispatch(setShowHistory(!showHistory));
    } else {
      navigate("/new"); // ✅ safe
    }
  };

  return (
    <Tooltip>
      <TooltipTrigger>
        <div
          className="p-3 flex items-center justify-center h-10 w-10 border rounded-xl cursor-pointer relative z-10"
          onClick={handleClick}
        >
          <DynamicIcon size={20} name="clock" />
        </div>
      </TooltipTrigger>
      <TooltipContent side="right">Recent Chats</TooltipContent>
    </Tooltip>
  );
};

export default ChatHistoryIcon;
