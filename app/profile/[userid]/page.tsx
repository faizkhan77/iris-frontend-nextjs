// app/profile/[userid]/page.tsx
"use client";

import React, { useState } from "react";
import ProfileSidebar, {
  ProfileTab,
} from "@/app/components/profile_components/ProfileSidebar";
import ProfileDetails from "@/app/components/profile_components/ProfileDetails";
import AccountSettings from "@/app/components/profile_components/AccountSettings";
import NotificationSettings from "@/app/components/profile_components/NotificationSettings";
import IrisPreferences from "@/app/components/profile_components/IrisPreferences";

// The Page component for a specific user's profile
export default function UserProfilePage({
  params,
}: {
  params: { userid: string };
}) {
  const [activeTab, setActiveTab] = useState<ProfileTab>("profile");

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return <ProfileDetails />;
      case "account":
        return <AccountSettings />;
      case "notifications":
        return <NotificationSettings />;
      case "preferences":
        return <IrisPreferences />;
      default:
        return <ProfileDetails />;
    }
  };

  return (
    <div className="h-full w-full p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-text-primary">Settings</h1>
          <p className="mt-1 text-text-secondary">
            Manage your account settings and set e-mail preferences.
          </p>
        </header>

        <main className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="col-span-1">
            <ProfileSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
          </div>

          {/* Main Content Area */}
          <div className="col-span-1 md:col-span-3">{renderContent()}</div>
        </main>
      </div>
    </div>
  );
}
