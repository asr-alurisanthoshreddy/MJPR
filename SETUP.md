# MJPR / HSSAN — Setup Guide

This repository contains a full-stack TypeScript app for flower classification with HSSAN-themed UI.

## Tech Stack

- **Frontend:** React + Vite + Tailwind
- **Backend:** Express (Node.js)
- **API:** `POST /api/predict` for image analysis
- **Runtime behavior:**
  - If `GEMINI_API_KEY` is set, the server calls Gemini (`gemini-2.5-flash`)
  - If `GEMINI_API_KEY` is missing or the API fails, the app returns a deterministic local fallback analysis

---

## Prerequisites

- Node.js **20+**
- npm (comes with Node.js)

Check versions:

```bash
node -v
npm -v
```

---

## 1) Install dependencies

From the project root:

```bash
npm install
```

---

## 2) Configure environment (optional but recommended)

Create a `.env` file in the project root if you want live Gemini analysis:

```env
GEMINI_API_KEY=your_key_here
```

> Without this key, the app still works using local fallback results.

---

## 3) Run in development

```bash
npm run dev
```

The app and API are served from:

- `http://localhost:5000`

Pages:

- `/` — upload and analyze flower images
- `/architecture` — architecture visualization

---

## 4) Build and run production

Build:

```bash
npm run build
```

Start production server:

```bash
npm run start
```

---

## Available scripts

- `npm run dev` — start dev server
- `npm run build` — build client+server
- `npm run start` — run built app
- `npm run check` — TypeScript type check
- `npm run db:push` — push Drizzle schema

---

## Current project structure (high level)

```text
MJPR/
├── client/            # React UI (home + architecture pages)
├── server/            # Express server and API routes
├── shared/            # Shared schemas and route contracts
├── script/build.ts    # Build pipeline
├── package.json       # Scripts and dependencies
└── SETUP.md           # This guide
```

---

## Troubleshooting

### Port 5000 already in use

Run with a different port:

```bash
PORT=3000 npm run dev
```

### `npm install` fails

- Ensure Node.js 20+
- Remove `node_modules` and reinstall:

```bash
rm -rf node_modules package-lock.json
npm install
```

### Windows and `NODE_ENV=development` script format

If `npm run dev` fails in Windows shells, run:

```bash
npx cross-env NODE_ENV=development tsx server/index.ts
```
