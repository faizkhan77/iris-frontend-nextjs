// app/components/profile_components/AccountSettings.tsx
import React from "react";
import SettingsCard from "./SettingsCard";

const AccountSettings = () => {
  const Input = ({ label, type = "password" }: any) => (
    <div>
      <label className="block text-sm font-medium text-text-secondary mb-1.5">
        {label}
      </label>
      <input
        type={type}
        className="block w-full bg-sidebar-primary-bg border border-element-border rounded-lg py-2 px-3 text-sm placeholder-text-tertiary focus:outline-none focus:ring-2 focus:ring-cyan-500"
      />
    </div>
  );

  return (
    <SettingsCard
      title="Account Security"
      description="Manage your password and secure your account."
      footer={
        <button className="px-4 py-2 text-sm font-semibold text-white bg-cyan-600 rounded-lg hover:bg-cyan-700 transition-colors">
          Update Password
        </button>
      }
    >
      <Input label="Current Password" />
      <Input label="New Password" />
      <Input label="Confirm New Password" />
    </SettingsCard>
  );
};

export default AccountSettings;
