import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Equity Mobile",
  description: "Mobile banking: balances, transfers, airtime and account management.",
  manifest: "/manifest.webmanifest",
  applicationName: "Equity Mobile",
  appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: "Equity" },
  icons: { icon: "/favicon.png", apple: "/icons/icon-192.png" },
  openGraph: {
    title: "Equity Mobile",
    description: "Mobile banking: balances, transfers, airtime and account management.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#c8102e",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
