import ChatSidebar from "@/components/chat/ChatSidebar";

import { Outlet } from "react-router";

const Chatlayout = () => {
  return (
    <main className="flex bg-sidebar h-screen w-full">
      <ChatSidebar />
      <div className="bg-background overflow-y-scroll p-2 w-full h-fullc">
        <Outlet />
      </div>
    </main>
  );
};

export default Chatlayout;
