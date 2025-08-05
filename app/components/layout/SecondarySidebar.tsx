"use client";

import useSWR from "swr";
import { Plus, Search } from "lucide-react";
import { useAppStore } from "@/app/lib/store";
import { fetchChatHistory } from "@/app/lib/api";
import { v4 as uuidv4 } from "uuid";
import { cn } from "@/app/lib/utils";

// This is the same Session interface from your old sidebar
interface Session {
  id: number;
  thread_id: string;
  summary?: string;
  started_at: string;
}

// --- THIS IS THE RESTORED HELPER FUNCTION FROM YOUR ORIGINAL SIDEBAR ---
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

  // Sort sessions from newest to oldest
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

  // Remove any groups that are empty
  Object.keys(groups).forEach((key) => {
    if (groups[key].length === 0) {
      delete groups[key];
    }
  });

  return groups;
};

// The fetcher function for SWR
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

  // The grouping function now handles sorting internally.
  const groupedSessions = groupSessionsByDate(sessions);

  if (!isSecondarySidebarOpen) {
    return null;
  }

  return (
    <aside className="flex h-full w-72 flex-col border-r border-element-border bg-sidebar-secondary-bg p-3">
      {/* Header with Search and New Chat */}
      <div className="flex items-center gap-2 pb-3">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-tertiary" />
          <input
            type="text"
            placeholder="Search chats"
            className="w-full rounded-md border border-element-border bg-background py-2 pl-9 pr-4 text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-1 focus:ring-accent"
          />
          {/* <div className="absolute right-3 top-1/2 -translate-y-1/2 rounded bg-element-bg px-1.5 py-0.5 text-xs text-text-secondary">
            ⇐
          </div> */}
        </div>
        <button
          onClick={handleNewChat}
          title="New Chat"
          className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-md border border-element-border bg-background text-text-secondary transition-colors hover:bg-element-bg hover:text-text-primary"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      {/* Chat History List */}
      <div className="flex-grow overflow-y-auto custom-scrollbar -mr-1 pr-1">
        {isLoading && (
          <div className="p-2 text-sm text-text-secondary">
            Loading chats...
          </div>
        )}
        {Object.entries(groupedSessions).map(([groupName, sessionsInGroup]) => (
          <div key={groupName} className="mb-3">
            <h4 className="px-2 pb-1 text-xs font-semibold text-text-secondary">
              {groupName}
            </h4>
            <ul className="space-y-1">
              {sessionsInGroup.map((session) => (
                <li key={session.id}>
                  <button
                    onClick={() => handleSelectSession(session.thread_id)}
                    className={cn(
                      "w-full truncate rounded-md p-2 text-left text-sm transition-colors",
                      threadId === session.thread_id
                        ? "bg-element-bg text-text-primary"
                        : "text-text-secondary hover:bg-element-bg-hover hover:text-text-primary"
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
