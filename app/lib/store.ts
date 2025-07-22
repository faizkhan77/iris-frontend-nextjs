// lib/store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  user_id: number;
  email: string;
  name: string; 
}

interface AppState {
  user: User | null;
  threadId: string | null;
  setUser: (user: User | null) => void;
  setThreadId: (threadId: string | null) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      threadId: null,
      setUser: (user) => set({ user }),
      setThreadId: (threadId) => set({ threadId }),
    }),
    {
      name: 'iris-chat-storage', // name of the item in the storage (must be unique)
    }
  )
);