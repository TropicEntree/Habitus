import { useEffect, useState } from "react";

const KEY = "habitus_theme_mode";
const EVENT = "habitus_theme_mode_change";

export function getThemeModePref() {
  try {
    return localStorage.getItem(KEY) || "auto";
  } catch {
    return "auto";
  }
}

export function setThemeModePref(mode) {
  try {
    localStorage.setItem(KEY, mode);
    window.dispatchEvent(new Event(EVENT));
  } catch {
    /* ignore */
  }
}

/**
 * Manual light/dark/auto override, stored locally (same pattern as the
 * reminder config in notifications.js) so it applies instantly on every
 * screen, including pre-login, without depending on the Base44 profile.
 */
export function useThemeMode() {
  const [mode, setModeState] = useState(getThemeModePref);
  const [systemDark, setSystemDark] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia("(prefers-color-scheme: dark)").matches : false
  );

  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e) => setSystemDark(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    const handler = () => setModeState(getThemeModePref());
    window.addEventListener(EVENT, handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener(EVENT, handler);
      window.removeEventListener("storage", handler);
    };
  }, []);

  const isDark = mode === "auto" ? systemDark : mode === "dark";

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) root.classList.add("dark");
    else root.classList.remove("dark");
  }, [isDark]);

  const setMode = (m) => {
    setModeState(m);
    setThemeModePref(m);
  };

  return { isDark, mode, setMode };
}
