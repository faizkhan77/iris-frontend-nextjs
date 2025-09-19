import { useGetConversationsQuery } from "@/redux/slices/chat/chat.api";
import { useNavigate } from "react-router-dom";

// This component is designed specifically for the mobile sidebar.
// It accepts an `onLinkClick` function to close the sidebar when a chat is selected.
const MobileChatHistory = ({ onLinkClick }: { onLinkClick: () => void }) => {
  const { data, isLoading } = useGetConversationsQuery();
  const navigate = useNavigate();

  // When a user clicks a chat, navigate and then call the passed-in function.
  const handleActiveSession = (id: string) => {
    navigate(`/c/${id}`);
    if (onLinkClick) {
      onLinkClick(); // This will call `onClose` from the MobileSidebar
    }
  };

  if (isLoading) {
    // Optional: Show a simple loading state
    return <div className="p-2 text-sm text-muted-foreground">Loading...</div>;
  }

  if (!data || data.conversations.length === 0) {
    // Optional: Show a message if there are no chats
    return <div className="p-2 text-sm text-muted-foreground">No recent chats.</div>;
  }

  return (
    // Simple container for the list of chats.
    // It will naturally scroll within its parent container in MobileSidebar.
    <div className="flex flex-col">
      {data.conversations.map(({ summary, id }) => (
        <div 
          onClick={() => handleActiveSession(id)} 
          key={id}
          className="p-2 truncate text-left rounded-lg hover:bg-accent/60 cursor-pointer text-[13px]"
        >
          {summary || "New Chat"} {/* Fallback for empty summary */}
        </div>
      ))}
    </div>
  );
};

export default MobileChatHistory;