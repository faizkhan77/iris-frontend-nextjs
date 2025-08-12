// app/components/profile_components/SettingsCard.tsx
import React from "react";

interface SettingsCardProps {
  title: string;
  description: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

const SettingsCard: React.FC<SettingsCardProps> = ({
  title,
  description,
  children,
  footer,
}) => {
  return (
    <div className="bg-content-bg border border-element-border rounded-lg shadow-sm">
      {/* Header */}
      <div className="p-6 border-b border-element-border">
        <h3 className="text-xl font-semibold text-text-primary">{title}</h3>
        <p className="mt-1 text-sm text-text-secondary">{description}</p>
      </div>

      {/* Body */}
      <div className="p-6 space-y-6">{children}</div>

      {/* Footer */}
      {footer && (
        <div className="flex justify-end p-6 bg-sidebar-primary-bg border-t border-element-border rounded-b-lg">
          {footer}
        </div>
      )}
    </div>
  );
};

export default SettingsCard;
