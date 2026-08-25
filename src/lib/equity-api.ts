// Client for the TraderiserApp Django (DRF) backend.
// Base URL: set VITE_EQUITY_API_URL (Vite) / NEXT_PUBLIC_API_URL (Next.js).
// Defaults to the live backend. Equity endpoints live under `${base}/equity/`,
// auth (JWT / simplejwt) under `${base}/accounts/`.
// NOTE: this app contains no mock data — every screen reads from the backend.

import {
  num,
  type Account,
  type HomePayload,
  type Notification,
  type Transaction,
} from "./equity-data";

declare const process: { env: Record<string, string | undefined> } | undefined;

//const DEFAULT_BASE = "http://localhost:8000/api";
const DEFAULT_BASE = "https://traderiserproapp.onrender.com/api";

export function apiBase(): string {
  const viteEnv = (import.meta as unknown as { env?: Record<string, string | undefined> }).env;
  const fromEnv =
    viteEnv?.["VITE_EQUITY_API_URL"] ??
    (typeof process !== "undefined"
      ? (process?.env?.["NEXT_PUBLIC_API_URL"] ?? process?.env?.["NEXT_PUBLIC_EQUITY_API_URL"])
      : undefined);
  return (fromEnv || DEFAULT_BASE).replace(/\/$/, "");
}

const ACCESS_KEY = "access_token";
const REFRESH_KEY = "refresh_token";
const PROFILE_KEY = "equity_profile";

export type StoredProfile = {
  fullName: string;
  username: string;
  email: string;
  phone: string;
};

export const auth = {
  access: () => (typeof window === "undefined" ? null : localStorage.getItem(ACCESS_KEY)),
  refresh: () => (typeof window === "undefined" ? null : localStorage.getItem(REFRESH_KEY)),
  isSignedIn: () => Boolean(auth.access()),
  save: (access: string, refresh?: string) => {
    localStorage.setItem(ACCESS_KEY, access);
    if (refresh) localStorage.setItem(REFRESH_KEY, refresh);
  },
  clear: () => {
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
    localStorage.removeItem(PROFILE_KEY);
  },
  profile: (): StoredProfile | null => {
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem(PROFILE_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as StoredProfile;
    } catch {
      return null;
    }
  },
  saveProfile: (patch: Partial<StoredProfile>) => {
    if (typeof window === "undefined") return;
    const current = auth.profile() ?? { fullName: "", username: "", email: "", phone: "" };
    localStorage.setItem(PROFILE_KEY, JSON.stringify({ ...current, ...patch }));
  },
};

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function refreshAccessToken(): Promise<string | null> {
  const refresh = auth.refresh();
  if (!refresh) return null;
  try {
    const res = await fetch(`${apiBase()}/accounts/token/refresh/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh }),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { access?: string };
    if (!data.access) return null;
    auth.save(data.access);
    return data.access;
  } catch {
    return null;
  }
}

async function request(path: string, init: RequestInit = {}): Promise<Response> {
  const headers = new Headers(init.headers);
  headers.set("Content-Type", "application/json");
  const token = auth.access();
  if (token) headers.set("Authorization", `Bearer ${token}`);

  let res = await fetch(`${apiBase()}${path}`, { ...init, headers });
  if (res.status === 401 && token) {
    const fresh = await refreshAccessToken();
    if (fresh) {
      headers.set("Authorization", `Bearer ${fresh}`);
      res = await fetch(`${apiBase()}${path}`, { ...init, headers });
    }
  }
  return res;
}

// Live GET — no fallback data. Throws ApiError so screens can show a real state.
async function get<T>(path: string): Promise<T> {
  if (!auth.isSignedIn()) throw new ApiError("Please sign in to load your account", 401);
  let res: Response;
  try {
    res = await request(path);
  } catch {
    throw new ApiError("Cannot reach the Equity backend. Check your connection.", 0);
  }
  if (res.status === 401 || res.status === 403) {
    throw new ApiError("Your session expired. Please sign in again.", res.status);
  }
  if (!res.ok) throw new ApiError(`Request failed (${res.status})`, res.status);
  const data = (await res.json()) as T | { results?: T };
  if (data && typeof data === "object" && "results" in (data as Record<string, unknown>)) {
    return (data as { results?: T }).results as T;
  }
  return data as T;
}

function normalizeAccount(a: Account): Account {
  return { ...a, balance: num(a.balance), loan_limit: num(a.loan_limit) };
}

export const equityApi = {
  home: async (): Promise<HomePayload> => {
    const data = await get<HomePayload>("/equity/home/");
    const accounts = (data.accounts ?? []).map(normalizeAccount);
    const home: HomePayload = {
      greeting: data.greeting ?? "",
      accounts,
      primary_account: data.primary_account ? normalizeAccount(data.primary_account) : null,
      total_balance: num(data.total_balance),
      quick_actions: data.quick_actions ?? [],
    };
    const name = home.greeting.includes(",")
      ? (home.greeting.split(",")[1] ?? "").trim()
      : home.greeting.trim();
    if (name) auth.saveProfile({ fullName: name });
    return home;
  },
  accounts: async (): Promise<Account[]> =>
    (await get<Account[]>("/equity/accounts/")).map(normalizeAccount),
  transactions: async (accountId?: number): Promise<Transaction[]> => {
    const items = await get<Transaction[]>(
      `/equity/transactions/${accountId ? `?account_id=${accountId}` : ""}`,
    );
    return items.map((t) => ({ ...t, amount: num(t.amount), balance_after: num(t.balance_after) }));
  },
  notifications: () => get<Notification[]>("/equity/notifications/"),
  markNotificationRead: async (id: number) => {
    const res = await request(`/equity/notifications/${id}/read/`, { method: "POST" });
    return res.ok;
  },
  login: async (username: string, password: string, accountType = "real") => {
    const res = await request("/accounts/login/", {
      method: "POST",
      body: JSON.stringify({ username, email: username, password, account_type: accountType }),
    });
    const data = (await res.json().catch(() => ({}))) as {
      access?: string;
      refresh?: string;
      detail?: string;
      error?: string;
      user?: { username?: string; email?: string; full_name?: string; phone?: string };
    };
    if (!res.ok || !data.access) {
      throw new ApiError(data.detail || data.error || "Invalid credentials", res.status);
    }
    auth.save(data.access, data.refresh);
    auth.saveProfile({
      username: data.user?.username ?? username,
      email: data.user?.email ?? (username.includes("@") ? username : ""),
      ...(data.user?.full_name ? { fullName: data.user.full_name } : {}),
      ...(data.user?.phone ? { phone: data.user.phone } : {}),
    });
    return data;
  },
  logout: () => auth.clear(),
};
