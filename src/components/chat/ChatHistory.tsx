import { useAppSelector, type RootState } from "@/redux/store";
import { Search } from "lucide-react";
import { useGetConversationsQuery } from "@/redux/slices/chat/chat.api";
import { useNavigate } from "react-router";

const ChatHistory = () => {
  const showHistory = useAppSelector(
    (state: RootState) => state.chat.showHistory
  );

  const { data, isLoading } = useGetConversationsQuery();

  const navigate = useNavigate();

  const handleActiveSession = (id: string) => {
    navigate(`/c/${id}`); // navigate to conversation page
  };

  if (isLoading) {
    return <div></div>;
  }

  return (
    <div>
      {/* Sliding Recent History Panel - Only show on home/new pages */}
      <div
        className={`flex flex-col border-r h-screen transition-all duration-300 ${
          showHistory ? "w-60 p-3" : "w-0 p-0 overflow-hidden"
        }`}
      >
        {showHistory && (
          <div className="flex flex-col h-full">
            {/* Search Bar */}
            <div className="flex mb-4 border px-2 rounded-lg items-center justify-center">
              <Search size={18} />
              <input
                placeholder="Search Chats"
                className="w-full text-sm p-2 focus:outline-none h-full"
                type="text"
              />
            </div>

            <h2 className="font-medium text-base">Recent Chats</h2>
            <hr className="my-2" />

            {/* Scrollable History */}
            <div className="flex-1 overflow-y-auto">
              {data?.conversations?.map(({ summary, id }) => (
                <div onClick={() => handleActiveSession(id)} key={id}>
                  <div className="p-2 truncate text-left rounded-lg hover:bg-accent/60 cursor-pointer text-[13px]">
                    {summary} :{id}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatHistory;
