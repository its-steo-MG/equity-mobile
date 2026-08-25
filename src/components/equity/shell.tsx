"use client";

import type { ReactNode } from "react";
import { Bell, QrCode, Settings } from "lucide-react";
import { AccountsCardsIcon, EquityLogo } from "@/components/equity/icons";

import { useApi, useProfile } from "@/lib/use-equity";
import { equityApi } from "@/lib/equity-api";
import type { Notification } from "@/lib/equity-data";

type ShellProps = {
  title: string;
  children: ReactNode;
  active: "accounts" | "home" | "settings";
  showQr?: boolean | undefined;
  unread?: number | undefined;
};

export function AppBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute -left-1/4 top-24 h-[420px] w-[150%] rotate-[-28deg] bg-white/[0.04]" />
      <div className="absolute -right-1/3 top-56 h-[420px] w-[150%] rotate-[28deg] bg-white/[0.05]" />
      <div className="absolute -left-1/4 bottom-10 h-[420px] w-[150%] rotate-[-24deg] bg-white/[0.03]" />
    </div>
  );
}

export function Avatar() {
  const profile = useProfile();
  return (
    <a
      href="/settings"
      className="grid size-10 shrink-0 place-items-center rounded-full border border-primary/70 text-sm font-semibold text-primary"
    >
      {profile.initials}
    </a>
  );
}

export function TopBar({
  title,
  showQr = false,
  unread,
}: {
  title: string;
  showQr?: boolean | undefined;
  unread?: number | undefined;
}) {
  const notif = useApi<Notification[]>(() => equityApi.notifications());
  const count = unread ?? (notif.data ?? []).filter((n) => !n.is_read).length;

  return (
    <header
      className="sticky top-0 z-20 flex items-center justify-between gap-3 bg-transparent px-4 pb-3 pt-5 backdrop-blur"
      style={{ paddingTop: "calc(env(safe-area-inset-top, 0px) + 1.25rem)" }}
    >
      <Avatar />
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


export function AppShell({ title, children, active, showQr, unread }: ShellProps) {
  return (
    <div className="relative mx-auto flex min-h-screen w-full max-w-md flex-col overflow-hidden bg-app-canvas">
      <AppBackground />
      <TopBar title={title} showQr={showQr} unread={unread} />
      <main className="relative flex-1 px-4 pb-32">{children}</main>
      <BottomNav active={active} />
    </div>
  );
}
