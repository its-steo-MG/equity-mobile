"use client";

export function AccountsCardsIcon({ className = "size-7" }: { className?: string }) {
  return (
    <svg viewBox="0 0 34 34" fill="none" className={className} aria-hidden="true">
      {/* roof chevron with left up-tick */}
      <path
        d="M4 8V15.5L17 3.5 31 15.8"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
      {/* coin stack */}
      <ellipse cx="17" cy="16.5" rx="8.6" ry="3.8" stroke="currentColor" strokeWidth="2.2" />
      <path d="M8.4 16.5v11.6c0 2.1 3.9 3.8 8.6 3.8s8.6-1.7 8.6-3.8V16.5" stroke="currentColor" strokeWidth="2.2" />
      <path d="M8.4 21.8c0 2.1 3.9 3.8 8.6 3.8s8.6-1.7 8.6-3.8" stroke="currentColor" strokeWidth="2.2" />
      <path d="M8.4 27c0 2.1 3.9 3.8 8.6 3.8s8.6-1.7 8.6-3.8" stroke="currentColor" strokeWidth="2.2" />
    </svg>
  );
}

export function EquityLogo({ className = "w-10" }: { className?: string }) {
  return (
    <svg viewBox="18 10 132 82" fill="none" className={className} aria-hidden="true">
      <path
        d="M77 16 142 65 109 65 77 42 47 65 25 65 25 36 43 36 43 44Z"
        fill="currentColor"
      />
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
  );
}

type IconProps = { className?: string };

/** Calculator and payment card traced from the Equity service icon. */
export function TransactIcon({ className = "size-7" }: IconProps) {
  return (
    <svg viewBox="0 0 40 40" fill="none" className={className} aria-hidden="true">
      <rect x="5" y="5" width="23" height="30" rx="1.8" stroke="currentColor" strokeWidth="2.5" />
      <rect x="8.5" y="8.5" width="16" height="7" stroke="currentColor" strokeWidth="2.5" />
      <path d="M28 11h6.5v21H28" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M28 17h6.5" stroke="currentColor" strokeWidth="2.5" />
      <g fill="currentColor">
        <rect x="9" y="19" width="3.8" height="3.8" rx=".3" />
        <rect x="15" y="19" width="3.8" height="3.8" rx=".3" />
        <rect x="21" y="19" width="3.8" height="3.8" rx=".3" />
        <rect x="9" y="25" width="3.8" height="3.8" rx=".3" />
        <rect x="15" y="25" width="3.8" height="3.8" rx=".3" />
        <rect x="21" y="25" width="3.8" height="3.8" rx=".3" />
        <rect x="9" y="31" width="3.8" height="3.8" rx=".3" />
        <rect x="15" y="31" width="3.8" height="3.8" rx=".3" />
        <rect x="21" y="31" width="3.8" height="3.8" rx=".3" />
      </g>
    </svg>
  );
}

/** Person above an open hand traced from the Equity service icon. */
export function BorrowIcon({ className = "size-7" }: IconProps) {
  return (
    <svg viewBox="0 0 40 40" fill="none" className={className} aria-hidden="true">
      <circle cx="20" cy="10" r="7" stroke="currentColor" strokeWidth="2.6" />
      <path
        d="M4.5 25h12.8c3.3 0 5.4 1.4 5.4 3.8H15"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.5 24.5v8.2l11.8 4.2c1.4.5 2.9.3 4.1-.4l14.8-8.8c-1.4-2.2-3.8-2.7-6-1.5l-6.5 3.5"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Sprout growing from stacked coins traced from the Equity service icon. */
export function SaveIcon({ className = "size-7" }: IconProps) {
  return (
    <svg viewBox="0 0 40 40" fill="none" className={className} aria-hidden="true">
      <path d="M20 20V7" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
      <path d="M20 11c-5.5 0-8-2.8-8.5-7 5.2-.3 8.2 2.1 8.5 7Z" stroke="currentColor" strokeWidth="2.6" strokeLinejoin="round" />
      <path d="M20 8.5c.8-5 4.1-7 9.7-6.4-.7 4.4-3.7 6.7-9.7 6.4Z" stroke="currentColor" strokeWidth="2.6" strokeLinejoin="round" />
      <ellipse cx="12.5" cy="23" rx="9.5" ry="5" stroke="currentColor" strokeWidth="2.6" />
      <path d="M3 23v7c0 2.8 4.3 5 9.5 5s9.5-2.2 9.5-5v-7" stroke="currentColor" strokeWidth="2.6" />
      <path d="M3 29.5c0 2.8 4.3 5 9.5 5s9.5-2.2 9.5-5" stroke="currentColor" strokeWidth="2.6" />
      <ellipse cx="27.5" cy="23" rx="9.5" ry="5" stroke="currentColor" strokeWidth="2.6" />
      <path d="M18 23v7c0 2.8 4.3 5 9.5 5s9.5-2.2 9.5-5v-7" stroke="currentColor" strokeWidth="2.6" />
      <path d="M18 29.5c0 2.8 4.3 5 9.5 5s9.5-2.2 9.5-5" stroke="currentColor" strokeWidth="2.6" />
    </svg>
  );
}

/** Segmented umbrella traced from the Equity service icon. */
export function InsureIcon({ className = "size-7" }: IconProps) {
  return (
    <svg viewBox="0 0 40 40" fill="none" className={className} aria-hidden="true">
      <path
        d="M4 18C4.7 8.7 11.4 3 20 3s15.3 5.7 16 15H4Z"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinejoin="round"
      />
      <path d="M11.5 18C12 9.4 15.5 3.4 20 3M28.5 18C28 9.4 24.5 3.4 20 3M20 3v29.5c0 3 1.6 4.5 4.1 4.5 2.2 0 3.9-1.5 3.9-4" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
