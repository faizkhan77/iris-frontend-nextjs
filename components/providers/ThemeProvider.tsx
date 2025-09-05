"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes";

/**
 * A client-side provider component that wraps the application and provides
 * theme context for light/dark mode switching. It uses the `next-themes` library.
 */
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
