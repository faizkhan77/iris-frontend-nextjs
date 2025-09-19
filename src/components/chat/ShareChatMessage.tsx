import { DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "@/components/ui/button";
import { Facebook, Twitter, Linkedin, Link, Check } from "lucide-react";
import type React from "react";
import PreviewMessage from "./PreviewMessage";
import { Input } from "../ui/input";
import { useAppSelector, type RootState } from "@/redux/store";
import { useState } from "react";

const ShareChatMessage: React.FC = () => {
  const message = useAppSelector(
    (state: RootState) => state.chat.share.message
  );
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(sharable_link);
    setCopied(true);
    setTimeout(() => setCopied(false), 4000); // reset after 2s
  };

  const sharable_link = `${import.meta.env.VITE_APP_URL}/share/m_${
    message?.id
  }`;
  return (
    <DialogContent className="w-full">
      <DialogHeader>
        <DialogTitle className="text-lg font-semibold">
          Share this message
        </DialogTitle>
      </DialogHeader>

      {/* Message Preview */}
      <div className="p-3 border rounded-md overflow-auto h-40 bg-muted/30 mb-4">
        <PreviewMessage message={message!} />
      </div>

      {/* Share Options */}
      <div className="space-y-3">
        <p className="text-sm text-muted-foreground">Share via:</p>
        <div className="flex gap-3 flex-wrap">
          <Button variant="outline" className="flex items-center gap-2" asChild>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Facebook size={16} /> Facebook
            </a>
          </Button>

          <Button variant="outline" className="flex items-center gap-2" asChild>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Twitter size={16} /> Twitter
            </a>
          </Button>

          <Button variant="outline" className="flex items-center gap-2" asChild>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Linkedin size={16} /> LinkedIn
            </a>
          </Button>

          <div className="flex items-center gap-2 w-full">
            <Input
              type="text"
              value={sharable_link}
              readOnly
              className="focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-transparent"
            />
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={handleCopy}
            >
              {copied ? <Check size={16} /> : <Link size={16} />}
              {copied ? "Copied!" : "Copy"}
            </Button>
          </div>
        </div>
      </div>
    </DialogContent>
  );
};

export default ShareChatMessage;
