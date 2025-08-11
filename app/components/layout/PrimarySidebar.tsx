"use client";

import { useTheme } from "next-themes";
import {
  BotMessageSquare,
  LayoutGrid,
  Moon,
  Sun,
  User,
  BarChartHorizontalBig,
} from "lucide-react";
import { useAppStore, PrimaryTab } from "@/app/lib/store";
import { cn } from "@/lib/utils"; // Assuming you have a cn utility from shadcn/ui or similar
import IrisLogo from "../IrisLogo";
import Image from "next/image";

// Reusable button component for the sidebar
interface SidebarButtonProps {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const SidebarButton = ({
  icon,
  label,
  isActive,
  onClick,
}: SidebarButtonProps) => (
  <button
    onClick={onClick}
    title={label}
    className={cn(
      "flex h-12 w-12 items-center justify-center rounded-lg transition-colors",
      isActive
        ? "bg-element-bg text-text-primary"
        : "text-text-secondary hover:bg-element-bg hover:text-text-primary"
    )}
  >
    {icon}
  </button>
);

export default function PrimarySidebar() {
  const { activePrimaryTab, setActivePrimaryTab, toggleSecondarySidebar } =
    useAppStore();
  const { theme, setTheme } = useTheme();

  const handleTabClick = (tab: PrimaryTab) => {
    setActivePrimaryTab(tab);
  };

  // --- NEW LOGIC FOR THE IRIS BUTTON ---
  const handleIrisTabClick = () => {
    // If we are already on the iris tab, toggle the sidebar.
    // Otherwise, switch to the iris tab (which will automatically open the sidebar).
    if (activePrimaryTab === "iris") {
      toggleSecondarySidebar();
    } else {
      setActivePrimaryTab("iris");
    }
  };

  return (
    <nav className="fixed left-0 top-0 z-50 flex h-full w-20 flex-col items-center justify-between border-r border-element-border bg-sidebar-primary-bg p-4">
      {/* Top section: Logo and main navigation */}
      <div className="flex flex-col items-center space-y-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg">
          {theme && ( // Only render the image if the theme has been loaded on the client
            <Image
              src={
                theme === "dark"
                  ? "/brainfoglogo-white.png"
                  : "/brainfoglogo-dark.png"
              }
              alt="IRIS Logo"
              width={88}
              height={88}
            />
          )}
        </div>

        <div className="h-px w-8 bg-element-border"></div>

        {/* --- THIS BUTTON NOW USES THE NEW HANDLER --- */}
        <SidebarButton
          label="IRIS Chat"
          icon={<IrisLogo className="text-xl" />}
          isActive={activePrimaryTab === "iris"}
          onClick={handleIrisTabClick}
        />

        <SidebarButton
          label="Screener"
          icon={<BarChartHorizontalBig className="h-6 w-6" />}
          isActive={activePrimaryTab === "screener"}
          onClick={() => handleTabClick("screener")}
        />
        <SidebarButton
          label="Analysis"
          icon={<LayoutGrid className="h-6 w-6" />}
          isActive={activePrimaryTab === "analysis"}
          onClick={() => handleTabClick("analysis")}
        />
      </div>

      {/* Bottom section: Theme and Profile */}
      <div className="flex flex-col items-center space-y-4">
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          title={
            theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"
          }
          className="flex h-12 w-12 items-center justify-center rounded-lg text-text-secondary transition-colors hover:bg-element-bg hover:text-text-primary"
        >
          {theme === "light" ? (
            <Moon className="h-6 w-6" />
          ) : (
            <Sun className="h-6 w-6" />
          )}
        </button>
        <button
          onClick={() => handleTabClick("profile")}
          title="Profile"
          className={cn(
            "flex h-12 w-12 items-center justify-center rounded-full bg-element-bg transition-colors",
            activePrimaryTab === "profile"
              ? "ring-2 ring-accent"
              : "hover:ring-2 hover:ring-accent"
          )}
        >
          <User className="h-6 w-6 text-text-secondary" />
        </button>
      </div>
    </nav>
  );
}
