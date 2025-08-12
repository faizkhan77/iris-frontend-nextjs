// app/components/profile_components/IrisPreferences.tsx
import React from "react";
import SettingsCard from "./SettingsCard";

// Dummy Data for demonstration
const dummyPreferences = [
  { key: "Investment Style", value: "Long-term Growth" },
  { key: "Risk Tolerance", value: "Medium-High" },
  { key: "Favorite Indicators", value: "RSI, MACD, Moving Averages" },
  {
    key: "Preferred Sectors",
    value: "Information Technology, Healthcare, Finance & Banking",
  },
  { key: "Company Size Focus", value: "Mid to Large Cap" },
  { key: "Data Granularity", value: "Quarterly Reports, YoY Growth" },
];

const IrisPreferences = () => {
  return (
    <SettingsCard
      title="IRIS Learned Preferences"
      description="These preferences are automatically learned by IRIS based on your screener usage and chat interactions to tailor its analysis for you."
    >
      <div className="overflow-hidden border border-element-border rounded-lg">
        <table className="min-w-full divide-y divide-element-border">
          <thead className="bg-sidebar-primary-bg">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider"
              >
                Preference
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider"
              >
                Learned Value
              </th>
            </tr>
          </thead>
          <tbody className="bg-content-bg divide-y divide-element-border">
            {dummyPreferences.map((pref) => (
              <tr key={pref.key}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-text-primary">
                  {pref.key}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                  {pref.value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </SettingsCard>
  );
};

export default IrisPreferences;
