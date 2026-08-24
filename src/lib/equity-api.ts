// Thin client for the Django (DRF) Equity backend.
// Set VITE_EQUITY_API_URL (Vite) / NEXT_PUBLIC_EQUITY_API_URL (Next.js) to the
// backend origin, e.g. https://api.example.com/api/equity
// When it is not set, the UI falls back to the bundled demo data.

import {
  demoHome,
  demoAccounts,
  demoNotifications,
  demoTransactions,
  type Account,
  type HomePayload,
  type Notification,
  type Transaction,
} from "./equity-data";

function apiBase(): string | undefined {
  return process.env.NEXT_PUBLIC_EQUITY_API_URL;
}

function authToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem("equity_token");
}

async function get<T>(path: string, fallback: T): Promise<T> {
  const base = apiBase();
  if (!base) return fallback;
  try {
    const token = authToken();
    const res = await fetch(`${base.replace(/\/$/, "")}${path}`, {
      headers: token ? { Authorization: `Token ${token}` } : {},
    });
    if (!res.ok) return fallback;
    return (await res.json()) as T;
  } catch {
    return fallback;
  }
}

export const equityApi = {
  home: () => get<HomePayload>("/home/", demoHome),
  accounts: () => get<Account[]>("/accounts/", demoAccounts),
  transactions: () => get<Transaction[]>("/transactions/", demoTransactions),
  notifications: () => get<Notification[]>("/notifications/", demoNotifications),
};
