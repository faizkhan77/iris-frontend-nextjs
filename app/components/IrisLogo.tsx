import { cn } from "../lib/utils";

export default function IrisLogo({ className }: { className?: string }) {
  return (
    <h1
      className={cn(
        // The core gradient text classes remain
        "font-bold text-transparent bg-clip-text bg-gradient-to-br",
        // NEW: Theme-aware gradient colors
        "from-gray-700 to-blue-600 dark:from-white dark:to-blue-400",
        // The className prop allows for overrides (like font size)
        className
      )}
    >
      IRIS
    </h1>
  );
}
