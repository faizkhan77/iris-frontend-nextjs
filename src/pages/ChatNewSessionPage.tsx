import ChatWelcomeScreen from "@/components/chat/ChatWelcomeScreen";
import ChatInputForm from "@/components/chat/ChatInputForm";

const ChatNewSessionPage = () => {
  return (
    <div className="bg-background min-h-screen w-full relative overflow-y-auto flex flex-col items-center justify-start md:justify-center rounded-xl border p-2 sm:p-4">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(125%_125%_at_50%_20%,transparent_40%,oklch(0.6772_0.22_216.4337_/_0.3)_70%,oklch(0.6772_0.1206_216.4337)_100%)]" />

      {/* Content */}
      <div className="w-full relative z-10">
        <ChatWelcomeScreen show={true}>
          <ChatInputForm messages={false} />
        </ChatWelcomeScreen>
      </div>
    </div>
  );
};

export default ChatNewSessionPage;
