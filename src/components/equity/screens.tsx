"use client";

import { useEffect, useState } from "react";
import {
  ChevronRight,
  Search,
  Contact,
  Bell,
  Gauge,
  Globe,
  MessageCircle,
  Mail,
  HelpCircle,
  ShieldCheck,
  Share2,
} from "lucide-react";
import { AppShell } from "./shell";
import {
  AccountCard,
  AccountsSummary,
  BalanceCard,
  ForexCalculatorCard,
  LinkExistingCard,
  QuickActions,
  ServiceTiles,
} from "./cards";
import { equityApi } from "@/lib/equity-api";
import {
  demoHome,
  demoNotifications,
  demoTransactions,
  formatWhen,
  money,
  profile,
  type HomePayload,
  type Notification,
  type Transaction,
} from "@/lib/equity-data";

export function HomeScreen() {
  const [data, setData] = useState<HomePayload>(demoHome);
  const [loanReady, setLoanReady] = useState(false);

  useEffect(() => {
    equityApi.home().then(setData).catch(() => undefined);
    const t = setTimeout(() => setLoanReady(true), 2500);
    return () => clearTimeout(t);
  }, []);

  const primary = data.primary_account ?? data.accounts[0] ?? null;

  return (
    <AppShell title="Home" active="home" showQr>
      <p className="py-2 text-center text-lg text-foreground">
        {data.greeting.split(",")[0]},{" "}
        <span className="font-semibold">{data.greeting.split(",")[1]?.trim()}</span>
      </p>
      <QuickActions />
      <BalanceCard
        balance={primary?.balance ?? 0}
        loanLimit={loanReady ? (primary?.loan_limit ?? 0) : null}
      />
      <ServiceTiles />
      <h2 className="mb-3 mt-6 text-xl font-semibold text-foreground">My accounts</h2>
      <div className="space-y-3">
        {data.accounts.map((account) => (
          <AccountCard key={account.id} account={account} loanPending={!loanReady} />
        ))}
      </div>
      <ForexCalculatorCard />
      <LinkExistingCard />
      <TransactionList />
    </AppShell>
  );
}

