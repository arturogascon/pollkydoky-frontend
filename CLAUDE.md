# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

**Pollky Doky** is a real-time poll creation and voting app (UI in Spanish). Users create polls, share them via QR codes/links, and receive live vote updates via WebSocket.

## Commands

```bash
npm run dev       # Start Vite dev server with HMR
npm run build     # TypeScript compile + production bundle
npm run lint      # ESLint on all .ts/.tsx files
npm run preview   # Preview production build
```

## Tech Stack

- **React 19** + TypeScript (strict mode — unused locals/params are errors)
- **React Router v7** for routing
- **TanStack React Query v5** for server state
- **Axios** with request/response interceptors for auth
- **Socket.IO client** for real-time updates
- **Tailwind CSS v4** with custom CSS variable theme
- **Zod** for form validation
- **CVA** (class-variance-authority) for component variants
- **Mingcute** icon font (`mgc_` prefix, e.g. `mgc_add_line`)

## Architecture

### Authentication

- `AuthContext` holds `token`, `isAuthenticated`, `login()`, `logout()`
- Token persisted in `localStorage`
- Axios request interceptor injects `Authorization: Bearer {token}` automatically
- Axios response interceptor catches 401s → clears token → redirects to `/login`
- `ProtectedRoute` wraps routes; accepts `onlyGuest` prop for guest-only pages

### Server State (React Query)

Query key conventions:
- `["polls"]` — user's poll list
- `["poll", id]` — single poll detail

After mutations, call `queryClient.invalidateQueries()` with the relevant key. The WebSocket listener (`useVoteRealTime`) also updates the cache directly via `setQueryData()` to push live vote counts without re-fetching.

### Real-time Updates

`useVoteRealTime` hook connects Socket.IO and listens for `pollUpdated` events. On each event it calls `queryClient.setQueryData(["poll", id], ...)` to update the React Query cache, triggering a re-render on the poll detail page.

### Vote Tracking

`src/utils/voteStorage.ts` reads/writes `localStorage` keys (`voted_${pollId}`) to track which polls the current browser has already voted on. The poll page uses this to show a "previously voted" indicator and to prevent re-voting UI state.

### API Layer

- `src/api/client.ts` — Axios instance configured with `VITE_API_URL` base URL and interceptors
- `src/api/polls.ts` — poll CRUD + vote endpoint functions
- Custom hooks in `src/hooks/` wrap these in `useQuery`/`useMutation`

## Environment

Create `.env.local`:
```
VITE_API_URL=http://localhost:3000
```

## Styling Conventions

- Custom theme colors defined as CSS variables in `src/styles/index.css` (background, foreground, primary, secondary, border, pink, cyan, yellow, green, purple)
- Use CVA for any component that needs style variants (see `Button.tsx`)
- Custom utility classes in `src/styles/custom-classes.css`
- Mobile-first; `md:` breakpoint for tablet/desktop
