// app/components/profile_components/ProfileSidebar.tsx
"use client";

import { cn } from "@/lib/utils";
import React from "react";
import {
  ProfileIcon,
  AccountIcon,
  NotificationsIcon,
  PreferencesIcon,
} from "./icons";

export type ProfileTab =
  | "profile"
  | "account"
  | "notifications"
  | "preferences";

interface ProfileSidebarProps {
  activeTab: ProfileTab;
  setActiveTab: (tab: ProfileTab) => void;
}

const navItems = [
  { id: "profile", label: "Profile", icon: ProfileIcon },
  { id: "account", label: "Account", icon: AccountIcon },
  { id: "notifications", label: "Notifications", icon: NotificationsIcon },
  { id: "preferences", label: "IRIS Preferences", icon: PreferencesIcon },
];

const ProfileSidebar: React.FC<ProfileSidebarProps> = ({
  activeTab,
  setActiveTab,
}) => {
  return (
    <nav className="flex flex-col space-y-2">
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => setActiveTab(item.id as ProfileTab)}
          className={cn(
            "flex items-center gap-3 px-4 py-2 rounded-md text-sm font-medium transition-colors",
            activeTab === item.id
              ? "bg-element-bg text-text-primary"
              : "text-text-secondary hover:bg-element-bg-hover hover:text-text-primary"
          )}
        >
          <item.icon className="w-5 h-5" />
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  );
};

export default ProfileSidebar;
