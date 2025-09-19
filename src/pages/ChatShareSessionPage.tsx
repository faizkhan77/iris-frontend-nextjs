import IrisLogo from "@/assets/Logo";
import PreviewMessage from "@/components/chat/PreviewMessage";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { formatFullDate } from "@/lib/utils";
import {
  useGetMessageQuery,
  useOpenSharedMessageMutation,
} from "@/redux/slices/chat/chat.api";
import { useNavigate, useParams } from "react-router";

const ChatShareSessionPage = () => {
  const { message_id } = useParams();
  const id = message_id?.split("_")[1];

  const { token } = useAuth();

  // Only call query if id exists
  const { data, isLoading, isError, isSuccess } = useGetMessageQuery(id!, {
    skip: !id,
  });

  const navigate = useNavigate();
  const [openSharedMessage] = useOpenSharedMessageMutation();

  const handleContinueSession = async (messageId: string) => {
    try {
      const { session } = await openSharedMessage(messageId).unwrap();
      if(token){
        navigate(`/c/${session.id}`);
      }else{
        navigate("/login")
      }
    } catch (err) {
      console.error("Failed to open shared message:", err);
    }
  };

  return (
    <main className="min-h-screen flex-col flex items-center justify-center bg-background p-4">
      <div className="flex mb-10 items-center gap-2">
        <IrisLogo />
        <div>
          <p className="text-lg">Iris AI</p>
          <p className="text-xs">Stock Advisory</p>
        </div>
      </div>
      <div className="w-full max-w-2xl p-5 sm:p-10 flex flex-col items-center rounded-xl border">
        <h2 className="text-lg font-semibold mb-4">Shared Message</h2>

        {isLoading && <p>Loading message...</p>}
        {isError && <p className="text-red-500">Failed to load message.</p>}

        {isSuccess && data?.message && (
          <div className="h-[20rem] border bg-accent/20 rounded-md overflow-auto p-4 sm:p-10">
            <PreviewMessage message={data.message} />
          </div>
        )}
        <div className="flex flex-col sm:flex-row gap-2 w-full my-4 justify-between">
          <div className="text-sm p-2 border px-5 rounded-md">
            {formatFullDate(data?.message.created_at!)}
          </div>
          <Button onClick={() => handleContinueSession(data?.message.id!)}>
            Continue Session
          </Button>
        </div>
      </div>
    </main>
  );
};

export default ChatShareSessionPage;
