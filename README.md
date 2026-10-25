# Videoflix Frontend

> **This is the frontend repository.** The REST API lives in
> **[lvfranek/videoflix-backend](https://github.com/lvfranek/videoflix-backend)** (Django, DRF, HLS).

Web app for **Videoflix**, a small Netflix-style streaming platform. Register with your email, activate your account via the link in the activation email, then browse videos by category and stream them in 480p, 720p or 1080p.

**Live demo:** [videoflix.franekkaminski.dev](https://videoflix.franekkaminski.dev)
Demo login: `demo@franekkaminski.dev` / `Testpasswort123!` (already activated, no registration needed)

## Table of Contents

- [Tech Stack](#tech-stack)
- [Features](#features)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Scripts](#scripts)
- [Project Structure](#project-structure)
- [Authentication](#authentication)
- [Video Streaming](#video-streaming)
- [Saved Data in the Browser](#saved-data-in-the-browser)
- [Deployment](#deployment)
- [License](#license)

## Tech Stack

- `React` 19 with `TypeScript`
- `Vite` as dev server and build tool
- `React Router` for client-side routing, the video page is lazy-loaded
- `hls.js` for HLS streaming (native HLS on Safari and iOS)
- `localStorage` for continue watching and my list, stored per user
- CSS Modules with design tokens as CSS custom properties (no UI framework)
- `Oxlint` for linting
- Self-hosted font via `@fontsource` (Inter)

## Features

- Start page with a quick sign-up field that pre-fills the registration form
- Registration with email activation, login, logout and password reset by email
- Client-side validation and readable messages for every backend error
- Hero with the newest video and a muted 480p preview that fades in over the thumbnail
- Rows for "Weiterschauen", "Meine Liste", "Neu auf Videoflix" (last 5 days) and every category, with scroll arrows and faded edges
- **Custom video player**: play/pause, seek bar with buffered range, ±10 s, volume, quality menu (480p / 720p / 1080p, keeps the position), fullscreen, auto-hiding controls and YouTube-style shortcuts (`Space`/`K`, `←`/`→`, `↑`/`↓`, `F`, `M`, `Esc`)
- **Continue watching**: the playback position is saved per user, started videos get a progress bar and resume where they stopped
- **My list**: save videos with a +/check button
- **Live search** in the header over title, description and category, kept in the URL (`?q=`)
- **Info modal** (native `<dialog>`) with details, play / my list buttons and more videos from the same category
- Loading, empty and error states
- Imprint and privacy policy
- Responsive down to phone width, keyboard accessible, reduced-motion support

## Getting Started

Requirements: Node.js 20.19 or newer and a running [Videoflix backend](https://github.com/lvfranek/videoflix-backend).

```bash
git clone https://github.com/lvfranek/videoflix-frontend.git
cd videoflix-frontend
npm install
npm run dev
```

Open **http://127.0.0.1:5500**. The dev server runs on `127.0.0.1:5500` on purpose: the backend allows CORS requests from this origin and uses it for the links in its emails. Use `127.0.0.1`, not `localhost`, otherwise the auth cookies are not sent.

## Environment Variables

| Variable | Description |
| --- | --- |
| `VITE_API_BASE_URL` | Base URL of the API, with trailing slash |

Vite picks the file by mode, so nothing has to be switched by hand:

- `.env.development` (`npm run dev`): `http://127.0.0.1:8000/api/`
- `.env.production` (`npm run build`): `https://api.videoflix.franekkaminski.dev/api/`

Create a `.env.local` to override the value on your machine.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Type-check and build to `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run Oxlint |

## Project Structure

```
src/
├── api/           # fetch wrapper with token refresh, auth and video endpoints
├── components/    # Layout, AuthCard, Field, Hero, VideoRow, VideoCard,
│                  # VideoPlayer, VideoInfoModal, SearchBox, icons
├── lib/           # validation, form hook, categories and search, HLS hook,
│                  # watch progress and my list (localStorage)
├── pages/         # one component per route
├── toast/         # toast notifications (context + provider)
├── App.tsx        # routes
├── index.css      # design tokens, base styles, buttons
└── main.tsx       # entry point
```

| Route | Page |
| --- | --- |
| `/` | Start page with quick sign-up |
| `/register`, `/login`, `/forgot-password` | Authentication |
| `/pages/auth/activate.html` | Account activation (link from the email) |
| `/pages/auth/confirm_password.html` | New password (link from the email) |
| `/videos` | Hero, rows, info modal and player; `/videos?q=...` shows search results |
| `/imprint`, `/privacy` | Legal pages |

The two `/pages/auth/...html` paths match the links the backend puts into its emails, so the backend works unchanged.

## Authentication

The backend sets the JWT access token and refresh token as **HttpOnly cookies**. The frontend never reads or stores tokens; every request is sent with `credentials: "include"`. When a protected request returns `401` or `403`, `apiFetch` calls `token/refresh/` once and retries. If that fails too, the user is redirected to `/login`.

## Video Streaming

Videos are streamed as HLS from `video/<id>/<resolution>/index.m3u8`. `useHls` uses `hls.js` with `withCredentials`, so the auth cookie is sent with every playlist and segment request. Browsers with native HLS support (Safari, iOS) play the playlist directly. When the quality is switched, the player remembers the current time and continues there.

## Saved Data in the Browser

The backend has no endpoints for watch history or a watchlist, so both live in `localStorage` under a key that contains the user id from the login response (`videoflix:progress:<id>`, `videoflix:my-list:<id>`). Several accounts on one browser keep separate data. Every access is wrapped in `try/catch`, so the app keeps working when storage is blocked.

## Deployment

The app is a static single-page app hosted on Vercel. `vercel.json` rewrites all paths to `index.html` so that client-side routes work on reload.

## License

All code in this repository was written by me. It was built as part of a project of the Developer Akademie.

Entwickelt im Rahmen des Weiterbildungsprogramms der Developer Akademie GmbH.
