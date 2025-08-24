// app/layout.tsx
import type { Metadata } from "next";
import { ThemeProvider } from "../components/providers/ThemeProvider";
import PrimarySidebar from "../components/layout/PrimarySidebar";
import { cn } from "@/lib/utils";
import "../globals.css";
import { Toaster } from "sonner";
import { headers } from "next/headers";

export const metadata: Metadata = {
  title: "IRIS | AI Financial Analyst",
  description:
    "Your personal AI financial analyst, inspired by a modern, clean interface.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("font-sans")}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {/* The fixed, untoggleable primary sidebar */}
          <PrimarySidebar />

          {/* The main content area, offset to the right of the primary sidebar */}
          <main className="pl-20 h-screen">{children}</main>

          <Toaster theme="dark" position="bottom-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
