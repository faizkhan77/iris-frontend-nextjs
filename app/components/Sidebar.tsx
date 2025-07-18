// components/Sidebar.tsx
"use client";

import useSWR from "swr";
import { Plus, MessageSquare, LogOut } from "lucide-react";
import { useAppStore } from "../lib/store";
import { fetchChatHistory } from "../lib/api";
import { v4 as uuidv4 } from "uuid";
import { useRouter } from "next/navigation";
import IrisLogo from "./IrisLogo";

const fetcher = ([userId]: [number]) => fetchChatHistory(userId);

export default function Sidebar() {
  const { user, threadId, setThreadId, setUser } = useAppStore();
  const router = useRouter();
  const { data: sessions } = useSWR(user ? [user.user_id] : null, fetcher);

  const handleNewChat = () => setThreadId(`thread_web_${uuidv4()}`);
  const handleSelectSession = (newThreadId: string) => {
    if (threadId !== newThreadId) setThreadId(newThreadId);
  };
  const handleLogout = () => {
    setUser(null);
    setThreadId(null);
    router.push("/login");
  };

  return (
    <div className="flex-shrink-0 flex-col h-full bg-[var(--sidebar-bg)] text-[var(--text-primary)] w-64 p-3 border-r border-[var(--border-color)] hidden md:flex">
      <div className="flex items-center justify-between mb-4">
        <IrisLogo className="text-2xl bg-gradient-to-br from-gray-200 to-purple-400" />
        <button
          onClick={handleNewChat}
          className="p-2 rounded-lg text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
          title="New Chat"
        >
          <Plus size={20} />
        </button>
      </div>

      <div className="flex-grow overflow-y-auto -mr-2 pr-2 custom-scrollbar">
        <ul className="space-y-1">
          {sessions &&
            sessions
              .sort(
                (a, b) =>
                  new Date(b.started_at).getTime() -
                  new Date(a.started_at).getTime()
              )
              .map((session) => (
                <li key={session.id}>
                  <button
                    onClick={() => handleSelectSession(session.thread_id)}
                    className={`w-full text-left p-2.5 text-sm rounded-lg transition-colors flex flex-col ${
                      threadId === session.thread_id
                        ? "bg-white/10"
                        : "hover:bg-white/5"
                    }`}
                  >
                    <span className="truncate font-medium flex items-center gap-2">
                      <MessageSquare size={14} /> Chat Session
                    </span>
                    <span className="text-xs text-gray-400 pl-6 mt-1">
                      {new Date(session.started_at).toLocaleString([], {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </button>
                </li>
              ))}
        </ul>
      </div>

      <div className="border-t border-white/10 pt-3 mt-2">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
        >
          <LogOut size={16} />
          <span>Logout</span>
          <span className="ml-auto text-xs text-gray-500 truncate">
            {user?.name || user?.email}
          </span>
        </button>
      </div>
    </div>
  );
}