function TransactionList() {
  const [items, setItems] = useState<Transaction[]>(demoTransactions);
  useEffect(() => {
    equityApi.transactions().then(setItems).catch(() => undefined);
  }, []);

  return (
    <section className="mt-6">
      <h2 className="mb-3 text-xl font-semibold text-foreground">Recent activity</h2>
      <ul className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
        {items.map((tx) => (
          <li key={tx.id} className="flex items-start gap-3 p-4">
            <span className="flex-1">
              <span className="block text-sm text-foreground">{tx.description}</span>
              <span className="mt-1 block text-[11px] text-muted-foreground">
                Ref. {tx.reference} • {formatWhen(tx.created_at)}
              </span>
            </span>
            <span
              className={`shrink-0 text-sm font-semibold ${
                tx.amount < 0 ? "text-muted-foreground" : "text-primary"
              }`}
            >
              {tx.amount < 0 ? "-" : "+"}
              {money(Math.abs(tx.amount))}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function AccountsScreen() {
  const [data, setData] = useState<HomePayload>(demoHome);
  useEffect(() => {
    equityApi.home().then(setData).catch(() => undefined);
  }, []);

  return (
    <AppShell title="Accounts" active="accounts">
      <AccountsSummary total={data.total_balance} />
      <h2 className="mb-3 mt-6 text-xl font-semibold text-foreground">My accounts</h2>
      <div className="space-y-3">
        {data.accounts.map((account) => (
          <AccountCard key={account.id} account={account} />
        ))}
      </div>
      <LinkExistingCard />
    </AppShell>
  );
}

export function SendMoneyScreen() {
  const [phone, setPhone] = useState("");

  return (
    <AppShell title="Send money" active="home">
      <h2 className="pt-2 text-xl font-semibold text-foreground">
        Please enter the recipient&apos;s details
      </h2>
      <label className="mt-5 block text-xs text-muted-foreground" htmlFor="phone">
        Mobile number
      </label>
      <div className="mt-1 flex items-center gap-3 border-b border-border pb-2">
        <span className="text-sm text-foreground">+254</span>
        <input
          id="phone"
          inputMode="numeric"
          value={phone}
          onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
          placeholder="Enter phone number"
          className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
        />
        <Contact className="size-5 text-primary" strokeWidth={1.5} />
      </div>
      <button
        disabled={phone.length < 9}
        className="ml-auto mt-5 block rounded-lg bg-secondary px-6 py-2 text-sm font-medium text-secondary-foreground disabled:opacity-60 enabled:bg-primary enabled:text-primary-foreground"
      >
        Continue
      </button>

      <div className="mt-6 flex items-center gap-3 rounded-lg border border-border bg-card px-3 py-2">
        <input
          placeholder="Search for a recipient"
          className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
        />
        <Search className="size-5 text-foreground" strokeWidth={1.5} />
      </div>

      <div className="mt-6 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Favourites</h3>
        <button className="text-sm text-primary">Manage</button>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">0 favourites found</p>

      <h3 className="mt-6 text-lg font-semibold text-foreground">Recents</h3>
      <ul className="mt-3 space-y-3">
        {["254*****854"].map((n) => (
          <li key={n} className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-full bg-emerald-600/80 text-[10px] font-bold text-primary-foreground">
              SAF
            </span>
            <span className="flex-1">
              <span className="block text-sm text-foreground">{n}</span>
              <span className="block text-xs text-muted-foreground">Safaricom • Kenya</span>
            </span>
            <span className="size-5 rounded-full border border-primary" />
          </li>
        ))}
      </ul>
    </AppShell>
  );
}

export function NotificationsScreen() {
  const [items, setItems] = useState<Notification[]>(demoNotifications);
  useEffect(() => {
    equityApi.notifications().then(setItems).catch(() => undefined);
  }, []);

  return (
    <AppShell title="Notifications" active="home" unread={items.filter((i) => !i.is_read).length}>
      <ul className="mt-3 space-y-3">
        {items.map((n) => (
          <li key={n.id} className="rounded-2xl border border-border bg-card p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-foreground">{n.title}</p>
              {!n.is_read ? <span className="size-2 rounded-full bg-primary" /> : null}
            </div>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{n.body}</p>
          </li>
        ))}
      </ul>
    </AppShell>
  );
}

const settingsGroups = [
  {
    heading: "Profile",
    items: [
      {
        icon: Bell,
        title: "Notifications",
        sub: "View and manage your notifications",
        href: "/notifications",
        badge: 9,
      },
      {
        icon: Gauge,
        title: "Transaction management",
        sub: "Limit or reverse transactions",
        href: "/settings",
      },
      { icon: Globe, title: "Change language", sub: "", href: "/settings" },
    ],
  },
  {
    heading: "Support",
    items: [
      {
        icon: MessageCircle,
        title: "Activate Chat Banking",
        sub: "Transact and more with Equity's virtual assistant",
        href: "/settings",
      },
      {
        icon: Mail,
        title: "Get in touch",
        sub: "Email, call or find us on social media",
        href: "/settings",
      },
      {
        icon: HelpCircle,
        title: "Guides and tours",
        sub: "What do you want to learn today?",
        href: "/settings",
      },
    ],
  },
  {
    heading: "Security",
    items: [
      {
        icon: ShieldCheck,
        title: "Security",
        sub: "Manage password, biometrics and security questions",
        href: "/settings",
      },
    ],
  },
  {
    heading: "About us",
    items: [
      {
        icon: Share2,
        title: "Recommend",
        sub: "Recommend Equity Mobile to a friend",
        href: "/settings",
      },
    ],
  },
];

export function SettingsScreen() {
  return (
    <AppShell title="Settings & more" active="settings">
      <div className="mt-2 rounded-2xl border border-border bg-card p-4">
        <div className="flex items-center gap-3">
          <span className="grid size-12 shrink-0 place-items-center rounded-full border border-primary/70 text-sm font-semibold text-primary">
            {profile.initials}
          </span>
          <span>
            <span className="block text-sm font-semibold text-foreground">{profile.fullName}</span>
            <span className="block text-xs text-muted-foreground">{profile.email}</span>
            <span className="block text-xs text-muted-foreground">{profile.phone}</span>
          </span>
        </div>
      </div>

      {settingsGroups.map((group) => (
        <div key={group.heading}>
          <h2 className="mb-3 mt-6 text-xl font-semibold text-foreground">{group.heading}</h2>
          <div className="space-y-3">
            {group.items.map((item) => {
              const Icon = item.icon;
              const badge = "badge" in item ? item.badge : undefined;
              return (
                <a
                  key={item.title}
                  href={item.href}
                  className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4"
                >
                  <span className="relative grid size-10 shrink-0 place-items-center rounded-full bg-secondary">
                    <Icon className="size-5 text-primary" strokeWidth={1.5} />
                    {badge ? (
                      <span className="absolute -right-1 -top-1 grid size-5 place-items-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                        {badge}
                      </span>
                    ) : null}
                  </span>
                  <span className="flex-1">
                    <span className="block text-sm font-semibold text-foreground">{item.title}</span>
                    {item.sub ? (
                      <span className="block text-xs text-muted-foreground">{item.sub}</span>
                    ) : null}
                  </span>
                  <ChevronRight className="size-5 text-primary" />
                </a>
              );
            })}
          </div>
        </div>
      ))}
    </AppShell>
  );
}
