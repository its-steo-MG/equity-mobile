import type { ReactNode } from "react";
import { Bell, QrCode, Layers, Settings } from "lucide-react";
import { profile } from "@/lib/equity-data";

type ShellProps = {
  title: string;
  children: ReactNode;
  active: "accounts" | "home" | "settings";
  showQr?: boolean | undefined;
  unread?: number | undefined;
};

export function Avatar() {
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
  unread = 0,
}: {
  title: string;
  showQr?: boolean | undefined;
  unread?: number | undefined;
}) {
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between gap-3 bg-background/90 px-4 pb-3 pt-5 backdrop-blur">
      <Avatar />
      <h1 className="flex-1 text-center text-base font-semibold text-foreground">{title}</h1>
      <div className="flex items-center gap-3">
        {showQr ? <QrCode className="size-6 text-foreground" strokeWidth={1.5} /> : null}
        <a
          href="/notifications"
          className="relative grid size-10 shrink-0 place-items-center rounded-full bg-card"
        >
          <Bell className="size-5 text-foreground" strokeWidth={1.5} />
          {unread > 0 ? (
            <span className="absolute -right-0.5 -top-0.5 grid size-5 place-items-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
              {unread}
            </span>
          ) : null}
        </a>
      </div>
    </header>
  );
}

function BottomNav({ active }: { active: ShellProps["active"] }) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 mx-auto flex max-w-md items-end justify-between bg-card/95 px-8 pb-3 pt-2 backdrop-blur">
      <a
        href="/accounts"
        className={`flex flex-1 flex-col items-center gap-1 text-[11px] ${
          active === "accounts" ? "text-primary" : "text-muted-foreground"
        }`}
      >
        <Layers className="size-6" strokeWidth={1.5} />
        Accounts &amp; Cards
      </a>
      <a
        href="/"
        className={`-mt-8 grid size-16 shrink-0 place-items-center rounded-full border-2 bg-background text-[9px] font-bold tracking-wide ${
          active === "home"
            ? "border-primary text-primary shadow-glow"
            : "border-muted-foreground/50 text-muted-foreground"
        }`}
      >
        EQUITY
      </a>
      <a
        href="/settings"
        className={`flex flex-1 flex-col items-center gap-1 text-[11px] ${
          active === "settings" ? "text-primary" : "text-muted-foreground"
        }`}
      >
        <Settings className="size-6" strokeWidth={1.5} />
        Settings
      </a>
    </nav>
  );
}

export function AppShell({ title, children, active, showQr, unread = 9 }: ShellProps) {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-background">
      <TopBar title={title} showQr={showQr} unread={unread} />
      <main className="flex-1 px-4 pb-32">{children}</main>
      <BottomNav active={active} />
    </div>
  );
}
