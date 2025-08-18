"use client";

import useSWR from "swr";
import { Plus, Search } from "lucide-react";
import { useAppStore } from "@/app/lib/store";
import { fetchChatHistory } from "@/app/lib/api";
import { v4 as uuidv4 } from "uuid";
import { cn } from "@/app/lib/utils";

interface Session {
  id: number;
  thread_id: string;
  summary?: string;
  started_at: string;
}

const groupSessionsByDate = (sessions: Session[] = []) => {
  if (!sessions) return {};

  const groups: { [key: string]: Session[] } = {
    Today: [],
    Yesterday: [],
    "Last 7 days": [],
    "Last 30 days": [],
    Older: [],
  };

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const last7Days = new Date(today);
  last7Days.setDate(last7Days.getDate() - 7);
  const last30Days = new Date(today);
  last30Days.setDate(last30Days.getDate() - 30);

  const sortedSessions = [...sessions].sort(
    (a, b) =>
      new Date(b.started_at).getTime() - new Date(a.started_at).getTime()
  );

  sortedSessions.forEach((session) => {
    const sessionDate = new Date(session.started_at);
    if (sessionDate >= today) groups["Today"].push(session);
    else if (sessionDate >= yesterday) groups["Yesterday"].push(session);
    else if (sessionDate >= last7Days) groups["Last 7 days"].push(session);
    else if (sessionDate >= last30Days) groups["Last 30 days"].push(session);
    else groups["Older"].push(session);
  });

  Object.keys(groups).forEach((key) => {
    if (groups[key].length === 0) delete groups[key];
  });

  return groups;
};

const fetcher = ([userId]: [number]) => fetchChatHistory(userId);

export default function SecondarySidebar() {
  const { user, threadId, setThreadId, isSecondarySidebarOpen } = useAppStore();
  const { data: sessions, isLoading } = useSWR(
    user ? [user.user_id] : null,
    fetcher
  );

  const handleNewChat = () => {
    const newThreadId = `thread_web_${uuidv4()}`;
    setThreadId(newThreadId);
  };

  const handleSelectSession = (newThreadId: string) => {
    if (threadId !== newThreadId) {
      setThreadId(newThreadId);
    }
  };

  const groupedSessions = groupSessionsByDate(sessions);

  if (!isSecondarySidebarOpen) return null;

  return (
    <aside
      className="flex h-full w-72 flex-col border-r border-element-border 
      bg-gradient-to-b from-sidebar-secondary-bg to-sidebar-secondary-bg/95
      p-3 shadow-lg animate-slide-in"
    >
      {/* Header */}
      <div className="flex items-center gap-2 pb-3">
        {/* Search Box */}
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-tertiary" />
          <input
            type="text"
            placeholder="Search chats"
            className="w-full rounded-md border border-element-border bg-background py-2 pl-9 pr-4 text-sm
            text-text-primary placeholder:text-text-tertiary
            focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent
            transition-all duration-300"
          />
        </div>

        {/* New Chat Button */}
        <button
          onClick={handleNewChat}
          title="New Chat"
          className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-md border border-element-border 
          bg-background text-text-secondary transition-all duration-300
          hover:bg-cyan-500 hover:text-white hover:shadow-md hover:shadow-cyan-500/40 active:scale-95"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      {/* Chat History */}
      <div className="flex-grow overflow-y-auto custom-scrollbar pr-1">
        {isLoading && (
          <div className="p-2 text-sm text-text-secondary">
            Loading chats...
          </div>
        )}
        {Object.entries(groupedSessions).map(([groupName, sessionsInGroup]) => (
          <div key={groupName} className="mb-5">
            {" "}
            {/* Increased bottom spacing between groups */}
            <h4
              className="px-2 pt-2 pb-2 mb-2 text-xs font-semibold text-text-secondary 
      bg-element-bg/40 rounded-md"
            >
              {groupName}
            </h4>
            <ul className="space-y-1">
              {sessionsInGroup.map((session) => (
                <li key={session.id}>
                  <button
                    onClick={() => handleSelectSession(session.thread_id)}
                    className={cn(
                      "w-full truncate rounded-md p-2 text-left text-sm transition-all duration-300",
                      threadId === session.thread_id
                        ? "bg-cyan-500 text-white shadow-md shadow-cyan-500/30 scale-[1.02]"
                        : "text-text-secondary hover:bg-element-bg-hover hover:text-text-primary hover:shadow-sm hover:shadow-cyan-500/10"
                    )}
                  >
                    {session.summary || "New Chat"}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </aside>
  );
}
