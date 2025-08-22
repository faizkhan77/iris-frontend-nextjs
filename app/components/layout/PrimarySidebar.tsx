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
import { cn } from "@/lib/utils";
import IrisLogo from "../IrisLogo";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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
      "relative flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-300 ease-out",
      isActive
        ? "bg-gradient-to-br from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/40 scale-105"
        : "text-text-secondary hover:bg-element-bg hover:scale-105 hover:text-text-primary hover:shadow-md hover:shadow-cyan-500/20"
    )}
  >
    {icon}
  </button>
);

export default function PrimarySidebar() {
  const {
    user,
    activePrimaryTab,
    setActivePrimaryTab,
    toggleSecondarySidebar,
  } = useAppStore();
  const { theme, setTheme } = useTheme();
  const router = useRouter();

  const handleTabClick = (tab: PrimaryTab) => {
    setActivePrimaryTab(tab);
    if (tab !== "profile") {
      router.push("/");
    }
  };

  const handleIrisTabClick = () => {
    if (activePrimaryTab === "iris") {
      toggleSecondarySidebar();
    } else {
      setActivePrimaryTab("iris");
    }
  };

  const handleProfileClick = () => {
    if (user && user.user_id) {
      setActivePrimaryTab("profile");
      router.push(`/profile/${user.user_id}`);
    } else {
      console.error("User not found, cannot navigate to profile.");
      router.push("/login");
    }
  };

  return (
    <nav
      className="fixed left-0 top-0 z-50 flex h-full w-20 flex-col items-center justify-between 
      border-r border-element-border bg-gradient-to-b from-sidebar-primary-bg to-sidebar-primary-bg/90 p-4
      shadow-lg animate-slide-in"
    >
      {/* Top Section */}
      <div className="flex flex-col items-center space-y-5">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg">
          {theme && (
            <Image
              src={
                theme === "dark"
                  ? "/brainfoglogo-white.png"
                  : "/brainfoglogo-dark.png"
              }
              alt="IRIS Logo"
              width={88}
              height={88}
              className="transition-transform duration-500 hover:rotate-6"
            />
          )}
        </div>

        <div className="h-px w-8 bg-element-border"></div>

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

      {/* Bottom Section */}
      <div className="flex flex-col items-center space-y-4">
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          title={
            theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"
          }
          className="flex h-12 w-12 items-center justify-center rounded-lg text-text-secondary 
          transition-all duration-300 hover:bg-element-bg hover:text-text-primary hover:rotate-12"
        >
          {theme === "light" ? (
            <Moon className="h-6 w-6" />
          ) : (
            <Sun className="h-6 w-6" />
          )}
        </button>

        <button
          onClick={handleProfileClick}
          title="Profile"
          className={cn(
            "flex h-12 w-12 items-center justify-center rounded-full bg-element-bg transition-all duration-300",
            activePrimaryTab === "profile"
              ? "ring-2 ring-cyan-500 shadow-lg shadow-cyan-500/30 scale-105"
              : "hover:ring-2 hover:ring-cyan-500/50 hover:shadow-md hover:shadow-cyan-500/20 hover:scale-105"
          )}
        >
          <User className="h-6 w-6 text-text-secondary" />
        </button>
      </div>
    </nav>
  );
}
