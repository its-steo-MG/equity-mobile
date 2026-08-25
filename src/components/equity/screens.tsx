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
  MessageSquare,
  Mail,
  HelpCircle,
  ShieldCheck,
  Share2,
  Eye,
  EyeOff,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { AppBackground, AppShell } from "./shell";
import {
  AccountCard,
  AccountsSummary,
  BalanceCard,
  ForexCalculatorCard,
  LinkExistingCard,
  QuickActions,
  ServiceTiles,
} from "./cards";
import { equityApi, auth, apiBase } from "@/lib/equity-api";
import { useApi, useProfile } from "@/lib/use-equity";
import {
  formatWhen,
  initialsOf,
  money,
  nameFromGreeting,
  type HomePayload,
  type Notification,
  type Transaction,
} from "@/lib/equity-data";

function StateBlock({
  loading,
  error,
  unauthenticated,
  empty,
  emptyText,
  onRetry,
}: {
  loading: boolean;
  error: string | null;
  unauthenticated: boolean;
  empty?: boolean;
  emptyText?: string;
  onRetry?: () => void;
}) {
  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 py-10 text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin" /> Loading your data…
      </div>
    );
  }
  if (unauthenticated) {
    return (
      <div className="rounded-2xl border border-border bg-card p-5 text-center">
        <p className="text-sm text-foreground">Sign in to load your Equity data</p>
        <a
          href="/login"
          className="mt-4 inline-block rounded-lg bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground"
        >
          Sign in
        </a>
      </div>
    );
  }
  if (error) {
    return (
      <div className="rounded-2xl border border-border bg-card p-5 text-center">
        <p className="text-sm text-foreground">{error}</p>
        {onRetry ? (
          <button
            onClick={onRetry}
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-secondary px-5 py-2 text-sm text-secondary-foreground"
          >
            <RefreshCw className="size-4" /> Try again
          </button>
        ) : null}
      </div>
    );
  }
  if (empty) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        {emptyText ?? "Nothing to show yet"}
      </p>
    );
  }
  return null;
}

export function HomeScreen() {
  const home = useApi<HomePayload>(() => equityApi.home());
  const data = home.data;
  const primary = data?.primary_account ?? data?.accounts[0] ?? null;

  return (
    <AppShell title="Home" active="home" showQr>
      {data ? (
        <p className="py-2 text-center text-lg text-foreground">
          {data.greeting.split(",")[0]},{" "}
          <span className="font-semibold">
            {(primary?.account_name?.trim().split(/\s+/)[0] ||
              nameFromGreeting(data.greeting).split(/\s+/)[0]) ??
              ""}
          </span>
        </p>
      ) : null}
      <QuickActions />
      {data && primary ? (
        <BalanceCard balance={primary.balance} loanLimit={primary.loan_limit} />
      ) : null}
      <ServiceTiles />
      <h2 className="mb-3 mt-6 text-xl font-semibold text-foreground">My accounts</h2>
      <StateBlock
        loading={home.loading}
        error={home.error}
        unauthenticated={home.unauthenticated}
        empty={Boolean(data && data.accounts.length === 0)}
        emptyText="No Equity accounts on your profile yet"
        onRetry={home.reload}
      />
      <div className="space-y-3">
        {(data?.accounts ?? []).map((account) => (
          <AccountCard key={account.id} account={account} />
        ))}
      </div>
      <ForexCalculatorCard />
    </AppShell>
  );
}

