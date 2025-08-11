// lib/store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  user_id: number;
  email: string;
  name: string; 
}



export type PrimaryTab = "iris" | "screener" | "analysis" | "profile";

interface AppState {
  // Existing State
  user: User | null;
  threadId: string | null;

  // New UI State
  activePrimaryTab: PrimaryTab;
  isSecondarySidebarOpen: boolean;

  // Existing Actions
  setUser: (user: User | null) => void;
  setThreadId: (threadId: string | null) => void;
  
  // New Actions
  setActivePrimaryTab: (tab: PrimaryTab) => void;
  toggleSecondarySidebar: () => void;
}
export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // --- Initial State Values ---
      user: null,
      threadId: null,
      activePrimaryTab: "iris", 
      isSecondarySidebarOpen: true, 

      // --- Actions ---
      setUser: (user) => set({ user }),
      setThreadId: (threadId) => set({ threadId }),
      
      /**
       * Sets the active primary tab.
       * If the new tab is 'iris', it automatically opens the secondary sidebar.
       */
      setActivePrimaryTab: (tab) => set({ 
        activePrimaryTab: tab,
        isSecondarySidebarOpen: tab === 'iris' // This is the key logic change
      }),

      /**
       * Toggles the secondary sidebar's visibility.
       * Used only when the 'iris' tab is already active.
       */
      toggleSecondarySidebar: () =>
        set((state) => ({ isSecondarySidebarOpen: !state.isSecondarySidebarOpen })),
    }),
    {
      name: "iris-app-storage",
      partialize: (state) => ({ user: state.user, threadId: state.threadId }),
    }
  )
);