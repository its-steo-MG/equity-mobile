import {
  ArrowLeftRight,
  ReceiptText,
  Smartphone,
  Calculator,
  HandCoins,
  PiggyBank,
  Umbrella,
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
  { icon: Calculator, label: "Transact", href: "/send" },
  { icon: HandCoins, label: "Borrow", href: "/" },
  { icon: PiggyBank, label: "Save", href: "/" },
  { icon: Umbrella, label: "Insure", href: "/" },
];

export function ServiceTiles() {
  return (
    <section className="mt-4 rounded-2xl border border-border bg-card p-4">
      <div className="flex items-start justify-between">
        {serviceTiles.map(({ icon: Icon, label, href }) => (
          <a key={label} href={href} className="flex flex-1 flex-col items-center gap-2">
            <span className="grid size-14 place-items-center rounded-full bg-primary/70">
              <Icon className="size-7 text-background" strokeWidth={1.5} />
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
    <article className="relative overflow-hidden rounded-2xl bg-gradient-account p-4 shadow-card">
      <div className="flex items-start justify-between">
        <h3 className="text-base font-semibold text-primary-foreground">{account.account_name}</h3>
        <button className="grid size-7 place-items-center rounded-full bg-primary-foreground">
          <MoreHorizontal className="size-4 text-[#8f0f22]" />
        </button>
      </div>
      <p className="mt-1 text-2xl font-semibold text-primary-foreground">
        {money(account.balance)} {account.currency}
      </p>
      {loanPending ? (
        <p className="mt-1 text-sm text-primary-foreground/80">Fetching Loan Limit...</p>
      ) : null}
      <p className="mt-6 text-xs text-primary-foreground/90">
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
          <span className="grid size-9 place-items-center rounded-full bg-secondary text-base">🇺🇸</span>
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
          <span className="grid size-9 place-items-center rounded-full bg-secondary text-base">🇰🇪</span>
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
