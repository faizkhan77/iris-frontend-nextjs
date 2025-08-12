// app/components/profile_components/NotificationSettings.tsx
import React from "react";
import SettingsCard from "./SettingsCard";

// A placeholder for a real Switch component like from shadcn/ui
const Switch = ({ checked }: { checked: boolean }) => (
  <div
    className={`w-11 h-6 rounded-full flex items-center p-1 transition-colors ${
      checked ? "bg-cyan-500" : "bg-element-bg-hover"
    }`}
  >
    <div
      className={`w-4 h-4 bg-white rounded-full transform transition-transform ${
        checked ? "translate-x-5" : "translate-x-0"
      }`}
    />
  </div>
);

const NotificationRow = ({ title, description, enabled }: any) => (
  <div className="flex items-center justify-between">
    <div>
      <h4 className="font-medium text-text-primary">{title}</h4>
      <p className="text-sm text-text-secondary">{description}</p>
    </div>
    <Switch checked={enabled} />
  </div>
);

const NotificationSettings = () => {
  return (
    <SettingsCard
      title="Notifications"
      description="Choose how you want to be notified."
      footer={
        <button className="px-4 py-2 text-sm font-semibold text-white bg-cyan-600 rounded-lg hover:bg-cyan-700 transition-colors">
          Save Preferences
        </button>
      }
    >
      <NotificationRow
        title="Market Alerts"
        description="Get notified about significant market movements."
        enabled={true}
      />
      <NotificationRow
        title="IRIS Summary Reports"
        description="Receive periodic summaries of your conversations."
        enabled={true}
      />
      <NotificationRow
        title="Feature Updates"
        description="Announcements about new features and improvements."
        enabled={false}
      />
    </SettingsCard>
  );
};

export default NotificationSettings;
