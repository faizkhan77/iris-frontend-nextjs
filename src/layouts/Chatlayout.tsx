import ChatSessionPage from "@/components/chat/ChatSessionPage";
import ChatSidebar from "@/components/chat/ChatSidebar";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Outlet } from "react-router";

const Chatlayout = () => {
  return (
    <SidebarProvider>
      <main className="flex w-full">
        <ChatSidebar />
        <SidebarInset className="p-2 bg-secondary pl-0 w-full h-screen">
          {/* <ChatSessionPage /> */}
          <div className="p-2 bg-background rounded-xl h-full w-full border">
            <div>
              <SidebarTrigger />
              <hr className="my-2" />
            </div>
            <Outlet />
          </div>
        </SidebarInset>
      </main>
    </SidebarProvider>
  );
};

export default Chatlayout;
