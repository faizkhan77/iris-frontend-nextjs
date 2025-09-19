import React from 'react';
import { Link } from "react-router-dom";
import { DynamicIcon } from "lucide-react/dynamic";
import { ModeToggle } from "../moon-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import IrisLogo from "@/assets/Logo";
import MobileChatHistory from "./MobileChatHistory"; 
import { useAppDispatch } from "@/redux/store";
import { logout } from "@/redux/slices/auth/auth.slice";


interface MobileSidebarLinkProps {
  to: string;
  icon: string;
  text: string;
  onClick: () => void;
}

const MobileSidebarLink: React.FC<MobileSidebarLinkProps> = ({ to, icon, text, onClick }) => (
  <Link to={to} onClick={onClick} className="flex items-center p-3 rounded-lg text-sm hover:bg-muted">
    <DynamicIcon name={icon} className="mr-4 h-5 w-5" />
    {text}
  </Link>
);


// Define the type for the props of MobileSidebar
interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileSidebar: React.FC<MobileSidebarProps> = ({ isOpen, onClose }) => {
  const dispatch = useAppDispatch();

  if (!isOpen) {
    return null;
  }

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/60 z-40 md:hidden"
        onClick={onClose}
        aria-hidden="true"
      ></div>


      <div
        className={`fixed top-0 left-0 h-full w-4/5 max-w-xs bg-background z-50 flex flex-col transform transition-transform duration-300 ease-in-out md:hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <IrisLogo />
          <button onClick={onClose} className="p-1 rounded-md hover:bg-muted">
            <DynamicIcon name="x" size={24} />
          </button>
        </div>

        {/* Main Scrolling Area */}
        <div className="flex-1 overflow-y-auto p-4">
          <nav className="flex flex-col gap-2">
            <MobileSidebarLink to="/new" icon="plus" text="New Chat" onClick={onClose} />
            <MobileSidebarLink to="/company" icon="search" text="Search Company" onClick={onClose} />
            <MobileSidebarLink to="/screener" icon="chart-gantt" text="Stock Screener" onClick={onClose} />
            <MobileSidebarLink to="/technicals" icon="chart-line" text="Technical Indicators" onClick={onClose} />
          </nav>
          
          <div className="mt-4 border-t pt-4">
            <h3 className="px-3 mb-2 text-xs font-semibold text-muted-foreground uppercase">
              Recent
            </h3>
            <MobileChatHistory onLinkClick={onClose} />
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t">
          <div className="flex flex-col gap-3">
             <div 
               onClick={() => { dispatch(logout()); onClose(); }} 
               className="flex items-center p-3 rounded-lg text-sm hover:bg-muted cursor-pointer"
             >
                <DynamicIcon name="log-out" className="mr-4 h-5 w-5" />
                Logout
            </div>
            <div className="flex items-center justify-between mt-2">
                <Avatar className="h-9 w-9">
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <ModeToggle />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileSidebar;