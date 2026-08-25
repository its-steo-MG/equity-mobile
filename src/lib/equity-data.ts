// Shared types + formatting helpers for the Equity mobile clone.
// All data is served by the Django backend (see src/lib/equity-api.ts).
// There is no mock/demo data in this app.

export type Account = {
  id: number;
  account_name: string;
  account_number: string;
  account_type: string;
  balance: number;
  currency: string;
  is_primary: boolean;
  loan_limit: number;
};

export type Transaction = {
  id: number;
  amount: number;
  transaction_type: string;
  description: string;
  reference: string;
  balance_after: number;
  created_at: string;
};

export type Notification = {
  id: number;
  title: string;
  body: string;
  is_read: boolean;
  created_at: string;
};

export type QuickAction = { id: string; label: string };

export type HomePayload = {
  greeting: string;
  primary_account: Account | null;
  accounts: Account[];
  total_balance: number;
  quick_actions?: QuickAction[];
};

export const emptyHome: HomePayload = {
  greeting: "",
  primary_account: null,
  accounts: [],
  total_balance: 0,
  quick_actions: [],
};

// Indicative FX display rates (the backend has no equity FX endpoint).
export const forexRate = {
  base: "USD",
  quote: "KES",
  amount: 1,
  mid: 131.75,
  buy: 126.3,
  sell: 131.75,
};

export function num(value: unknown): number {
  const n = typeof value === "number" ? value : Number(value ?? 0);
  return Number.isFinite(n) ? n : 0;
}

export function money(value: unknown) {
  return num(value).toLocaleString("en-KE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function initialsOf(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "EQ";
  const first = parts[0]?.[0] ?? "";
  const second = parts[1]?.[0] ?? parts[0]?.[1] ?? "";
  return `${first}${second}`.toUpperCase();
}

export function nameFromGreeting(greeting: string) {
  return greeting.includes(",") ? (greeting.split(",")[1] ?? "").trim() : greeting.trim();
}

export function maskAccount(accountNumber: string) {
  if (!accountNumber) return "0***0000";
  return `0***${accountNumber.slice(-4)}`;
}

export function formatWhen(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return `${d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })} at ${d
    .toTimeString()
    .slice(0, 5)} EAT`;
}
