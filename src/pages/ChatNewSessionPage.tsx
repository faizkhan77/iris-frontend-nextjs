import ChatWelcomeScreen from "@/components/chat/ChatWelcomeScreen";

import ChatInputForm from "@/components/chat/ChatInputForm";
import ChatMessages from "@/components/chat/ChatMessages";

const ChatNewSessionPage = () => {
  return (
    <div className="bg-background h-full relative overflow-y-scroll flex flex-col items-center justify-center rounded-xl border p-4">
      <div className="absolute inset-0 bg-[radial-gradient(125%_125%_at_50%_20%,transparent_40%,oklch(0.6772_0.22_216.4337_/_0.3)_70%,oklch(0.6772_0.1206_216.4337)_100%)]" />

      <div className="min-w-2xl z-10 ">
        {/* <ChatMessages /> */}
      </div>
      <ChatWelcomeScreen show={true}>
        <ChatInputForm messages={false} />
      </ChatWelcomeScreen>
    </div>
  );
};

export default ChatNewSessionPage;