export function TransactionList() {
  const tx = useApi<Transaction[]>(() => equityApi.transactions());
  const items = tx.data ?? [];

  return (
    <section className="mt-6">
      <h2 className="mb-3 text-xl font-semibold text-foreground">Recent activity</h2>
      <StateBlock
        loading={tx.loading}
        error={tx.error}
        unauthenticated={tx.unauthenticated}
        empty={Boolean(tx.data && items.length === 0)}
        emptyText="No transactions yet"
        onRetry={tx.reload}
      />
      {items.length > 0 ? (
        <ul className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
          {items.map((t) => (
            <li key={t.id} className="flex items-start gap-3 p-4">
              <span className="flex-1">
                <span className="block text-sm text-foreground">{t.description}</span>
                <span className="mt-1 block text-[11px] text-muted-foreground">
                  Ref. {t.reference} • {formatWhen(t.created_at)}
                </span>
              </span>
              <span
                className={`shrink-0 text-sm font-semibold ${
                  t.amount < 0 ? "text-muted-foreground" : "text-primary"
                }`}
              >
                {t.amount < 0 ? "-" : "+"}
                {money(Math.abs(t.amount))}
              </span>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}

export function AccountsScreen() {
  const home = useApi<HomePayload>(() => equityApi.home());
  const data = home.data;

  return (
    <AppShell title="Accounts" active="accounts">
      <AccountsSummary total={data?.total_balance ?? 0} />
      <h2 className="mb-3 mt-6 text-xl font-semibold text-foreground">My accounts</h2>
      <StateBlock
        loading={home.loading}
        error={home.error}
        unauthenticated={home.unauthenticated}
        empty={Boolean(data && data.accounts.length === 0)}
        emptyText="No Equity accounts on your profile yet"
        onRetry={home.reload}
      />
      <div className="space-y-3">
        {(data?.accounts ?? []).map((account) => (
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
      <p className="mt-1 text-sm text-muted-foreground">No recent recipients</p>
    </AppShell>
  );
}

export function NotificationsScreen() {
  const notif = useApi<Notification[]>(() => equityApi.notifications());
  const [items, setItems] = useState<Notification[]>([]);

  useEffect(() => {
    if (notif.data) setItems(notif.data);
  }, [notif.data]);

  const markRead = (id: number) => {
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)));
    equityApi.markNotificationRead(id).catch(() => undefined);
  };

  return (
    <AppShell title="Notifications" active="home" unread={items.filter((i) => !i.is_read).length}>
      <StateBlock
        loading={notif.loading}
        error={notif.error}
        unauthenticated={notif.unauthenticated}
        empty={Boolean(notif.data && items.length === 0)}
        emptyText="No notifications yet"
        onRetry={notif.reload}
      />
      <ul className="mt-3 space-y-3">
        {items.map((n) => (
          <li
            key={n.id}
            onClick={() => !n.is_read && markRead(n.id)}
            className="rounded-2xl border border-border bg-card p-4"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-foreground">{n.title}</p>
              {!n.is_read ? <span className="size-2 rounded-full bg-primary" /> : null}
            </div>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{n.body}</p>
            <p className="mt-2 text-[11px] text-muted-foreground">{formatWhen(n.created_at)}</p>
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
      },
      {
        icon: Gauge,
        title: "Transaction management",
        sub: "Limit or reverse transactions",
        href: "/settings",
      },
      { icon: Globe, title: "Change language", sub: "", href: "/settings" },
      {
        icon: ShieldCheck,
        title: "Sign in / Sign out",
        sub: "Connect this app to your Equity account",
        href: "/login",
      },
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
  const profile = useProfile();
  const notif = useApi<Notification[]>(() => equityApi.notifications());
  const unread = (notif.data ?? []).filter((n) => !n.is_read).length;

  return (
    <AppShell title="Settings & more" active="settings">
      <div className="mt-2 rounded-2xl border border-border bg-card p-4">
        <div className="flex items-center gap-3">
          <span className="grid size-12 shrink-0 place-items-center rounded-full border border-primary/70 text-sm font-semibold text-primary">
            {profile.initials}
          </span>
          <span>
            <span className="block text-sm font-semibold text-foreground">
              {profile.fullName || profile.username || "Not signed in"}
            </span>
            {profile.email ? (
              <span className="block text-xs text-muted-foreground">{profile.email}</span>
            ) : null}
            {profile.phone ? (
              <span className="block text-xs text-muted-foreground">{profile.phone}</span>
            ) : null}
          </span>
        </div>
      </div>

      {settingsGroups.map((group) => (
        <div key={group.heading}>
          <h2 className="mb-3 mt-6 text-xl font-semibold text-foreground">{group.heading}</h2>
          <div className="space-y-3">
            {group.items.map((item) => {
              const Icon = item.icon;
              const badge = item.title === "Notifications" && unread > 0 ? unread : undefined;
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

export function LoginScreen() {
  const stored = useProfile();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showUser, setShowUser] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    setSignedIn(auth.isSignedIn());
    const saved = auth.profile();
    if (saved?.email || saved?.username) {
      setUsername(saved.email || saved.username);
      setShowUser(false);
    }
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await equityApi.login(username.trim(), password);
      setSignedIn(true);
      window.location.href = "/";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign in failed");
    } finally {
      setBusy(false);
    }
  };

  if (signedIn) {
    return (
      <AppShell title="Account" active="settings">
        <p className="mt-6 text-sm text-foreground">You are signed in to your Equity account.</p>
        <p className="mt-1 text-xs text-muted-foreground">Connected to {apiBase()}</p>
        <button
          onClick={() => {
            equityApi.logout();
            setSignedIn(false);
            setPassword("");
          }}
          className="mt-6 w-full rounded-lg bg-primary py-3 text-sm font-semibold text-primary-foreground"
        >
          Sign out
        </button>
      </AppShell>
    );
  }

  const displayName = stored.fullName || stored.username;
  const initials = displayName ? initialsOf(displayName) : "EQ";

  return (
    <div className="relative mx-auto flex min-h-screen w-full max-w-md flex-col overflow-hidden bg-app-canvas">
      <AppBackground />

      <header className="relative flex items-center justify-between px-5 pb-2 pt-6">
        <span className="w-6" />
        <h1 className="text-base font-semibold text-white">Welcome back</h1>
        <MessageSquare className="size-6 text-white" strokeWidth={1.5} />
      </header>

      <div className="relative flex flex-1 flex-col px-8">
        <div className="mt-16 flex flex-col items-center">
          <span className="grid size-[76px] place-items-center rounded-full border-2 border-primary bg-black/40 text-lg font-semibold text-primary">
            {initials}
          </span>
          <p className="mt-5 text-center text-2xl font-semibold text-white">
            {displayName ? `Welcome back, ${displayName.split(" ")[0]}` : "Sign in to Equity"}
          </p>
        </div>

        <form onSubmit={submit} className="mt-16 flex flex-1 flex-col">
          {showUser ? (
            <input
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Email or username"
              className="mb-8 w-full border-b border-white/40 bg-transparent pb-2 text-base text-white outline-none placeholder:text-white/60"
            />
          ) : null}

          <label className="text-base text-white/70" htmlFor="password">
            Password
          </label>
          <div className="mt-6 flex items-center gap-3 border-b border-white/40 pb-2">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="flex-1 bg-transparent text-base text-white outline-none"
            />
            <button
              type="button"
              aria-label={showPassword ? "Hide password" : "Show password"}
              onClick={() => setShowPassword((v) => !v)}
            >
              {showPassword ? (
                <EyeOff className="size-6 text-white/80" strokeWidth={1.5} />
              ) : (
                <Eye className="size-6 text-white/80" strokeWidth={1.5} />
              )}
            </button>
          </div>

          <button type="button" className="mt-8 text-base font-medium text-primary">
            Forgot your password?
          </button>

          {error ? <p className="mt-4 text-center text-xs text-primary">{error}</p> : null}

          {!showUser ? (
            <button
              type="button"
              onClick={() => setShowUser(true)}
              className="mt-4 text-center text-xs text-white/60"
            >
              Sign in with another account
            </button>
          ) : null}

          <button
            type="submit"
            disabled={busy || !password || !username}
            className="mb-8 mt-auto w-full rounded-lg bg-white/25 py-4 text-base text-white/70 enabled:bg-primary enabled:font-semibold enabled:text-primary-foreground disabled:cursor-not-allowed"
          >
            {busy ? "Signing in…" : "Let me in"}
          </button>
        </form>
      </div>
    </div>
  );
}
