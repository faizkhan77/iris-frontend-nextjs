// app/components/profile_components/ProfileDetails.tsx
import React from "react";
import SettingsCard from "./SettingsCard";

const ProfileDetails = () => {
  // A simple placeholder for an input field
  const Input = ({ label, type = "text", value, placeholder }: any) => (
    <div>
      <label className="block text-sm font-medium text-text-secondary mb-1.5">
        {label}
      </label>
      <input
        type={type}
        defaultValue={value}
        placeholder={placeholder}
        className="block w-full bg-sidebar-primary-bg border border-element-border rounded-lg py-2 px-3 text-sm placeholder-text-tertiary focus:outline-none focus:ring-2 focus:ring-cyan-500"
      />
    </div>
  );

  return (
    <SettingsCard
      title="Public Profile"
      description="This information will be displayed publicly."
      footer={
        <button className="px-4 py-2 text-sm font-semibold text-white bg-cyan-600 rounded-lg hover:bg-cyan-700 transition-colors">
          Save Changes
        </button>
      }
    >
      <div className="flex items-center gap-6">
        <div className="w-24 h-24 rounded-full bg-element-bg flex items-center justify-center text-text-secondary">
          <span className="text-3xl font-bold">JD</span>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 text-sm font-semibold text-text-primary bg-element-bg border border-element-border rounded-lg hover:bg-element-bg-hover transition-colors">
            Upload
          </button>
          <button className="px-4 py-2 text-sm font-semibold text-text-secondary hover:text-red-500 hover:bg-red-500/10 transition-colors rounded-lg">
            Remove
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input label="First Name" value="John" />
        <Input label="Last Name" value="Doe" />
      </div>
      <Input label="Email Address" type="email" value="john.doe@example.com" />
    </SettingsCard>
  );
};

export default ProfileDetails;
