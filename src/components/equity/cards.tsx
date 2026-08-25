"use client";

import {
  ArrowLeftRight,
  ReceiptText,
  Smartphone,
  Plus,
  EyeOff,
  ChevronRight,
  MoreHorizontal,
  ArrowUp,
  ArrowRightLeft,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { forexRate, money, type Account } from "@/lib/equity-data";
import { BorrowIcon, InsureIcon, SaveIcon, TransactIcon } from "@/components/equity/icons";

const quickActions = [
  { icon: ArrowLeftRight, top: "Send", bottom: "money", href: "/send" },
  { icon: ReceiptText, top: "Pay with", bottom: "Equity", href: "/send" },
  { icon: Smartphone, top: "Buy", bottom: "Airtime", href: "/send" },
];

export function QuickActions() {
  return (
    <div className="flex items-start justify-center gap-8 py-4">
      {quickActions.map(({ icon: Icon, top, bottom, href }) => (
        <a key={top} href={href} className="flex w-20 flex-col items-center gap-2 text-center">
          <span className="grid size-12 place-items-center rounded-full bg-card">
            <Icon className="size-6 text-primary" strokeWidth={1.5} />
          </span>
          <span className="text-xs leading-tight text-foreground">
            {top}
            <br />
            <span className="text-primary">{bottom}</span>
          </span>
        </a>
      ))}
    </div>
  );
}

export function BalanceCard({ balance, loanLimit }: { balance: number; loanLimit: number | null }) {
  return (
    <section className="rounded-2xl border border-border bg-card px-4 py-3">
      <div className="flex items-center justify-between pb-3">
        <h2 className="text-base font-semibold text-foreground">My balance</h2>
        <button className="flex items-center gap-2 text-xs text-primary">
          Hide balance
          <EyeOff className="size-4" strokeWidth={1.5} />
        </button>
      </div>
      <div className="border-t border-dashed border-border pt-3">
        <button className="text-sm font-semibold text-primary">KES ⌄</button>
        <div className="mt-2 grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-muted-foreground">You have</p>
            <p className="mt-1 flex items-center gap-2 text-lg font-semibold text-foreground">
              <ArrowUp className="size-4 text-primary" strokeWidth={2} />
              {money(balance)}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Loan limit up to</p>
            <p className="mt-1 flex items-center gap-2 text-lg font-semibold text-foreground">
              <ReceiptText className="size-4 text-primary" strokeWidth={1.5} />
              {loanLimit === null ? "Fetching Loa…" : `${money(loanLimit)} KES`}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

const serviceTiles = [
  { icon: TransactIcon, label: "Transact", href: "/send" },
  { icon: BorrowIcon, label: "Borrow", href: "/" },
  { icon: SaveIcon, label: "Save", href: "/" },
  { icon: InsureIcon, label: "Insure", href: "/" },
];


export function ServiceTiles() {
  return (
    <section className="mt-4 rounded-2xl border border-border bg-card p-4">
      <div className="flex items-start justify-between">
        {serviceTiles.map(({ icon: Icon, label, href }) => (
          <a key={label} href={href} className="flex flex-1 flex-col items-center gap-2">
            <span className="grid size-14 place-items-center rounded-full bg-primary/70">
              <Icon className="size-8 text-[#231f20]" />
            </span>
            <span className="text-xs text-foreground">{label}</span>
          </a>
        ))}
      </div>
    </section>
  );
}

export function AccountCard({
  account,
  loanPending = false,
}: {
  account: Account;
  loanPending?: boolean;
}) {
  return (
    <article className="relative overflow-hidden rounded-lg bg-gradient-account p-4 shadow-card">
      <div className="pointer-events-none absolute inset-0 opacity-[0.07]">
        <div className="absolute -left-10 top-2 h-40 w-[130%] rotate-[-24deg] bg-white" />
        <div className="absolute -right-16 bottom-0 h-32 w-[130%] rotate-[22deg] bg-white" />
      </div>
      <div className="relative flex items-start justify-between gap-3">
        <h3 className="min-w-0 truncate text-base font-semibold text-primary-foreground">
          {account.account_name}
        </h3>
        <button className="grid size-7 shrink-0 place-items-center rounded-full bg-primary-foreground">
          <MoreHorizontal className="size-4 text-[#8f0f22]" />
        </button>
      </div>
      <p className="relative mt-1 text-2xl font-semibold text-primary-foreground">
        {money(account.balance)} {account.currency}
      </p>
      <p className="relative mt-1 text-sm text-primary-foreground/90">
        {loanPending
          ? "Fetching Loan Limit..."
          : `Loan limit up to ${money(account.loan_limit)} ${account.currency}`}
      </p>
      <p className="relative mt-5 text-xs text-primary-foreground/90">
        {account.account_number} • {account.account_type}
      </p>
    </article>
  );
}

export function ForexCalculatorCard() {
  return (
    <section className="mt-3 rounded-2xl border border-border bg-card px-4 py-3">
      <a href="/" className="flex items-center justify-between pb-3">
        <h2 className="text-base font-semibold text-foreground">Forex Calculator</h2>
        <ChevronRight className="size-5 text-primary" />
      </a>
      <div className="flex items-center justify-between border-t border-dashed border-border py-3">
        <div className="flex items-center gap-2">
          <img
            src="/flags/usd.png"
            alt="US dollar"
            className="size-9 shrink-0 rounded-full object-cover"
          />
          <span>
            <span className="block text-sm font-semibold text-foreground">{forexRate.base}</span>
            <span className="block text-xs text-muted-foreground">{forexRate.amount}</span>
          </span>
        </div>
        <ArrowRightLeft className="size-5 text-muted-foreground" strokeWidth={1.5} />
        <div className="flex items-center gap-2">
          <span className="text-right">
            <span className="block text-sm font-semibold text-foreground">{forexRate.quote}</span>
            <span className="block text-xs text-muted-foreground">{forexRate.mid}</span>
          </span>
          <img
            src="/flags/kes.png"
            alt="Kenyan shilling"
            className="size-9 shrink-0 rounded-full object-cover"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 border-t border-dashed border-border pt-3">
        <div>
          <p className="text-xs text-muted-foreground">To buy 1 {forexRate.base}</p>
          <p className="mt-1 flex items-center gap-2 text-sm font-semibold text-primary">
            {forexRate.buy}
            <TrendingDown className="size-4" strokeWidth={2} />
          </p>
        </div>
        <div className="border-l border-dashed border-border pl-3">
          <p className="text-xs text-muted-foreground">To sell 1 {forexRate.base}</p>
          <p className="mt-1 flex items-center gap-2 text-sm font-semibold text-emerald-500">
            {forexRate.sell}
            <TrendingUp className="size-4" strokeWidth={2} />
          </p>
        </div>
      </div>
    </section>
  );
}

export function LinkExistingCard() {
  return (
    <a
      href="/accounts"
      className="mt-3 flex items-center gap-3 rounded-2xl border border-border bg-card p-4"
    >
      <span className="grid size-12 shrink-0 place-items-center rounded-full bg-secondary">
        <Plus className="size-6 text-primary" />
      </span>
      <span className="flex-1">
        <span className="block text-sm font-semibold text-foreground">Link existing</span>
        <span className="block text-xs text-muted-foreground">
          Link an existing bank account, card, mobile wallet or PayPal
        </span>
      </span>
      <ChevronRight className="size-5 text-primary" />
    </a>
  );
}

export function AccountsSummary({ total }: { total: number }) {
  return (
    <section className="rounded-2xl border border-border bg-card px-4 py-3">
      <div className="flex items-center justify-between pb-3">
        <h2 className="text-base font-semibold text-foreground">My accounts</h2>
        <button className="flex items-center gap-2 text-xs text-primary">
          Hide balance
          <EyeOff className="size-4" strokeWidth={1.5} />
        </button>
      </div>
      <div className="flex items-center gap-8 border-t border-dashed border-border pt-3">
        <span className="text-sm font-semibold text-primary">KES ⌄</span>
        <span className="text-lg text-foreground">{money(total)}</span>
      </div>
    </section>
  );
}
