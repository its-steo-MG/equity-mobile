"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Bell, Loader2, QrCode, Settings } from "lucide-react";
import { guardSession } from "@/lib/session";
import { AccountsCardsIcon, EquityLogo } from "@/components/equity/icons";
import { SideMenu } from "@/components/equity/sidebar";
import { SplashScreen } from "@/components/equity/splash";

import { useApi, useProfile } from "@/lib/use-equity";
import { equityApi } from "@/lib/equity-api";
import type { Notification } from "@/lib/equity-data";

type ShellProps = {
  title: string;
  children: ReactNode;
  active: "accounts" | "home" | "settings";
  showQr?: boolean | undefined;
  unread?: number | undefined;
  onRefresh?: (() => void) | undefined;
};

export function AppBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute -left-1/4 top-24 h-[420px] w-[150%] rotate-[-28deg] bg-foreground/[0.045]" />
      <div className="absolute -right-1/3 top-56 h-[420px] w-[150%] rotate-[28deg] bg-foreground/[0.05]" />
      <div className="absolute -left-1/4 bottom-10 h-[420px] w-[150%] rotate-[-24deg] bg-foreground/[0.035]" />
    </div>
  );
}

export function Avatar({ onClick }: { onClick?: (() => void) | undefined }) {
  const profile = useProfile();
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Open menu"
      className="grid size-10 shrink-0 place-items-center rounded-full border border-primary/70 text-sm font-semibold text-primary"
    >
      {profile.initials}
    </button>
  );
}


export function TopBar({
  title,
  showQr = false,
  unread,
  onAvatarClick,
}: {
  title: string;
  showQr?: boolean | undefined;
  unread?: number | undefined;
  onAvatarClick?: (() => void) | undefined;
}) {
  const notif = useApi<Notification[]>(() => equityApi.notifications());
  const count = unread ?? (notif.data ?? []).filter((n) => !n.is_read).length;

  return (
    <header
      className="sticky top-0 z-20 flex items-center justify-between gap-3 bg-transparent px-4 pb-3 pt-5 backdrop-blur"
      style={{ paddingTop: "calc(env(safe-area-inset-top, 0px) + 1.25rem)" }}
    >
      <Avatar onClick={onAvatarClick} />

      <h1 className="flex-1 text-center text-base font-semibold text-foreground">{title}</h1>
      <div className="flex items-center gap-3">
        {showQr ? <QrCode className="size-6 text-foreground" strokeWidth={1.5} /> : null}
        <a
          href="/notifications"
          className="relative grid size-10 shrink-0 place-items-center rounded-full bg-card"
        >
          <Bell className="size-5 text-foreground" strokeWidth={1.5} />
          {count > 0 ? (
            <span className="absolute -right-0.5 -top-0.5 grid size-5 place-items-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
              {count}
            </span>
          ) : null}
        </a>
      </div>
    </header>
  );
}

function BottomNav({ active }: { active: ShellProps["active"] }) {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-30 mx-auto flex max-w-md items-end justify-between bg-app-canvas/95 px-8 pb-3 pt-2 backdrop-blur"
      style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 0.75rem)" }}
    >
      <a
        href="/accounts"
        className={`flex flex-1 flex-col items-center gap-1 text-[11px] ${
          active === "accounts" ? "text-primary" : "text-muted-foreground"
        }`}
      >
        <AccountsCardsIcon className="size-8" />
        Accounts &amp; Cards
      </a>
      <a
        href="/"
        className={`-mt-8 grid size-16 shrink-0 place-items-center rounded-full border-2 bg-app-canvas ${
          active === "home"
            ? "border-primary text-primary shadow-glow"
            : "border-primary/70 text-primary"
        }`}
      >
        <EquityLogo className="w-9" />
      </a>
      <a
        href="/settings"
        className={`flex flex-1 flex-col items-center gap-1 text-[11px] ${
          active === "settings" ? "text-primary" : "text-muted-foreground"
        }`}
      >
        <Settings className="size-7" strokeWidth={1.5} />
        Settings
      </a>
    </nav>
  );
}


export function AppShell({ title, children, active, showQr, unread, onRefresh }: ShellProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [pull, setPull] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const startY = useRef<number | null>(null);

  // Ask for the password again on a fresh launch or after 5 idle minutes.
  useEffect(() => {
    return guardSession(() => {
      window.location.href = "/login";
    });
  }, []);

  const runRefresh = () => {
    if (refreshing) return;
    setRefreshing(true);
    onRefresh?.();
    window.setTimeout(() => setRefreshing(false), 1100);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    startY.current = window.scrollY <= 2 ? (e.touches[0]?.clientY ?? null) : null;
  };
  const onTouchMove = (e: React.TouchEvent) => {
    if (startY.current === null || refreshing) return;
    const delta = (e.touches[0]?.clientY ?? 0) - startY.current;
    if (delta > 0) setPull(Math.min(delta * 0.5, 80));
  };
  const onTouchEnd = () => {
    if (pull > 45) runRefresh();
    setPull(0);
    startY.current = null;
  };

  const indicator = refreshing || pull > 6;

  return (
    <div
      className="relative mx-auto flex min-h-screen w-full max-w-md flex-col overflow-hidden bg-app-canvas"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <SplashScreen />
      <AppBackground />
      <TopBar
        title={title}
        showQr={showQr}
        unread={unread}
        onAvatarClick={() => setMenuOpen(true)}
      />
      {onRefresh ? (
        <div
          className="pointer-events-none relative z-20 flex items-center justify-center overflow-hidden transition-[height]"
          style={{ height: indicator ? `${Math.max(pull, refreshing ? 42 : 0)}px` : "0px" }}
        >
          <Loader2
            className={`size-6 text-primary ${refreshing ? "animate-spin" : ""}`}
            style={{ transform: `rotate(${pull * 4}deg)` }}
            strokeWidth={2}
          />
        </div>
      ) : null}
      <main
        className="relative flex-1 px-4 pb-32"
        style={{ transform: `translateY(${refreshing ? 0 : pull * 0.15}px)` }}
      >
        {children}
      </main>
      <BottomNav active={active} />
      <SideMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </div>
  );
}

/** Desktop / no-touch refresh helper button. */
export function RefreshButton({ onClick, busy }: { onClick: () => void; busy?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mx-auto mt-2 flex items-center gap-2 rounded-full bg-card px-4 py-1.5 text-xs text-muted-foreground"
    >
      <Loader2 className={`size-3.5 ${busy ? "animate-spin" : ""}`} /> Refresh
    </button>
  );
}

