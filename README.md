# Equity Mobile — Next.js PWA frontend

Standalone frontend (separate from the Django backend) that clones the Equity
Mobile app UI: dark theme, Equity red, bottom navigation, account cards,
balance card, send money, notifications and settings.

## Stack

- Next.js 15 (App Router) + React 19 + TypeScript
- Tailwind CSS v4 (design tokens in `src/app/globals.css`)
- lucide-react icons
- PWA via `@ducanh2912/next-pwa` (installable, offline-ready, NetworkFirst HTML)

## Run

```bash
npm install
cp .env.example .env.local   # point it at your Django API
npm run dev                  # http://localhost:3000
npm run build && npm start   # PWA/service worker is active in production only
```

## Backend wiring

Set `NEXT_PUBLIC_EQUITY_API_URL` to where `equity/urls.py` is mounted,
e.g. `http://127.0.0.1:8000/api/equity`. The client in `src/lib/equity-api.ts`
calls:

| Screen        | Endpoint            |
| ------------- | ------------------- |
| Home          | `GET /home/`        |
| Accounts      | `GET /accounts/`    |
| Transactions  | `GET /transactions/`|
| Notifications | `GET /notifications/` |

Auth: the client sends `Authorization: Token <token>` when
`localStorage.equity_token` is set. If no API URL is configured the UI renders
bundled demo data, so the app is viewable before the backend is up.

Enable CORS on Django (`django-cors-headers`) for the frontend origin.

## PWA

- `public/manifest.webmanifest` — name, icons, standalone display, theme color
- Service worker is generated at build time into `public/sw.js` and disabled in dev
- Install: open the production build on a phone → "Add to Home Screen"

## Structure

```
src/app/            App Router pages (/, /accounts, /send, /notifications, /settings)
src/components/equity/  Shell (top bar, bottom nav), cards, screens
src/lib/            API client, types, demo data, helpers
```
