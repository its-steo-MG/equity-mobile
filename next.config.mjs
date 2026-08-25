import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  register: true,
  cacheOnFrontEndNav: true,
  reloadOnOnline: true,
  // No service worker in development — avoids stale-cache confusion.
  disable: process.env.NODE_ENV === "development",
  workboxOptions: {
    skipWaiting: true,
    // HTML navigations must never be cache-first.
    runtimeCaching: [
      {
        urlPattern: ({ request }) => request.mode === "navigate",
        handler: "NetworkFirst",
        options: { cacheName: "html-pages", networkTimeoutSeconds: 5 },
      },
      {
        urlPattern: /^\/_next\/static\/.*/,
        handler: "CacheFirst",
        options: { cacheName: "next-static" },
      },
      {
        urlPattern: ({ url }) => url.pathname.startsWith("/icons/"),
        handler: "CacheFirst",
        options: { cacheName: "icons" },
      },
    ],
  },
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Required for Next.js 16 (Turbopack is now default)
  // Empty object silences the "webpack config + no turbopack config" error
  turbopack: {},
};

export default withPWA(nextConfig);