// app/share/[messageId]/ShareDisplay.tsx
"use client";

import ChatMessages, { Message } from "@/app/components/ChatMessages";

export default function ShareDisplay({ message }: { message: Message }) {
  return (
    // This is the key change. We make THIS div the scrollable container.
    <div className="h-full w-full overflow-y-auto flex flex-col items-center bg-background p-4">
      {/* 
        - h-full: Takes the full height from its parent (<main> which is h-screen).
        - overflow-y-auto: If the content inside this div is taller than h-full, a scrollbar will appear on this div.
        - flex, flex-col, items-center: Keeps the content column centered horizontally.
      */}
      <div className="w-full max-w-2xl py-12 md:py-20">
        <ChatMessages
          messages={[message]}
          onClarificationOptionClick={() => {}}
          onShareClick={() => {}}
        />
        <div className="mt-6 flex justify-center text-lg font-semibold text-text-primary">
          Shared via IRIS
        </div>
      </div>
    </div>
  );
}
