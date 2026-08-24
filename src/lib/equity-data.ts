// Shared types + demo data for the Equity mobile clone.
// The real data comes from the Django backend (see src/lib/equity-api.ts);
// this demo payload keeps the UI populated when no API is configured.

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

export type HomePayload = {
  greeting: string;
  primary_account: Account | null;
  accounts: Account[];
  total_balance: number;
};

export const demoAccounts: Account[] = [
  {
    id: 1,
    account_name: "Shee 💃🌸",
    account_number: "0630185598928",
    account_type: "Savings Account",
    balance: 400.95,
    currency: "KES",
    is_primary: true,
    loan_limit: 0,
  },
];

export const demoHome: HomePayload = {
  greeting: "Good evening, Elizabeth",
  primary_account: demoAccounts[0] ?? null,
  accounts: demoAccounts,
  total_balance: 400.95,
};

export const demoTransactions: Transaction[] = [
  {
    id: 1,
    amount: 50,
    transaction_type: "withdrawal_credit",
    description:
      "You have received 50.00 KES from SASHITRENDY TECHNOLOGY 0***3723 to your Equity account 0***8928.",
    reference: "X2BE471FA0AFA",
    balance_after: 400.95,
    created_at: "2026-08-24T20:46:00+03:00",
  },
  {
    id: 2,
    amount: -20,
    transaction_type: "airtime",
    description: "Airtime purchase 254*****854 Safaricom",
    reference: "X2BE0091AB12",
    balance_after: 350.95,
    created_at: "2026-08-23T09:12:00+03:00",
  },
  {
    id: 3,
    amount: 500,
    transaction_type: "credit",
    description: "Salary credit",
    reference: "X2BE7712CD41",
    balance_after: 370.95,
    created_at: "2026-08-20T13:02:00+03:00",
  },
];

export const demoNotifications: Notification[] = [
  {
    id: 1,
    title: "You have received 50.00 KES",
    body: "You have received 50.00 KES from SASHITRENDY TECHNOLOGY 0***3723 to your Equity account 0***8928. Ref. X2BE471FA0AFA on 24 Aug 2026 at 20:46 EAT.",
    is_read: false,
    created_at: "2026-08-24T20:46:00+03:00",
  },
  {
    id: 2,
    title: "Loan limit updated",
    body: "Your Equity loan limit has been refreshed. Check Borrow for your new limit.",
    is_read: false,
    created_at: "2026-08-22T08:00:00+03:00",
  },
];

export const profile = {
  fullName: "Elizabeth Wanjiku Karanja",
  initials: "EW",
  email: "shikcmuiruri@gmail.com",
  phone: "+254 794 277854",
};

export const forexRate = {
  base: "USD",
  quote: "KES",
  amount: 1,
  mid: 131.75,
  buy: 126.3,
  sell: 131.75,
};

export function money(value: number) {
  return value.toLocaleString("en-KE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function maskAccount(accountNumber: string) {
  if (!accountNumber) return "0***0000";
  return `0***${accountNumber.slice(-4)}`;
}

export function formatWhen(iso: string) {
  const d = new Date(iso);
  return `${d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })} at ${d
    .toTimeString()
    .slice(0, 5)} EAT`;
}
