"use client";

import { useCallback, useEffect, useState } from "react";

const KEY = "equity.theme";
export type Theme = "dark" | "light";

function apply(theme: Theme) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.classList.toggle("light", theme === "light");
  root.dataset["theme"] = theme;
}

/** App theme (dark by default, matching the Equity Mobile look). */
export function useTheme() {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const stored = (localStorage.getItem(KEY) as Theme | null) ?? "dark";
    setTheme(stored);
    apply(stored);
  }, []);

  const set = useCallback((next: Theme) => {
    setTheme(next);
    localStorage.setItem(KEY, next);
    apply(next);
  }, []);

  const toggle = useCallback(() => set(theme === "dark" ? "light" : "dark"), [set, theme]);

  return { theme, isDark: theme === "dark", setTheme: set, toggle };
}
