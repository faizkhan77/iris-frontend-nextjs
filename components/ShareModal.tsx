// app/components/ShareModal.tsx

"use client";

import { useState } from "react";
import { X, Copy, Check, MessageSquareText } from "lucide-react";
import { FaWhatsapp, FaTwitter, FaFacebook } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { Switch } from "@/components/ui/switch"; // <-- Import Switch
import { Label } from "@/components/ui/label"; // <-- Import Label

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  messageContent: string;
  messageId: number;
  userName: string;
}

const SocialButton = ({
  href,
  children,
  label,
}: {
  href: string;
  children: React.ReactNode;
  label: string;
}) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="flex flex-col items-center gap-2 text-text-secondary transition-colors hover:text-accent"
  >
    <div className="flex h-12 w-12 items-center justify-center rounded-full border border-element-border bg-element-bg">
      {children}
    </div>
    <span className="text-xs">{label}</span>
  </a>
);

export default function ShareModal({
  isOpen,
  onClose,
  messageContent,
  messageId,
  userName,
}: ShareModalProps) {
  const [copied, setCopied] = useState(false);

  const [isAnonymous, setIsAnonymous] = useState(true); // Default to true

  if (!isOpen) return null;

  // --- MODIFIED: URL now includes the sender if not anonymous ---
  const shareUrl = `${window.location.origin}/share/${messageId}${
    !isAnonymous ? `?sender=${encodeURIComponent(userName)}` : ""
  }`;
  const shareText = `Check out this financial insight from IRIS:`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="relative w-full max-w-md rounded-2xl border border-element-border bg-background p-6 shadow-xl dark:bg-sidebar-secondary-bg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mt-6 rounded-lg border border-element-border p-3">
              <Label
                htmlFor="anonymous-toggle"
                className="flex flex-col space-y-1"
              >
                <span className="font-medium text-text-primary">
                  Send Anonymously
                </span>
                <span className="text-xs text-text-secondary">
                  Hide your username from the shared page.
                </span>
              </Label>
              <Switch
                id="anonymous-toggle"
                checked={isAnonymous}
                onCheckedChange={setIsAnonymous}
              />
            </div>

            {/* The shared message content preview */}
            <div className="h-48 overflow-y-auto rounded-xl bg-content-bg p-4 custom-scrollbar">
              <p className="text-sm text-text-primary whitespace-pre-wrap">
                {messageContent}
              </p>
            </div>
            <div className="mt-2 flex justify-end text-sm font-semibold text-text-secondary">
              Shared from IRIS
            </div>

            {/* Social Share Icons */}
            <div className="mt-6 flex justify-around">
              <SocialButton
                href={`https://wa.me/?text=${encodeURIComponent(
                  shareText + " " + shareUrl
                )}`}
                label="WhatsApp"
              >
                <FaWhatsapp size={24} className="text-green-500" />
              </SocialButton>
              <SocialButton
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
                  shareUrl
                )}&text=${encodeURIComponent(shareText)}`}
                label="X"
              >
                <FaTwitter size={24} className="text-sky-500" />
              </SocialButton>
              <SocialButton
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                  shareUrl
                )}`}
                label="Facebook"
              >
                <FaFacebook size={24} className="text-blue-600" />
              </SocialButton>
            </div>

            {/* Copy Link Section */}
            <div className="mt-8 flex items-center gap-3 rounded-lg border border-element-border bg-content-bg p-2">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="flex-grow bg-transparent text-sm text-text-secondary outline-none"
              />
              <button
                onClick={handleCopy}
                className="flex h-8 w-20 items-center justify-center rounded-md bg-accent text-sm text-black transition-colors hover:bg-accent-hover"
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
                <span className="ml-1.5">{copied ? "Copied" : "Copy"}</span>
              </button>
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 h-8 w-8 rounded-full bg-element-bg text-text-secondary transition-colors hover:bg-element-bg-hover"
            >
              <X size={18} className="m-auto" />
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
