# PollkyDoky

Real-time poll creation and voting app. Create a poll, share it via link or QR code, and watch votes come in live.

## Features

- Create polls with up to 10 options
- Share polls via QR code or shareable link
- Live vote updates via WebSocket — no page refresh needed
- User authentication with protected routes
- View and manage your polls from a personal dashboard
- Edit polls (before any votes are cast)

## Tech Stack

- **React 19** + TypeScript
- **React Router v7**
- **TanStack React Query v5**
- **Socket.IO** for real-time updates
- **Tailwind CSS v4**
- **Axios**
- **Zod**
- **Vite**

## Getting Started

### Prerequisites

- Node.js 18+
- A running instance of the PollkyDoky backend API

### Setup

```bash
npm install
```

Create a `.env.local` file in the project root:

```
VITE_API_URL=http://localhost:3000
```

### Development

```bash
npm run dev
```

### Production Build

```bash
npm run build
npm run preview
```

### Lint

```bash
npm run lint
```
