// components/IrisLogo.tsx
import { cn } from "../lib/utils";

export default function IrisLogo({ className }: { className?: string }) {
  return (
    <h1
      className={cn(
        "font-bold text-transparent bg-clip-text bg-gradient-to-br from-white to-purple-300",
        className
      )}
    >
      IRIS
    </h1>
  );
}
