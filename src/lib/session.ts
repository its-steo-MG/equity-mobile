"use client";

// Session freshness: the app must ask for the password again when it is
// re-opened after 5 minutes of inactivity (or launched fresh from the icon).

import { auth } from "./equity-api";

const LAST_ACTIVE_KEY = "equity.lastActive";
const TIMEOUT_MS = 5 * 60 * 1000;

export function touchActivity() {
  if (typeof window === "undefined") return;
  localStorage.setItem(LAST_ACTIVE_KEY, String(Date.now()));
}

export function sessionFresh(): boolean {
  if (typeof window === "undefined") return true;
  if (!auth.isSignedIn()) return false;
  const raw = Number(localStorage.getItem(LAST_ACTIVE_KEY) ?? 0);
  if (!raw) return false;
  return Date.now() - raw <= TIMEOUT_MS;
}

export function expireSession() {
  auth.clear();
  localStorage.removeItem(LAST_ACTIVE_KEY);
}

/** True when the app is running as an installed PWA. */
export function isStandalone(): boolean {
  if (typeof window === "undefined") return false;
  const nav = window.navigator as Navigator & { standalone?: boolean };
  return (
    window.matchMedia?.("(display-mode: standalone)").matches === true ||
    window.matchMedia?.("(display-mode: fullscreen)").matches === true ||
    nav.standalone === true
  );
}

/**
 * Redirects to /login when the stored session is missing or stale, and keeps
 * the activity stamp fresh while the user is using the app.
 */
export function guardSession(onExpired: () => void) {
  if (typeof window === "undefined") return () => undefined;

  const check = () => {
    if (!sessionFresh()) {
      expireSession();
      onExpired();
      return false;
    }
    return true;
  };

  if (!check()) return () => undefined;
  touchActivity();

  const activity = () => {
    if (check()) touchActivity();
  };
  const visibility = () => {
    if (document.visibilityState === "visible") activity();
    else touchActivity();
  };

  const events: (keyof WindowEventMap)[] = ["pointerdown", "keydown", "scroll", "focus"];
  events.forEach((e) => window.addEventListener(e, activity, { passive: true }));
  document.addEventListener("visibilitychange", visibility);
  const id = window.setInterval(check, 15000);

  return () => {
    events.forEach((e) => window.removeEventListener(e, activity));
    document.removeEventListener("visibilitychange", visibility);
    window.clearInterval(id);
  };
}
