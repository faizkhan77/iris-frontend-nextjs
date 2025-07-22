// components/Sidebar.tsx
"use client";

import useSWR from "swr";
// NEW: Imported Plus and Search icons
import { Plus, Search, LogOut } from "lucide-react";
import { useAppStore } from "../lib/store";
import { fetchChatHistory } from "../lib/api";
import { v4 as uuidv4 } from "uuid";
import { useRouter } from "next/navigation";
import Link from "next/link";

// --- HELPER FUNCTION TO GROUP SESSIONS BY DATE (No changes here) ---
const groupSessionsByDate = (sessions: any[]) => {
  if (!sessions) return {};

  const groups: { [key: string]: any[] } = {
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

  const sortedSessions = sessions.sort(
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

  const groupedSessions = groupSessionsByDate(sessions);

  return (
    <aside className="flex-shrink-0 flex flex-col h-full  text-[var(--text-primary)] w-[280px] p-4 space-y-4">
      {/* --- MODIFIED: Header now includes the New Chat button --- */}
      <div className="flex items-center justify-between px-1">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-[var(--gold-accent)] rounded-md flex items-center justify-center font-bold text-lg">
            I
          </div>
          <span className="text-lg font-bold text-white">IRIS</span>
        </Link>

        {/* --- RESTORED: The New Chat button with updated styling --- */}
        <button
          onClick={handleNewChat}
          className="p-2 rounded-lg text-[var(--text-secondary)] hover:text-white hover:bg-[var(--element-bg-dark)] transition-colors"
          title="New Chat"
        >
          <Plus size={20} />
        </button>
      </div>

      {/* NEW: Search bar */}
      <div className="relative">
        <Search
          size={18}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]"
        />
        <input
          type="text"
          placeholder="Search"
          className="w-full bg-[var(--element-bg-dark)] border border-transparent focus:border-[var(--gold-accent)] focus:ring-0 rounded-lg pl-10 pr-4 py-2 text-sm outline-none transition"
        />
      </div>

      {/* CHANGED: Dynamic chat history, now rendered in groups */}
      <div className="flex-grow overflow-y-auto space-y-4 -mr-2 pr-2 custom-scrollbar">
        {Object.entries(groupedSessions).map(([groupName, sessionsInGroup]) => (
          <div key={groupName}>
            <h4 className="text-xs font-semibold text-[var(--text-secondary)] px-2 mb-2 uppercase tracking-wider">
              {groupName}
            </h4>
            <ul className="space-y-1.5">
              {sessionsInGroup.map((session) => (
                <li key={session.id}>
                  <button
                    onClick={() => handleSelectSession(session.thread_id)}
                    className={`w-full text-left p-2.5 text-sm rounded-lg flex justify-between items-center transition-colors ${
                      threadId === session.thread_id
                        ? "bg-[var(--element-bg-light)]"
                        : "bg-[var(--element-bg-dark)] hover:bg-[var(--element-bg-light)]/70"
                    }`}
                  >
                    <span className="truncate text-[var(--text-primary)]">
                      {session.summary || "New Chat"}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* NEW: Restyled footer action, repurposed for Logout */}
      <div className="flex-shrink-0 pt-2">
        <button
          onClick={handleLogout}
          className="w-full p-3 rounded-xl bg-[var(--gold-accent)] text-left transition-transform hover:scale-[1.02] shadow-lg shadow-[var(--gold-accent)]/20"
        >
          <div className="flex items-center gap-3">
            <LogOut size={16} />
            <div>
              <div className="font-bold text-sm">Logout</div>
              <div className="text-xs truncate">
                User: {user?.name || user?.email}
              </div>
            </div>
          </div>
        </button>
      </div>
    </aside>
  );
}
