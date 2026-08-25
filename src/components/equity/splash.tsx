"use client";

import { useEffect, useState } from "react";
import { isStandalone } from "@/lib/session";

const SEEN_KEY = "equity.splash.seen";

/**
 * Opening animation from the Equity Mobile app:
 * a salmon disc bursts open with radiating rays, then the EQUITY
 * roof logo fades in before the app is revealed.
 */
export function SplashScreen({ once = true }: { once?: boolean }) {
  // Only plays when the app is launched from the installed PWA icon.
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    if (!isStandalone()) return;
    if (once && sessionStorage.getItem(SEEN_KEY)) return;
    sessionStorage.setItem(SEEN_KEY, "1");
    setVisible(true);
    const out = window.setTimeout(() => setLeaving(true), 2100);
    const done = window.setTimeout(() => setVisible(false), 2650);
    return () => {
      window.clearTimeout(out);
      window.clearTimeout(done);
    };
  }, [once]);

  if (!visible) return null;


  return (
    <div
      className={`fixed inset-0 z-[100] grid place-items-center overflow-hidden bg-black ${
        leaving ? "eq-splash-out" : ""
      }`}
      aria-hidden="true"
    >
      <div className="relative grid size-full place-items-center">
        {/* radiating rays */}
        <div className="eq-rays absolute size-[520px]">
          {Array.from({ length: 12 }).map((_, i) => (
            <span
              key={i}
              className="absolute left-1/2 top-1/2 h-[2px] w-[190px] origin-left rounded-full bg-primary/70"
              style={{ transform: `rotate(${i * 30}deg) translateX(120px)` }}
            />
          ))}
        </div>

        {/* burst disc */}
        <div className="eq-burst absolute size-[300px] rounded-full bg-primary/85" />

        {/* logo */}
        <div className="eq-logo relative">
          <svg viewBox="18 10 132 82" className="w-40" fill="none">
            <path d="M77 16 142 65 109 65 77 42 47 65 25 65 25 36 43 36 43 44Z" fill="#ffffff" />
            <text
              x="84"
              y="90"
              textAnchor="middle"
              fontSize="30"
              fontWeight="900"
              letterSpacing="0.5"
              fill="#ffffff"
              fontFamily="Arial Black, Arial, Helvetica, sans-serif"
            >
              EQUITY
            </text>
          </svg>
        </div>
      </div>
    </div>
  );
}
