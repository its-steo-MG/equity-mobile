"use client";

import { ChevronRight, Mail, MessageCircle, Power, Share2, SunMoon } from "lucide-react";
import { equityApi } from "@/lib/equity-api";
import { useProfile } from "@/lib/use-equity";
import { useTheme } from "@/lib/theme";

const links = [
  { icon: MessageCircle, label: "Activate Chat Banking", href: "/settings" },
  { icon: Share2, label: "Recommend", href: "/settings" },
  { icon: Mail, label: "Get in touch", href: "/settings" },
];

/** Left slide-in menu opened from the profile initials in the header. */
export function SideMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const profile = useProfile();
  const { isDark, toggle } = useTheme();

  return (
    <>
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/60 transition-opacity duration-300 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[82%] max-w-[330px] flex-col bg-background shadow-2xl transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ paddingTop: "calc(env(safe-area-inset-top, 0px) + 1rem)" }}
      >
        <div className="mx-3 flex items-center gap-3 rounded-lg bg-card p-4">
          <span className="grid size-11 shrink-0 place-items-center rounded-full border border-primary/70 text-sm font-semibold text-primary">
            {profile.initials}
          </span>
          <span className="min-w-0">
            <span className="block truncate text-sm font-semibold text-foreground">
              {profile.displayName || "Not signed in"}
            </span>
            {profile.email ? (
              <span className="block truncate text-xs text-muted-foreground">{profile.email}</span>
            ) : null}
          </span>
        </div>

        <div className="mt-4 flex-1 overflow-y-auto">
          {links.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.label}
                href={item.href}
                onClick={onClose}
                className="flex items-center gap-3 px-4 py-4"
              >
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-secondary">
                  <Icon className="size-5 text-primary" strokeWidth={1.5} />
                </span>
                <span className="flex-1 text-sm text-foreground">{item.label}</span>
                <ChevronRight className="size-5 text-muted-foreground" />
              </a>
            );
          })}

          <div className="flex items-center gap-3 px-4 py-4">
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-secondary">
              <SunMoon className="size-5 text-primary" strokeWidth={1.5} />
            </span>
            <span className="flex-1 text-sm text-foreground">Dark mode</span>
            <button
              type="button"
              role="switch"
              aria-checked={isDark}
              aria-label="Toggle dark mode"
              onClick={toggle}
              className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
                isDark ? "bg-primary" : "bg-secondary"
              }`}
            >
              <span
                className={`absolute top-0.5 size-5 rounded-full bg-white shadow transition-all ${
                  isDark ? "left-[22px]" : "left-0.5"
                }`}
              />
            </button>
          </div>

          <button
            type="button"
            onClick={() => {
              equityApi.logout();
              window.location.href = "/login";
            }}
            className="flex w-full items-center gap-3 px-4 py-4 text-left"
          >
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-secondary">
              <Power className="size-5 text-primary" strokeWidth={1.5} />
            </span>
            <span className="flex-1 text-sm text-foreground">Sign out</span>
            <ChevronRight className="size-5 text-muted-foreground" />
          </button>
        </div>

        <p
          className="px-4 text-[11px] text-muted-foreground"
          style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 1rem)" }}
        >
          Version 380
        </p>
      </aside>
    </>
  );
}
