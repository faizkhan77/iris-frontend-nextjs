import { useState } from "react";
import { Outlet } from "react-router";
import { DynamicIcon } from "lucide-react/dynamic"; 
import ChatSidebar from "@/components/chat/ChatSidebar";
import MobileSidebar from "@/components/chat/MobileSidebar";

const Chatlayout = () => {
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <main className="flex bg-sidebar h-screen w-full">
      <div className="hidden md:flex">
        <ChatSidebar />
      </div>

      <MobileSidebar
        isOpen={isMobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
      />
      <div className="flex-1 flex flex-col h-screen bg-background overflow-hidden">
        <div className="md:hidden flex items-center p-3 border-b sticky top-0 bg-background z-10">
          <button onClick={() => setMobileSidebarOpen(true)}>
            <DynamicIcon name="menu" size={24} />
          </button>
        </div>

        {/* Page content */}
        <div className="overflow-y-auto p-2 w-full h-full">
          <Outlet />
        </div>
      </div>
    </main>
  );
};

export default Chatlayout;