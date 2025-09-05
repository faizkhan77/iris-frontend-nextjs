// components/ChatHeader.tsx
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { HelpCircle, Settings, User } from "lucide-react";
import IrisLogo from "./IrisLogo";

export default function ChatHeader() {
  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="flex items-center justify-between px-4 py-2.5 border-b border-[var(--border-color)] shadow-sm shrink-0 sticky top-0 bg-[#161616]/80 backdrop-blur-md z-10"
    >
      <Link href="/" className="flex items-center group">
        <IrisLogo className="text-2xl bg-gradient-to-br from-gray-200 to-purple-400" />
      </Link>
      <div className="flex items-center space-x-2 md:space-x-3">
        <button
          className="p-2 rounded-full hover:bg-gray-700/50 transition-colors text-gray-400 hover:text-gray-100"
          title="Help"
        >
          <HelpCircle size={20} />
        </button>
        <button
          className="p-2 rounded-full hover:bg-gray-700/50 transition-colors text-gray-400 hover:text-gray-100"
          title="Settings"
        >
          <Settings size={20} />
        </button>
        <button
          className="p-2 rounded-full hover:bg-gray-700/50 transition-colors text-gray-400 hover:text-gray-100"
          title="Profile"
        >
          <User size={20} />
        </button>
      </div>
    </motion.header>
  );
}
