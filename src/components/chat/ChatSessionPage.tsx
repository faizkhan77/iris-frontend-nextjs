import { useParams } from "react-router";
import ChatMessages from "./ChatMessages";
import { useGetSingleConversationQuery } from "@/redux/slices/chat/chat.api";
import ChatInputForm from "./ChatInputForm";

const ChatSessionPage = () => {
  const { id } = useParams();
  const { data } = useGetSingleConversationQuery(id!);

  return (
    <div className="bg-background relative h-full flex flex-col items-center rounded-xl border p-2">
      
      {/* Messages container */}
      <div className="flex-1 z-10 w-full flex items-center flex-col-reverse overflow-y-auto rounded-md p-2">
        <ChatMessages messages={data?.messages} />
      </div>

      {/* Input fixed at bottom */}
      <div className="w-full z-10 max-w-2xl my-3">
        <ChatInputForm messages={true} />
      </div>
    </div>
  );
};

export default ChatSessionPage;
