import ChatSidebar from "@/components/chat/ChatSidebar";
import { SidebarProvider,SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";

const Chatlayout = () => {
  return (
    <SidebarProvider >
      <main className="flex w-full">
        <ChatSidebar />
        <SidebarInset className="p-2 bg-secondary pl-0 w-full h-screen">
          <div className="p-2 bg-background rounded-xl h-full w-full border">
            <SidebarTrigger />
          </div>
        </SidebarInset>
      </main>
    </SidebarProvider>
  );
};

export default Chatlayout;
